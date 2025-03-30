
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Search, FileText, Send, LifeBuoy, Book, Mail, Phone } from "lucide-react";
import SupportFaqSection from "./support/SupportFaqSection";
import SupportTicketForm from "./support/SupportTicketForm";
import { FAQ } from "@/types/support";
import { mockFaqs } from "@/data/mockFaqs";

const SupportSettings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchAttempts, setSearchAttempts] = useState(0);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [activeFaqCategory, setActiveFaqCategory] = useState("all");
  const [faqSolvedIssue, setFaqSolvedIssue] = useState<boolean | null>(null);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = mockFaqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFaqs(filtered);
    } else {
      setFilteredFaqs([]);
    }
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      setSearchAttempts((prev) => prev + 1);
      
      // If user has searched twice and still hasn't found what they need
      if (searchAttempts >= 1) {
        setShowTicketForm(true);
      }
    }
  };

  const handleFaqFeedback = (solved: boolean) => {
    setFaqSolvedIssue(solved);
    if (!solved) {
      setShowTicketForm(true);
    } else {
      // Reset the form if the FAQ solved the issue
      setSearchQuery("");
      setSearchAttempts(0);
      setShowTicketForm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <LifeBuoy className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold tracking-tight">Help & Support</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Find Help
          </CardTitle>
          <CardDescription>
            Search our knowledge base or browse FAQs to find answers quickly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for help (e.g., 'How do I add a payee?')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Button 
                type="submit" 
                size="sm" 
                className="absolute right-1 top-1"
              >
                Search
              </Button>
            </div>
          </form>

          {filteredFaqs.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Relevant FAQs:</h3>
              <ScrollArea className="h-[200px]">
                <SupportFaqSection 
                  faqs={filteredFaqs} 
                  onFaqClick={() => {
                    if (faqSolvedIssue === null) {
                      setTimeout(() => {
                        const confirmed = window.confirm("Did this FAQ answer your question?");
                        handleFaqFeedback(confirmed);
                      }, 2000); // Give user time to read the FAQ
                    }
                  }}
                />
              </ScrollArea>
            </div>
          )}

          {searchAttempts === 1 && filteredFaqs.length === 0 && (
            <div className="mt-4 p-3 bg-muted rounded-md">
              <p className="text-sm">No results found. Try searching with different keywords or check our FAQ categories below.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {faqSolvedIssue === true && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500">Resolved</Badge>
              <p className="text-sm">Great! We're glad the FAQ helped solve your issue.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!showTicketForm ? (
        <Tabs defaultValue="all" value={activeFaqCategory} onValueChange={setActiveFaqCategory}>
          <div className="flex items-center gap-2 mb-4">
            <Book className="h-5 w-5" />
            <h3 className="text-lg font-medium">Browse FAQ Categories</h3>
          </div>
          
          <TabsList className="mb-4">
            <TabsTrigger value="all">All FAQs</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="users">User Access</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <Card>
            <CardContent className="pt-6">
              <TabsContent value="all">
                <SupportFaqSection 
                  faqs={mockFaqs} 
                  onFaqClick={() => {
                    if (faqSolvedIssue === null) {
                      setTimeout(() => {
                        const confirmed = window.confirm("Did this FAQ answer your question?");
                        handleFaqFeedback(confirmed);
                      }, 2000);
                    }
                  }}
                />
              </TabsContent>
              
              <TabsContent value="payments">
                <SupportFaqSection 
                  faqs={mockFaqs.filter(faq => faq.category === "payments")} 
                  onFaqClick={() => {
                    if (faqSolvedIssue === null) {
                      setTimeout(() => {
                        const confirmed = window.confirm("Did this FAQ answer your question?");
                        handleFaqFeedback(confirmed);
                      }, 2000);
                    }
                  }}
                />
              </TabsContent>
              
              <TabsContent value="rewards">
                <SupportFaqSection 
                  faqs={mockFaqs.filter(faq => faq.category === "rewards")} 
                  onFaqClick={() => {
                    if (faqSolvedIssue === null) {
                      setTimeout(() => {
                        const confirmed = window.confirm("Did this FAQ answer your question?");
                        handleFaqFeedback(confirmed);
                      }, 2000);
                    }
                  }}
                />
              </TabsContent>

              <TabsContent value="users">
                <SupportFaqSection 
                  faqs={mockFaqs.filter(faq => faq.category === "users")} 
                  onFaqClick={() => {
                    if (faqSolvedIssue === null) {
                      setTimeout(() => {
                        const confirmed = window.confirm("Did this FAQ answer your question?");
                        handleFaqFeedback(confirmed);
                      }, 2000);
                    }
                  }}
                />
              </TabsContent>

              <TabsContent value="wallet">
                <SupportFaqSection 
                  faqs={mockFaqs.filter(faq => faq.category === "wallet")} 
                  onFaqClick={() => {
                    if (faqSolvedIssue === null) {
                      setTimeout(() => {
                        const confirmed = window.confirm("Did this FAQ answer your question?");
                        handleFaqFeedback(confirmed);
                      }, 2000);
                    }
                  }}
                />
              </TabsContent>

              <TabsContent value="security">
                <SupportFaqSection 
                  faqs={mockFaqs.filter(faq => faq.category === "security")} 
                  onFaqClick={() => {
                    if (faqSolvedIssue === null) {
                      setTimeout(() => {
                        const confirmed = window.confirm("Did this FAQ answer your question?");
                        handleFaqFeedback(confirmed);
                      }, 2000);
                    }
                  }}
                />
              </TabsContent>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 p-4">
              <div className="w-full">
                <p className="text-sm text-muted-foreground mb-2">Can't find what you're looking for?</p>
                <Button 
                  onClick={() => setShowTicketForm(true)} 
                  className="w-full sm:w-auto"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Submit Support Ticket
                </Button>
              </div>
            </CardFooter>
          </Card>
        </Tabs>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Submit a Support Ticket
            </CardTitle>
            <CardDescription>
              Our support team will help you resolve your issue as quickly as possible
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SupportTicketForm 
              onCancel={() => {
                setShowTicketForm(false);
                setSearchAttempts(0);
                setFaqSolvedIssue(null);
              }}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Contact Support Directly
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row">
          <div className="flex items-center gap-2 rounded-md border p-3 flex-1">
            <Mail className="h-4 w-4 text-primary" />
            <div>
              <h4 className="text-sm font-medium">Email Support</h4>
              <p className="text-sm text-muted-foreground">support@PaySphere.com</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-md border p-3 flex-1">
            <Phone className="h-4 w-4 text-primary" />
            <div>
              <h4 className="text-sm font-medium">Phone Support</h4>
              <p className="text-sm text-muted-foreground">+1 (800) 123-4567</p>
              <p className="text-xs text-muted-foreground">Available 9am - 5pm ET, Mon-Fri</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportSettings;
