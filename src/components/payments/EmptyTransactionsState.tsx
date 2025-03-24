
interface EmptyTransactionsStateProps {
  message?: string;
}

const EmptyTransactionsState = ({ message = "No transactions found matching your criteria." }: EmptyTransactionsStateProps) => {
  return (
    <div className="p-8 text-center">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
};

export default EmptyTransactionsState;
