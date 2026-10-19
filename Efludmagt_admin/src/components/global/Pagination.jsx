/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/Icons";
import { cn } from "@/lib/utils";

const Pagination = ({ table }) => {
  const totalPages = table.getPageCount();

  const currentPage = table.getState().pagination.pageIndex;
  const pageWindow = 7;

  let startPage = Math.max(0, currentPage - Math.floor(pageWindow / 2));
  let endPage = Math.min(totalPages - 1, startPage + pageWindow - 1);

  if (endPage - startPage + 1 < pageWindow) {
    startPage = Math.max(0, endPage - pageWindow + 1);
  }

  const gotoPage = (pageIndex) => {
    table.setState((old) => ({
      ...old,
      pagination: {
        ...old.pagination,
        pageIndex,
      },
    }));
  };
  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <Button
        disabled={!table.getCanPreviousPage()}
        onClick={table.previousPage}
        variant="secondary"
        className="w-8 h-8 p-0 rounded-full flex flex-row items-center justify-center"
      >
        <img className="w-5 h-5" src={Icons.previous} alt="Previous" />
      </Button>
      <div className="flex flex-row gap-1 bg-primary-foreground rounded-full">
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
          const pageIndex = startPage + i;
          return (
            <Button
              key={pageIndex}
              onClick={() => gotoPage(pageIndex)}
              variant="secondary"
              className={cn(
                `w-8 h-8 p-0 bg-transparent rounded-full flex flex-row items-center justify-center text-black/40`,
                currentPage === pageIndex && "bg-gradient-primary text-white"
              )}
            >
              {pageIndex + 1}
            </Button>
          );
        })}
      </div>
      <Button
        disabled={!table.getCanNextPage()}
        onClick={table.nextPage}
        variant="secondary"
        className="w-8 h-8 p-0 rounded-full flex flex-row items-center justify-center"
      >
        <img className="w-5 h-5" src={Icons.next} alt="next" />
      </Button>
    </div>
  );
};

export default Pagination;
