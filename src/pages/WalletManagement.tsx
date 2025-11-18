import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, CreditCard, Building2, ShieldCheck, ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePageTitle } from "@/contexts/PageTitleContext";
import { EmptyWallet } from "@/components/wallet/EmptyWallet";
import { useWallet } from "@/hooks/useWallet";
import { StoredCard, BankAccount } from "@/types/wallet";
import { useAuth } from "@/contexts/AuthContext";
import { canViewFeature } from "@/lib/featureFlags";

const WalletManagement = () => {
  const navigate = useNavigate();
  const { setTitle } = usePageTitle();
  const { user, optimisticallyUpdateOnboardingFlag } = useAuth();
  const { cards, bankAccounts, isLoading, error } = useWallet();

  const showEmptyState = cards.length === 0 && bankAccounts.length === 0;
  const hasPaymentMethods = cards.length > 0 || bankAccounts.length > 0;

  // Check which payment methods are enabled via feature flags
  const enabledPaymentMethods = useMemo(() => {
    return {
      card: canViewFeature('PAYMENT_METHOD_CARD', user),
      bank: canViewFeature('PAYMENT_METHOD_BANK', user),
    };
  }, [user]);

  // Get the first available payment method as default
  const defaultPaymentMethod = useMemo(() => {
    if (enabledPaymentMethods.card) return 'cards';
    if (enabledPaymentMethods.bank) return 'banks';
    return 'cards'; // Fallback
  }, [enabledPaymentMethods]);

  // Calculate grid columns based on enabled payment methods count
  const enabledPaymentMethodsCount = useMemo(() => {
    return Object.values(enabledPaymentMethods).filter(Boolean).length;
  }, [enabledPaymentMethods]);

  const gridColsClass = useMemo(() => {
    switch (enabledPaymentMethodsCount) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-2';
      default: return 'grid-cols-2';
    }
  }, [enabledPaymentMethodsCount]);

  useEffect(() => {
    setTitle("Payment Sources");
  }, [setTitle]);

  // Verification: Check if payment methods exist while flag is false, then flip flag
  useEffect(() => {
    if (!isLoading && !error && user) {
      // If flag is false BUT we have payment methods, optimistically update the flag
      if (!user.hasAddedPaymentMethod && hasPaymentMethods) {
        optimisticallyUpdateOnboardingFlag('hasAddedPaymentMethod', true);
      }
    }
  }, [isLoading, error, hasPaymentMethods, cards.length, bankAccounts.length, user, optimisticallyUpdateOnboardingFlag]);

  // TODO: Usage data not available in current API response
  // The following metadata fields are currently not available from the backend:
  // - isDefault/primary status
  // - usage level (high/medium/low)
  // - transaction count
  // - total amount spent
  // - lastUsed timestamp
  // These will need to be added to the API response when backend support is available

  /* const getUsageLevel = (methodId: string) => {
    // Mock usage data - in real app this would come from API
    const usageData: Record<string, { level: 'high' | 'medium' | 'low'; transactions: number; amount: string; lastUsed: string }> = {
      "1": { level: 'high', transactions: 47, amount: '₹1.2L', lastUsed: '2 hours ago' },
      "2": { level: 'medium', transactions: 12, amount: '₹45K', lastUsed: 'yesterday' },
      "3": { level: 'medium', transactions: 23, amount: '₹89K', lastUsed: 'today' },
      "4": { level: 'low', transactions: 5, amount: '₹25K', lastUsed: '5 days ago' },
      "5": { level: 'low', transactions: 8, amount: '₹35K', lastUsed: '3 days ago' },
    };
    return usageData[methodId] || { level: 'low', transactions: 0, amount: '₹0', lastUsed: 'never' };
  }; */

  const getCardNetworkIcon = (cardType: string) => {
    switch (cardType.toLowerCase()) {
      case "visa":
        return "/lovable-uploads/b9b4153b-9e1f-4d42-bf1a-d9542c830869.png";
      case "mastercard":
        return "/lovable-uploads/d410a8cf-777f-48c4-8430-bea8af7a96cc.png";
      case "amex":
        return "/lovable-uploads/e5fb902c-794e-4682-8d5a-8acf5a9e0c0d.png";
      default:
        return null;
    }
  };

  // Determine what content to show
  const renderContent = () => {
    // Show loading state with skeleton
    if (isLoading) {
      return (
        <>
          {/* Card Skeleton */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="animate-pulse space-y-0">
                {/* Tabs Skeleton */}
                <div className="px-6 pb-4">
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
                {/* Payment Method Items Skeleton */}
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center p-5 border-b border-slate-100 last:border-b-0">
                    <div className="w-12 h-8 bg-gray-200 rounded-lg mr-5"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-5 w-40 bg-gray-200 rounded"></div>
                      <div className="h-4 w-64 bg-gray-200 rounded"></div>
                      <div className="h-3 w-32 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security Notice Skeleton */}
          <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
        </>
      );
    }

    // Show error state
    if (error) {
      return (
        <Card className="animate-scale-in">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
              <Alert variant="destructive" className="max-w-md">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <p className="mt-4 text-muted-foreground text-sm">
                Unable to load payment sources. Please try adding a new source or contact support.
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Show empty state if no payment methods
    if (showEmptyState) {
      return <EmptyWallet />;
    }

    // Show payment methods
    return (
      <>
        {/* Payment Methods Tabs */}
        <Card className="animate-scale-in overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue={defaultPaymentMethod} className="w-full">
              <div className="px-6 pb-4">
                <TabsList className={`grid w-full ${gridColsClass}`}>
                  {enabledPaymentMethods.card && (
                    <TabsTrigger value="cards" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Cards ({cards.length})
                    </TabsTrigger>
                  )}
                  {enabledPaymentMethods.bank && (
                    <TabsTrigger value="banks" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Banks ({bankAccounts.length})
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>

              {enabledPaymentMethods.card && (
                <TabsContent value="cards" className="mt-0">
                {cards.length > 0 ? (
                  <div className="space-y-0">
                    {cards.map((card) => renderCard(card))}
                  </div>
                ) : (
                  <div className="text-center py-12 px-6">
                    <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No cards added</h3>
                    <p className="text-muted-foreground mb-4">Add your first credit or debit card to get started</p>
                    <Button
                      variant="outline"
                      onClick={() => navigate("/wallet/add")}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Card
                    </Button>
                  </div>
                )}
              </TabsContent>
              )}

              {enabledPaymentMethods.bank && (
                <TabsContent value="banks" className="mt-0">
                {bankAccounts.length > 0 ? (
                  <div className="space-y-0">
                    {bankAccounts.map((account) => renderBankAccount(account))}
                  </div>
                ) : (
                  <div className="text-center py-12 px-6">
                    <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No bank accounts added</h3>
                    <p className="text-muted-foreground mb-4">Add your bank account for direct transfers</p>
                    <Button
                      variant="outline"
                      onClick={() => navigate("/wallet/add")}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Bank Account
                    </Button>
                  </div>
                )}
              </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Alert className="bg-primary/5 border-primary/20 shadow-sm animate-fade-in">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <AlertDescription className="flex items-center text-sm font-medium text-primary/90">
            <span>
              For security, card numbers are masked and CVV values are never stored.
              All payment data is encrypted and stored in compliance with PCI DSS standards.
            </span>
          </AlertDescription>
        </Alert>
      </>
    );
  };

  const renderCard = (card: StoredCard) => {
    return (
      <div
        key={card.card_id}
        className="flex items-center p-5 hover:bg-slate-50/50 transition-all duration-300 cursor-pointer group border-b border-slate-100 last:border-b-0"
      >
        {/* Icon */}
        <div className="w-12 h-8 rounded-lg flex items-center justify-center mr-5 flex-shrink-0">
          {getCardNetworkIcon(card.card_type) ? (
            <img
              src={getCardNetworkIcon(card.card_type)}
              alt={card.card_type}
              className="h-6 w-auto object-contain"
            />
          ) : (
            <div className="w-12 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-slate-600 to-slate-700">
              <span className="text-white text-xs font-medium">
                {card.card_type.toUpperCase().slice(0, 4)}
              </span>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-base text-slate-900">
                {card.issuer_bank}
              </h3>
              {/* TODO: Primary badge not available in API - requires isDefault field */}
              {/* {card.is_primary && (
                <Badge className="bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs px-2 py-0.5">
                  Primary
                </Badge>
              )} */}
            </div>
            {/* TODO: Usage level not available in API */}
            {/* <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${
                usage.level === 'high' ? 'bg-green-500'
                : usage.level === 'medium' ? 'bg-amber-500'
                : 'bg-slate-400'
              }`}></div>
              <span className={`text-xs font-medium uppercase tracking-wide ${
                usage.level === 'high' ? 'text-green-600'
                : usage.level === 'medium' ? 'text-amber-600'
                : 'text-slate-500'
              }`}>
                {usage.level === 'high' ? 'High Use' : usage.level === 'medium' ? 'Regular' : 'Occasional'}
              </span>
            </div> */}
          </div>

          {/* Details */}
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-slate-600">
                •••• •••• •••• {card.last_four_digits}
              </span>
              <Badge variant="outline" className={`text-xs px-2 py-0.5 ${
                card.card_category === 'credit'
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                {card.card_category === 'credit' ? 'Credit' : 'Debit'}
              </Badge>
              {card.is_active && (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs px-2 py-0.5">
                  Active
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Expires {card.expiry_month}/{card.expiry_year}</span>
            </div>
          </div>

          {/* TODO: Meta information not available in API */}
          {/* <div className="flex items-center gap-5 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Used {usage.lastUsed}</span>
            </div>
          </div> */}
        </div>

        {/* TODO: Stats not available in API */}
        {/* <div className="flex gap-6 ml-6">
          <div className="text-center">
            <div className="text-lg font-semibold text-slate-900">{usage.transactions}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider">Uses</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-slate-900">{usage.amount}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider">Amount</div>
          </div>
        </div> */}
      </div>
    );
  };

  const renderBankAccount = (account: BankAccount) => {
    return (
      <div
        key={account.account_id}
        className="flex items-center p-5 hover:bg-slate-50/50 transition-all duration-300 cursor-pointer group border-b border-slate-100 last:border-b-0"
      >
        {/* Icon */}
        <div className="w-12 h-8 rounded-lg flex items-center justify-center mr-5 flex-shrink-0">
          <div className="w-12 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-emerald-600 to-emerald-700">
            <span className="text-white text-xs font-medium">
              {account.bank_name.slice(0, 4).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-base text-slate-900">
                {account.bank_name}
              </h3>
              {/* TODO: Primary badge not available in API */}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-slate-600">
                Account ending {account.last_five_digits}
              </span>
              <Badge variant="outline" className={`text-xs px-2 py-0.5 ${
                account.account_type === 'current'
                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                {account.account_type === 'current' ? 'Current' : 'Savings'}
              </Badge>
              {account.is_verified && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs px-2 py-0.5">
                  Verified
                </Badge>
              )}
              {account.is_active && (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs px-2 py-0.5">
                  Active
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>IFSC: {account.ifsc_code}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header - Always visible */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <p className="text-muted-foreground mt-1">Manage your business payment methods</p>
          </div>
        </div>

        <Button
          className="gap-2"
          onClick={() => navigate("/wallet/add")}
        >
          <Plus className="h-4 w-4" />
          Configure Payment Source
        </Button>
      </div>

      {/* Content - Conditional based on state */}
      {renderContent()}
    </div>
  );
};

export default WalletManagement;