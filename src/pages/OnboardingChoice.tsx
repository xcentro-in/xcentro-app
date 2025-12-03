import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users } from "lucide-react";
import { AuroraBackground } from "@/components/ui/aurora-background";

const OnboardingChoice = () => {
  const navigate = useNavigate();

  const handleJoinExistingBusiness = () => {
    // Navigate to user onboarding for joining existing business
    navigate("/onboarding", { state: { flow: "join-business" } });
  };

  const handleCreateNewBusiness = () => {
    // Navigate to business onboarding for creating new business
    navigate("/business-onboarding", { state: { flow: "create-business" } });
  };

  return (
    <AuroraBackground>
      <Card className="w-full max-w-2xl shadow-lg transition-all duration-500 px-4 sm:px-6 bg-white/80 backdrop-blur-sm border-white/20">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <img
              src="https://ik.imagekit.io/mddzdzy9m/Xcentro/logo_dark_transparent.png?updatedAt=1745093381726&tr=w-200,h-200,c-at_max"
              alt="Xcentro Logo"
              className="h-24 w-auto object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold">Welcome to Xcentro!</h1>
          <p className="text-sm text-muted-foreground">
            Choose how you'd like to get started
          </p>
        </CardHeader>
        <CardContent className="space-y-4 py-6">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Join Existing Business Card */}
            <Card
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary border-2"
              onClick={handleJoinExistingBusiness}
            >
              <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                <div className="rounded-full bg-blue-100 p-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">Join Existing Business</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect with a business that's already on Xcentro using their GSTIN
                  </p>
                </div>
                <Button
                  className="w-full mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJoinExistingBusiness();
                  }}
                >
                  Join Business
                </Button>
              </CardContent>
            </Card>

            {/* Create New Business Card */}
            <Card
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary border-2"
              onClick={handleCreateNewBusiness}
            >
              <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                <div className="rounded-full bg-green-100 p-4">
                  <Building2 className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">Create New Business</h3>
                  <p className="text-sm text-muted-foreground">
                    Onboard your business to Xcentro and start managing payments
                  </p>
                </div>
                <Button
                  className="w-full mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateNewBusiness();
                  }}
                >
                  Create Business
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="pt-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                What's the difference?
              </h4>
              <ul className="text-sm text-blue-800 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    <strong>Join Existing:</strong> If your business is already registered on Xcentro,
                    join using the GSTIN. Complete your user profile and wait for approval.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    <strong>Create New:</strong> If this is your first time, register your business details,
                    complete your user profile, and you're ready to go!
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </AuroraBackground>
  );
};

export default OnboardingChoice;
