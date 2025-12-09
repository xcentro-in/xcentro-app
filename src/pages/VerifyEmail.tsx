import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle, Smartphone } from 'lucide-react';
import { apiService } from '@/services/api';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'mobile-input' | 'otp-input' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  // Store URL params for later use
  const uid = searchParams.get('uid') || '';
  const token = searchParams.get('token') || '';
  const sig = searchParams.get('sig') || '';

  useEffect(() => {
    // Check if we have the required params for mobile verification flow
    if (uid && token && sig) {
      // New flow: verify email with mobile
      setStatus('mobile-input');
      setMessage('Please enter your mobile number to complete verification');
    } else {
      // Old flow: just token-based email verification (backward compatibility)
      const emailToken = searchParams.get('token');
      if (!emailToken) {
        setStatus('error');
        setMessage('Verification token is missing');
        return;
      }
      verifyEmailOnly(emailToken);
    }
  }, [searchParams]);

  // Countdown timer for OTP expiry
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  const verifyEmailOnly = async (emailToken: string) => {
    try {
      const response = await apiService.auth.verifyEmail(emailToken);
      setStatus('success');
      setMessage(response.message || 'Email verified successfully. You can now log in.');

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'Failed to verify email');
    }
  };

  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate mobile number (10 digits)
    if (!/^\d{10}$/.test(mobileNumber)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiService.auth.verifyEmailWithMobile(uid, token, sig, mobileNumber);
      toast.success(response.message || 'OTP sent to your mobile number');
      setStatus('otp-input');
      setOtpTimer(600); // 10 minutes = 600 seconds
    } catch (error: any) {
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setIsSubmitting(true);
    try {
      const response = await apiService.auth.verifyEmailWithMobile(uid, token, sig, mobileNumber);
      toast.success(response.message || 'OTP resent successfully');
      setOtpTimer(600);
      setOtp(''); // Clear previous OTP
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate OTP (6 digits)
    if (!/^\d{6}$/.test(otp)) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiService.auth.verifyMobileOtp(uid, otp);
      setStatus('success');
      setMessage(response.message || 'Mobile number verified successfully. You can now log in.');

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || 'Invalid or expired OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AuroraBackground>
      <Card className="w-full max-w-md shadow-lg transition-all duration-500 px-4 sm:px-6 bg-white/80 backdrop-blur-sm border-white/20">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <img
              src="https://ik.imagekit.io/mddzdzy9m/Xcentro/logo_dark_transparent.png?updatedAt=1763483534131=w-200,h-200,c-at_max"
              alt="Xcentro Logo"
              className="h-24 w-auto object-contain"
            />
          </div>
        </CardHeader>
        <CardContent className="text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Email</h1>
              <p className="text-muted-foreground">Please wait while we verify your email address...</p>
            </>
          )}

          {status === 'mobile-input' && (
            <>
              <Smartphone className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Mobile Number</h1>
              <p className="text-muted-foreground mb-6">{message}</p>
              <form onSubmit={handleMobileSubmit} className="space-y-4 text-left">
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="9876543210"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    maxLength={10}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Enter your 10-digit mobile number</p>
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    'Send OTP'
                  )}
                </Button>
              </form>
            </>
          )}

          {status === 'otp-input' && (
            <>
              <Smartphone className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Enter OTP</h1>
              <p className="text-muted-foreground mb-6">
                We've sent a 6-digit OTP to {mobileNumber}
              </p>
              <form onSubmit={handleOtpSubmit} className="space-y-4 text-left">
                <div className="space-y-2">
                  <Label htmlFor="otp">OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    className="text-center text-2xl tracking-widest"
                    required
                  />
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">
                      {otpTimer > 0 ? `OTP expires in ${formatTime(otpTimer)}` : 'OTP expired'}
                    </span>
                    {otpTimer === 0 && (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isSubmitting}
                        className="text-primary hover:underline"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify OTP'
                  )}
                </Button>
                {otpTimer > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResendOtp}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    Resend OTP
                  </Button>
                )}
              </form>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Complete!</h1>
              <p className="text-muted-foreground mb-4">{message}</p>
              <p className="text-sm text-muted-foreground">Redirecting to login page...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
              <p className="text-muted-foreground mb-6">{message}</p>
              <Button
                onClick={() => navigate('/login')}
                className="w-full"
              >
                Go to Login
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </AuroraBackground>
  );
};

export default VerifyEmail;
