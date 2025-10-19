
import { cn } from "@/lib/utils";
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious
} from "@/components/ui/pagination";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const TablePagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}: TablePaginationProps) => {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-muted-foreground">
        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} transactions
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              className={cn(currentPage === 1 && "opacity-50 pointer-events-none")}
            />
          </PaginationItem>

          {/* Generate page numbers */}
          {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
            let pageNum = index + 1;

            // Adjust pagination display for many pages
            if (totalPages > 5) {
              if (currentPage > 3 && currentPage <= totalPages - 2) {
                pageNum = currentPage - 2 + index;
              } else if (currentPage > totalPages - 2) {
                pageNum = totalPages - 4 + index;
              }
            }

            return (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  isActive={currentPage === pageNum}
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              className={cn(currentPage === totalPages && "opacity-50 pointer-events-none")}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default TablePagination;
