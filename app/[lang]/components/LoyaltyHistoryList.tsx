"use client";

import dayjs from "dayjs";
import "dayjs/locale/ar";
import React from "react";
import SARIcon from "./Icons/SARIcon";

export default function LoyaltyHistoryList(props: any) {
  const loyalData = props?.data;
  const isArabic = props?.isArabic;
  const isDeducted = loyalData?.type == 0 ? true : false;
  return (
    <div className="flex items-center gap-5 p-3 bg-white rounded-md shadow-md mb-3 w-full">
      <div className="flex flex-col items-center shrink-0 bg-[#f1f1f1] py-2 px-4 rounded-md">
        <span className="text-base font-bold text-dark">
          {dayjs(loyalData?.date)
            .locale(isArabic ? "ar" : "en")
            .format("DD")}
        </span>
        <span className="text-sm leading-3.5 text-dark">
          {dayjs(loyalData?.date)
            .locale(isArabic ? "ar" : "en")
            .format("MMM")}
        </span>
      </div>
      <div className="grow">
        <p className="text-sm leading-3.5 font-bold text-dark">
          {isDeducted ? (isArabic ? "رقم الطلب" : "Order no.") : ""}
        </p>
        <p className="text-sm font-semibold text-dark">
          {loyalData?.earning_against}
        </p>
        <span className="text-xs text-dark flex items-center gap-1">
          {isArabic ? "المبلغ:" : "Amount:"}{" "}
          <SARIcon size={9} color="#000000" />{" "}
          {Number(loyalData?.total_amount).toLocaleString()}
        </span>
      </div>
      <div className="flex flex-col shrink-0 pr-4">
        <span
          className={`text-sm leading-3.5 ${
            !isDeducted ? "text-greenDark" : "text-red-600"
          } font-semibold mb-1`}
        >
          {loyalData?.t_loyaltypoints ? (
            <>
              {isDeducted ? "-" : "+"}
              {Number(loyalData.t_loyaltypoints).toLocaleString()}{" "}
            </>
          ) : (
            "0 "
          )}
          {isArabic ? "نقاط" : "pts"}
        </span>

        {/* <span
            className={`text-xs ${
              !isDeducted ? "text-greenDark" : "text-red-600"
            }`}
          >
            {isDeducted
              ? isArabic
                ? "تم الخصم"
                : "DEDUCTED"
              : isArabic
              ? "تم الإضافة"
              : "CREDITED"}
          </span> */}
      </div>
    </div>
  );
}
