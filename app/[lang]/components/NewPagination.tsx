import React from "react";

interface PaginationProps {
  isArabic?: boolean;
  currentPage: number;
  lastPage: number;
  setCurrentPage: (page: number) => void;
  isMobileOrTablet?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({ 
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
  const numberFormatter = (num: number) => isArabic ? num.toLocaleString("ar-EG") : num;

  if (isMobileOrTablet) {
    const nextIcon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="15"
        viewBox="0 0 14 15"
        fill="none"
      >
        <path
          d="M4.07651 4.24507L7.68647 7.86529L4.07651 11.4855L6.09686 13.5161L11.7579 7.85503L6.09686 2.21447L4.07651 4.24507Z"
          fill="currentColor"
        />
      </svg>
    );

    const prevIcon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="15"
        viewBox="0 0 14 15"
        fill="none"
      >
        <path
          d="M2.24112 7.86529L7.89194 13.5161L9.92255 11.4855L6.30233 7.86529L9.92255 4.24507L7.89194 2.21447L2.24112 7.86529Z"
          fill="currentColor"
        />
      </svg>
    );

    return (
      <div
        dir={dir}
        className="flex items-center justify-center space-x-2"
      >
        {/* Page Label */}
        <span className={`${textClass} md:text-sm text-xs text-primary`}>
          {pageText}
        </span>

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-2 py-1 text-primary">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => setCurrentPage(page as number)}
              className={`px-2 py-1 text-xs rounded border border-gray hover:bg-primary hover:text-white ${
                currentPage === page
                  ? "bg-primary text-white"
                  : " bg-white text-primary"
              }`}
            >
              {numberFormatter(page as number)}
            </button>
          )
        )}

        {/* Previous Button */}
        <button
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          className={`px-2 py-1 rounded-full bg-white hover:bg-primary text-[#004B7A] hover:text-white group ${
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

  // Desktop
  const prevIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="11"
      height="15"
      viewBox="0 0 11 15"
      fill="none"
    >
      <path
        d="M0.315426 7.70802L7.5117 14.9043L10.0977 12.3183L5.48734 7.70802L10.0977 3.09771L7.5117 0.51175L0.315426 7.70802Z"
        fill="currentColor"
      />
    </svg>
  );

  const nextIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="20"
      viewBox="0 0 17 20"
      fill="none"
    >
      <path
        d="M4.40503 6.09868L9.00228 10.709L4.40503 15.3193L6.97792 17.9053L14.1873 10.6959L6.97792 3.51273L4.40503 6.09868Z"
        fill="currentColor"
      />
    </svg>
  );

  return (
    <div
      dir={dir}
      className="flex items-center justify-center mt-6 space-x-2"
    >
      {/* Page Label */}
      <span className={`${textClass} md:text-sm text-xs text-primary`}>
        {pageText}
      </span>

      {/* Previous Button */}
      <button
        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
        className={`px-2 py-2 rounded-full bg-white !text-primary hover:bg-primary hover:!text-white group ${
          currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={currentPage === 1}
      >
        {prevIcon}
      </button>

      {/* Next Button */}
      <button
        onClick={() => currentPage < lastPage && setCurrentPage(currentPage + 1)}
        className={`px-2 py-2 rounded-full bg-white !text-primary hover:bg-primary hover:!text-white group ${
          currentPage === lastPage ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={currentPage === lastPage}
      >
        {nextIcon}
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} className="px-2 py-1 text-primary">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => setCurrentPage(page as number)}
            className={`md:px-3 px-2 py-1 md:text-sm text-xs rounded border border-gray hover:bg-primary hover:text-white ${
              currentPage === page
                ? "bg-primary text-white"
                : "bg-white text-primary"
            }`}
          >
            {numberFormatter(page as number)}
          </button>
        )
      )}
    </div>
  );
};

export default Pagination;