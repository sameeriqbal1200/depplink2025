"use client";

import dayjs from "dayjs";
import "dayjs/locale/ar";
import "dayjs/locale/en";
import React from "react";
import SARIcon from "./Icons/SARIcon";

export default function LoyaltyHistoryList(props: any) {
  const loyalData = props?.data;
  const isArabic = props?.isArabic;
  const isDeducted = loyalData?.type == 0 ? true : false;
  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-md shadow-md mb-2 w-full">
      <div>
        <p className="text-sm font-semibold text-dark -mb-2">{loyalData?.earning_against}</p>
        <span className="text-[0.65rem] font-medium text-dark/60">
          {dayjs(loyalData?.date).locale(isArabic ? "ar" : "en").format("MMM DD, YYYY")} at {dayjs(loyalData?.date).locale(isArabic ? "ar" : "en").format("hh:mm A")}
        </span>
      </div>
      <span className={`text-sm leading-3.5 flex text-right ${!isDeducted ? "text-greenDark" : "text-[#e8000b]"} font-semibold mb-1`}>
        {loyalData?.loyalty_points ? (
          <div className="flex items-center gap-2">
            {isDeducted ? <div className="text-xl">-</div> : <div className="text-xl">+</div>}
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
