
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow 
} from "@/components/ui/table";
import {
  Card, CardContent, CardDescription,
  CardHeader, CardTitle 
} from "@/components/ui/card";
import { 
  Send, Users, Award, BadgeCheck, 
  Clock, Zap 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

// Mock data for referrals
const referralHistory = [
  {
    id: "1",
    email: "deepak.singh@techfirm.com",
    date: "Apr 2, 2025",
    status: "joined",
    points: 500
  },
  {
    id: "2",
    email: "priya.kumar@financegroup.com",
    date: "Mar 29, 2025",
    status: "pending",
    points: 0
  },
  {
    id: "3",
    email: "rahul.sharma@retailco.com",
    date: "Mar 28, 2025",
    status: "joined",
    points: 500
  },
  {
    id: "4",
    email: "neha.patel@logisticsinc.com",
    date: "Mar 25, 2025",
    status: "pending",
    points: 0
  },
];

const Referrals = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Summary stats
  const totalReferrals = referralHistory.length;
  const totalJoined = referralHistory.filter(r => r.status === "joined").length;
  const totalPoints = referralHistory.reduce((sum, item) => sum + item.points, 0);
  const monthlyLimit = 10;
  const remainingReferrals = monthlyLimit - totalReferrals;
  const referralProgress = (totalReferrals / monthlyLimit) * 100;
  
  const handleInvite = async () => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Invitation sent!",
      description: `We've sent an invitation to ${email}`,
    });
    
    setEmail("");
    setIsSubmitting(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold mb-2">Referrals</h2>
        <p className="text-muted-foreground">
          Invite other businesses to join PaySphere and earn reward points.
        </p>
      </div>
      
      {/* Insights Card */}
      <Card className="bg-gradient-to-br from-slate-50 to-blue-50/50 border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            Referral Insights
          </CardTitle>
          <CardDescription>
            Share the power of rewards across your ecosystem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col bg-white p-4 rounded-lg border border-slate-200">
              <div className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-blue-500" />
                This Month's Referral Score
              </div>
              <div className="text-2xl font-bold">
                {totalJoined} <span className="text-lg font-normal text-muted-foreground">/ {totalReferrals} invited</span>
              </div>
            </div>
            
            <div className="flex flex-col bg-white p-4 rounded-lg border border-slate-200">
              <div className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                <Award className="h-4 w-4 text-amber-500" />
                Points Earned via Referral
              </div>
              <div className="text-2xl font-bold">{totalPoints.toLocaleString()} pts</div>
            </div>
            
            <div className="flex flex-col bg-white p-4 rounded-lg border border-slate-200">
              <div className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                <BadgeCheck className="h-4 w-4 text-green-500" />
                Top Reward
              </div>
              <div className="text-xl font-medium text-green-600">
                Refer 5 more and get a bonus 1,000 pts
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Invite Form and Monthly Limit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Invite Form */}
        <Card className="bg-slate-50 border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Send Invitation</CardTitle>
            <CardDescription>
              Each successful referral earns you 500 points
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Business Email</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter business email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button 
                  onClick={handleInvite}
                  disabled={isSubmitting || !email}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send Invite
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Monthly Referral Limit Card */}
        <Card className="bg-slate-50 border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Monthly Referral Limit</CardTitle>
            <CardDescription>
              Track your monthly referral allocation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-primary">{totalReferrals}</span>
                  <span className="text-xl text-muted-foreground mx-2">/</span>
                  <span className="text-2xl font-medium">{monthlyLimit}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  You can refer <span className="font-medium">{remainingReferrals}</span> more businesses this month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Referral History */}
      <div>
        <h3 className="text-lg font-medium mb-4">Referral History</h3>
        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Invited On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Points Earned</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referralHistory.map((referral) => (
                <TableRow key={referral.id}>
                  <TableCell>{referral.email}</TableCell>
                  <TableCell>{referral.date}</TableCell>
                  <TableCell>
                    {referral.status === "joined" ? (
                      <div className="flex items-center gap-2">
                        <BadgeCheck className="h-4 w-4 text-green-500" />
                        <span className="text-green-600">Joined</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-amber-500" />
                        <span className="text-amber-600">Pending</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {referral.points > 0 ? (
                      <span className="font-medium text-green-600">
                        +{referral.points}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Referrals;
