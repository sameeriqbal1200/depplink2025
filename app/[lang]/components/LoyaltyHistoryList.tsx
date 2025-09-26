"use client";

import React from "react";

export default function LoyaltyHistoryList(props: any) {
    const loyalData = props?.data;
    const fullName = localStorage.getItem("fullName") || "Guest User";
  return (
    <>
      <div className="flex items-center gap-5 p-3 rounded-md bg-white shadow-md mb-3 w-full">
        <div className="flex flex-col items-center shrink-0 bg-[#EBEBEB] py-3 px-4 rounded-md">
          <span className="text-base font-bold text-dark">15</span>
          <span className="text-base font-bold text-dark">yolyo</span>
        </div>
        <div className="grow">
          <p className="text-sm font-semibold text-dark ml-3 mb-1">
            {loyalData?.date} {loyalData?.order_number} {fullName}
          </p>
          <span className="text-xs text-dark flex items-center gap-1 font-semibold">
            Text:19.95
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="11"
              viewBox="0 0 10 10"
              fill="none"
            >
              <path
                d="M5.8684 8.15245C5.73054 8.45815 5.63941 8.78989 5.60449 9.13779L8.52202 8.51759C8.65989 8.21197 8.75095 7.88015 8.78593 7.53226L5.8684 8.15245Z"
                fill="currentColor"
              />
              <path
                d="M8.42583 6.65928C8.56369 6.35365 8.65482 6.02183 8.68974 5.67394L6.41707 6.15729V5.22811L8.42576 4.80124C8.56362 4.49561 8.65476 4.1638 8.68967 3.8159L6.41701 4.29885V0.957207C6.06877 1.15274 5.7595 1.413 5.50809 1.72001V4.49211L4.59918 4.6853V0.502716C4.25094 0.698175 3.94167 0.958513 3.69026 1.26552V4.87842L1.65657 5.31058C1.5187 5.61621 1.4275 5.94802 1.39252 6.29592L3.69026 5.80761V6.97776L1.22778 7.50104C1.08991 7.80667 0.99878 8.13849 0.963867 8.48638L3.5414 7.93863C3.75123 7.89499 3.93157 7.77093 4.04881 7.60022L4.52152 6.89941V6.89927C4.57059 6.82676 4.59918 6.73934 4.59918 6.64519V5.61442L5.50809 5.42123V7.2796L8.42576 6.65914L8.42583 6.65928Z"
                fill="currentColor"
              />
            </svg>
          </span>
        </div>
        <div className="flex flex-col shrink-0 pr-4">
          <span className="text-base text-primary font-semibold mb-1 ml-2">
            20 points
          </span>
          <span className="text-xs text-primary font-semibold">here text</span>
        </div>
      </div>
    </>
  );
}
