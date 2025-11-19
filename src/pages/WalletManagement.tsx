import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, CreditCard, Building2, ShieldCheck, ChevronLeft, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePageTitle } from "@/contexts/PageTitleContext";
import { EmptyWallet } from "@/components/wallet/EmptyWallet";
import { useWallet } from "@/hooks/useWallet";
import { StoredCard, BankAccount } from "@/types/wallet";
import { useAuth } from "@/contexts/AuthContext";
import { canViewFeature } from "@/lib/featureFlags";
import { toast } from "sonner";
import { walletAPI } from "@/services/api";
import { getCardNetworkLogo } from "@/lib/cardNetworks";

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

  // Card enabled/disabled state management
  const [cardEnabledStates, setCardEnabledStates] = useState<Record<string, boolean>>({});
  const debounceTimersRef = useRef<Record<string, NodeJS.Timeout>>({});

  // Initialize card states from API data
  useEffect(() => {
    if (cards.length > 0) {
      const initialStates: Record<string, boolean> = {};
      cards.forEach(card => {
        // Only track active/inactive cards, not pending/failed
        if (card.card_status === 'active' || card.card_status === 'inactive') {
          initialStates[card.card_id] = card.card_status === 'active';
        }
      });
      setCardEnabledStates(initialStates);
    }
  }, [cards]);

  // Cleanup debounce timers on unmount
  useEffect(() => {
    return () => {
      Object.values(debounceTimersRef.current).forEach(timer => clearTimeout(timer));
    };
  }, []);

  // Handle card toggle with debouncing
  const handleCardToggle = useCallback((cardId: string, newEnabledState: boolean) => {
    if (!user?.businessId) {
      toast.error('Business ID not found. Please log in again.');
      return;
    }

    // Optimistically update UI immediately
    setCardEnabledStates(prev => ({
      ...prev,
      [cardId]: newEnabledState
    }));

    // Clear existing debounce timer for this card
    if (debounceTimersRef.current[cardId]) {
      clearTimeout(debounceTimersRef.current[cardId]);
    }

    // Set new debounce timer (500ms delay)
    debounceTimersRef.current[cardId] = setTimeout(async () => {
      try {
        // Call API to update card status
        await walletAPI.updateCardStatus(user.businessId, cardId, newEnabledState);

        console.log(`API call: Updated card ${cardId} to ${newEnabledState ? 'active' : 'inactive'}`);

        // Show success toast
        toast.success(
          newEnabledState ? 'Card enabled successfully' : 'Card disabled successfully'
        );
      } catch (error) {
        console.error('Failed to update card status:', error);

        // Revert optimistic update on error
        setCardEnabledStates(prev => ({
          ...prev,
          [cardId]: !newEnabledState
        }));

        toast.error('Failed to update card status. Please try again.');
      } finally {
        // Clean up the timer reference
        delete debounceTimersRef.current[cardId];
      }
    }, 500);
  }, [user?.businessId]);

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
    // Determine if card can be toggled (only active/inactive cards)
    const isPending = card.card_status === 'pending';
    const isFailed = card.card_status === 'failed';
    const showToggle = card.card_status === 'active' || card.card_status === 'inactive';

    // Get current enabled state from local state for toggleable cards, fallback to card status
    const isEnabled = showToggle
      ? (cardEnabledStates[card.card_id] ?? (card.card_status === 'active'))
      : false;

    // Determine visual state based on toggle state for toggleable cards, or card status for others
    const isVisuallyInactive = showToggle ? !isEnabled : (isPending || isFailed || card.card_status === 'inactive');

    return (
      <div
        key={card.card_id}
        className={`flex flex-col p-5 transition-all duration-300 border-b border-slate-100 last:border-b-0 ${
          isVisuallyInactive
            ? 'bg-slate-50/30 opacity-60'
            : 'hover:bg-slate-50/50 cursor-pointer group'
        }`}
      >
        <div className="flex items-center">
          {/* Icon */}
          <div className="w-12 h-8 rounded-lg flex items-center justify-center mr-5 flex-shrink-0">
            {getCardNetworkLogo(card.card_type) ? (
              <img
                src={getCardNetworkLogo(card.card_type)!}
                alt={card.card_type}
                className={`h-6 w-auto object-contain ${isVisuallyInactive ? 'grayscale' : ''}`}
              />
            ) : (
              <div className={`w-12 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${
                isVisuallyInactive ? 'from-slate-400 to-slate-500' : 'from-slate-600 to-slate-700'
              }`}>
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
                <h3 className={`font-medium text-base ${isVisuallyInactive ? 'text-slate-500' : 'text-slate-900'}`}>
                  {card.nickname || card.issuer_bank}
                </h3>
                {card.nickname && card.issuer_bank && (
                  <span className="text-xs text-slate-400">({card.issuer_bank})</span>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`font-mono text-sm ${isVisuallyInactive ? 'text-slate-400' : 'text-slate-600'}`}>
                  •••• •••• •••• {card.last_four_digits}
                </span>
                <Badge variant="outline" className={`text-xs px-2 py-0.5 ${
                  card.card_category === 'credit'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {card.card_category === 'credit' ? 'Credit' : 'Debit'}
                </Badge>
                {/* Status badges - for toggleable cards, use toggle state */}
                {showToggle && isEnabled && (
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs px-2 py-0.5">
                    Active
                  </Badge>
                )}
                {showToggle && !isEnabled && (
                  <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-300 text-xs px-2 py-0.5">
                    Inactive
                  </Badge>
                )}
                {/* Non-toggleable status badges */}
                {isPending && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 text-xs px-2 py-0.5 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Pending
                  </Badge>
                )}
                {isFailed && (
                  <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 text-xs px-2 py-0.5">
                    Failed
                  </Badge>
                )}
              </div>
              <div className={`flex items-center gap-2 text-xs ${isVisuallyInactive ? 'text-slate-400' : 'text-slate-500'}`}>
                <span>Expires {card.expiry_month}/{card.expiry_year}</span>
              </div>
            </div>
          </div>

          {/* Toggle Switch for Active/Inactive Cards */}
          {showToggle && (
            <div className="ml-6 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor={`card-toggle-${card.card_id}`}
                  className="text-sm font-medium text-slate-700 cursor-pointer"
                >
                  Enabled
                </Label>
                <Switch
                  id={`card-toggle-${card.card_id}`}
                  checked={isEnabled}
                  onCheckedChange={(checked) => handleCardToggle(card.card_id, checked)}
                  className="data-[state=checked]:bg-emerald-600"
                />
              </div>
            </div>
          )}
        </div>

        {/* Failed Tokenization Notice */}
        {isFailed && card.is_failed_tokenization && (
          <div className="mt-3 pl-[4.25rem]">
            <div className="bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
              <p className="text-xs text-amber-700">
                <span className="font-medium">Verification failed.</span> This card will be displayed for 7 days only.
                {card.failure_reason && (
                  <span className="block mt-1 text-amber-600">
                    Reason: {card.failure_reason}
                  </span>
                )}
              </p>
            </div>
          </div>
        )}
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