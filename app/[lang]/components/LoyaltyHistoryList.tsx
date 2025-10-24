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
  if (isRefunded) prefix = 'RR-';
  else if (isDeducted) prefix = 'US-';
  const isPending = loyalData?.date ? dayjs().isBefore(dayjs(loyalData.date).add(8, "days")) : false;
  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-md shadow-md mb-2 w-full">
      <div>
        <p className="text-sm font-semibold text-dark -mb-2">{prefix}{loyalData?.earning_against}</p>
        <span className="text-[0.65rem] font-medium text-dark/60">
          {dayjs(loyalData?.date).locale("en").format("MMM DD, YYYY")} at {dayjs(loyalData?.date).locale("en").format("hh:mm A")}
        </span>
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
            {!isDeducted && isPending && !isRefunded && (
              <div className="text-xs text-orange-500 font-semibold">
                {isArabic ? "قيد الانتظار" : "Pending"}
              </div>
            )}
            {(isDeducted || isRefunded) ? <div className="text-xl">-</div> : <div className="text-xl">+</div>}
            <div className="text-xs w-full flex flex-col text-right">
              <div className="flex items-center justify-end gap-1">
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
