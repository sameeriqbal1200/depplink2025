"use client";

import dayjs from "dayjs";
import "dayjs/locale/en";
import React from "react";
import SARIcon from "./Icons/SARIcon";

export default function LoyaltyHistoryList(props: any) {
  const loyalData = props?.data;
  const isArabic = props?.isArabic;
  const isDeducted = loyalData?.type == 0 ? true : false;
  const isRefunded = loyalData?.is_refund == 1 ? true : false;
  let prefix = 'GF-'; // default
  if (isRefunded) {
    prefix = 'RR-';
  } else if (isDeducted) {
    prefix = 'US-';
  } else if (
    loyalData?.type == 1 &&
    (loyalData?.earning_against?.startsWith('S') || loyalData?.earning_against?.startsWith('TKS'))
  ) {
    prefix = 'OR-';
  }
  const isPending = loyalData?.date ? dayjs().isBefore(dayjs(loyalData.date).add(8, "days")) : false;
  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-md shadow-md mb-2 w-full">
      <div>
        <p className="text-sm font-semibold text-dark -mb-2">{prefix}{loyalData?.earning_against}</p>
        <div className="inline-flex items-center gap-1">
        <span className="text-[0.65rem] font-medium text-dark/60">
          {dayjs(loyalData?.date).locale("en").format("MMM DD, YYYY")} at {dayjs(loyalData?.date).locale("en").format("hh:mm A")} {!isDeducted && isPending && !isRefunded && " - "}
        </span>
        {!isDeducted && isPending && !isRefunded && (
              <div className="text-xs text-orange-500 font-semibold">
                {isArabic ? "قيد الانتظار" : "Pending"}
              </div>
            )}
        </div>
      </div>
      <span
        className={`text-sm leading-3.5 flex text-right font-semibold mb-1 ${
          !isDeducted && isPending && !isRefunded
            ? "text-orange"
            : !isDeducted
            ? "text-greenDark"
            : "text-[#e8000b]"
        }`}
      >
        {loyalData?.loyalty_points ? (
          <div className="flex items-center gap-2">
            {(isDeducted || isRefunded) ? <div className="text-xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
              </svg>
              </div> : 
              <div className="text-xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
              </svg>
              </div>}
            {(isDeducted || isRefunded) ? <div className="text-xl">-</div> : <div className="text-xl">+</div>}
            <div className="text-xs w-full flex flex-col text-right">
              <div className="flex items-center justify-end gap-1 w-20">
                {Number(loyalData.loyalty_points).toLocaleString()}{" "}
                {isArabic ? "نقاط" : "pts"}
              </div>
              <div className="flex items-center justify-end gap-1 font-semibold">
                <SARIcon size={10} />{" "}
                {Number(loyalData?.total_amount).toLocaleString()}
              </div>
            </div>
          </div>
        ) : (
          "0"
        )}
      </span>
    </div>
  );
}
