import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle, Phone, Shield, ArrowLeft } from 'lucide-react';
import { apiService } from '@/services/api';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'mobile-verification' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoadingOtp, setIsLoadingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Store URL params for later use
  const uid = searchParams.get('uid') || '';
  const token = searchParams.get('token') || '';
  const sig = searchParams.get('sig') || '';

  useEffect(() => {
    // Check if we have the required params for mobile verification flow
    if (uid && token && sig) {
      // New flow: verify email with mobile
      setStatus('mobile-verification');
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

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

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

  const handleSendOtp = async () => {
    if (mobileNumber.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoadingOtp(true);
    try {
      const response = await apiService.auth.verifyEmailWithMobile(uid, token, sig, mobileNumber);
      toast.success(response.message || 'OTP sent to your mobile number');
      setIsOtpSent(true);
      setCountdown(600); // 10 minutes = 600 seconds
    } catch (error: any) {
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setIsLoadingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter the 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    try {
      const response = await apiService.auth.verifyMobileOtp(uid, otp);
      setStatus('success');
      setMessage(response.message || 'Mobile number verified successfully. You can now log in.');

      toast.success('Verification successful!');

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || 'Invalid or expired OTP');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = () => {
    setOtp('');
    setCountdown(600);
    handleSendOtp();
  };

  return (
    <AuroraBackground>
      <Card className="w-full max-w-md shadow-lg transition-all duration-500 px-4 sm:px-6 bg-white/80 backdrop-blur-sm border-white/20">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <img
              src="https://ik.imagekit.io/mddzdzy9m/Xcentro/logo_dark_transparent.png?updatedAt=1763483534131&tr=w-200,h-200,c-at_max"
              alt="Xcentro Logo"
              className="h-24 w-auto object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold">
            {status === 'loading'
              ? "Verifying Email"
              : status === 'mobile-verification'
                ? "Verify Mobile Number"
                : status === 'success'
                  ? "Verification Complete!"
                  : "Verification Failed"
            }
          </h1>
          <p className="text-sm text-muted-foreground">
            {status === 'loading'
              ? "Please wait while we verify your email address..."
              : status === 'mobile-verification'
                ? (isOtpSent
                    ? `Enter the OTP sent to ${mobileNumber}`
                    : "Enter your mobile number to receive OTP")
                : status === 'success'
                  ? message
                  : ""
            }
          </p>
        </CardHeader>
        <CardContent className="text-center">
          {status === 'loading' && (
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          )}

          {status === 'mobile-verification' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="mobile" className="text-sm font-medium">
                  Mobile Number
                </label>
                <div className="relative mt-2">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    disabled={isOtpSent}
                    className="pl-10"
                  />
                </div>
              </div>

              {!isOtpSent ? (
                <Button
                  onClick={handleSendOtp}
                  disabled={mobileNumber.length !== 10 || isLoadingOtp}
                  className="w-full"
                >
                  {isLoadingOtp ? "Sending..." : "Get OTP"}
                </Button>
              ) : (
                <>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Enter OTP
                    </label>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={(value) => setOtp(value)}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>

                  <Button
                    onClick={handleVerifyOtp}
                    disabled={otp.length !== 6 || isVerifying}
                    className="w-full"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    {isVerifying ? "Verifying..." : "Verify Mobile Number"}
                  </Button>

                  <div className="text-center">
                    {countdown > 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Resend OTP in {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                      </p>
                    ) : (
                      <Button
                        variant="link"
                        onClick={handleResendOtp}
                        disabled={isLoadingOtp}
                      >
                        Resend OTP
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
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
