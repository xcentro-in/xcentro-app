
type RedemptionTypeIconProps = {
  type: string;
};

export const RedemptionTypeIcon = ({ type }: RedemptionTypeIconProps) => {
  switch(type) {
    case "Flight":
      return <span className="mr-2">✈️</span>;
    case "Hotel":
      return <span className="mr-2">🏨</span>;
    case "Gift Card":
      return <span className="mr-2">🎁</span>;
    case "Transfer":
      return <span className="mr-2">🔁</span>;
    default:
      return null;
  }
};
