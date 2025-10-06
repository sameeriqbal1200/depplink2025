import React from "react";
import ArrowLeftIcon from "./Icons/ArrowLeftIcon";

interface PaginationProps {
  isArabic?: boolean;
  currentPage: number;
  lastPage: number;
  setCurrentPage: (page: number) => void;
  isMobileOrTablet?: boolean;
}

const StickyPagination: React.FC<PaginationProps> = ({ 
  isArabic = false, 
  currentPage, 
  lastPage, 
  setCurrentPage,
  isMobileOrTablet = false 
}) => {
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (lastPage <= 5) {
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(lastPage - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < lastPage - 2) {
        pages.push("...");
      }

      pages.push(lastPage);
    }
    return pages;
  };

  const pageText = isArabic ? "صفحة" : "Page";
  const dir = isArabic ? "rtl" : "ltr";
  const textClass = isArabic ? "ml-2" : "mr-2";
  const numberFormatter = (num: number) => num;

  if (isMobileOrTablet) {
    const nextIcon = (
       <ArrowLeftIcon size={12} color="#004B7A" className="rotate-180" />
    );

    const prevIcon = (
       <ArrowLeftIcon size={12} color="#004B7A" />
    );

    return (
      <div
        dir={dir}
        className="flex items-center justify-center space-x-1"
      >
        {/* Page Label */}
        <span className={`${textClass} text-10 text-white`}>
          {pageText}
        </span>

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="p-1 text-white">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => setCurrentPage(page as number)}
              className={`bg-white text-primary text-10 leading-[10px] rounded border border-gray hover:bg-white hover:text-primary ${
                currentPage === page
                  ? "px-2 py-1.5 font-bold "
                  : " px-1 py-1 "
              }`}
            > 
              {numberFormatter(page as number)}
            </button>
          )
        )}

        {/* Previous Button */}
        <button
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          className={`px-1 py-1 rounded-full bg-white hover:bg-primary text-[#004B7A] hover:text-white group ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={currentPage === 1}
        >
          {isArabic ? nextIcon : prevIcon}
        </button>

        {/* Next Button */}
        <button
          onClick={() => currentPage < lastPage && setCurrentPage(currentPage + 1)}
          className={`px-1 py-1 rounded-full bg-white hover:bg-primary group text-[#004B7A] hover:text-white ${
            currentPage === lastPage ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={currentPage === lastPage}
        >
          {isArabic ? prevIcon : nextIcon}
        </button>
      </div>
    );
  }

}
export default StickyPagination