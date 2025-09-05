import RewardTopUpStep, { RewardPackage } from "./common/RewardTopUpStep";

interface ConditionalRewardStepProps {
  amount: number;
  selectedPaymentMethod?: string;
  enableConditionalRewardTopup: boolean;
  onBack: () => void;
  onNext: (pkg: RewardPackage | null) => void;
}

const ConditionalRewardStep = ({
  amount,
  selectedPaymentMethod,
  enableConditionalRewardTopup,
  onBack,
  onNext,
}: ConditionalRewardStepProps) => {
  // Check if reward top-up should be shown
  // Only show for bank transfers when feature flag is enabled
  const shouldShowRewardTopup = enableConditionalRewardTopup && selectedPaymentMethod?.includes('bank');

  if (!shouldShowRewardTopup) {
    // Skip this step entirely - automatically proceed to final step
    onNext(null);
    return null;
  }

  return (
    <RewardTopUpStep
      amount={amount}
      onBack={onBack}
      onNext={onNext}
    />
  );
};

export default ConditionalRewardStep;