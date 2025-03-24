
import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";

interface EmptyTransactionsStateProps {
  searchTerm: string;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

export const EmptyTransactionsState = ({
  searchTerm,
  hasActiveFilters,
  onResetFilters
}: EmptyTransactionsStateProps) => {
  return (
    <TableCell colSpan={6} className="text-center py-8">
      <p className="text-muted-foreground">No transactions found matching your criteria.</p>
      {(searchTerm || hasActiveFilters) && (
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={onResetFilters}
        >
          Clear Filters
        </Button>
      )}
    </TableCell>
  );
};
