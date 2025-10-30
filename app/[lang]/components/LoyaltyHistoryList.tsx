"use client";

import React, { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/en";
import SARIcon from "./Icons/SARIcon";
import CloseIcon from "./Icons/CloseIcon";

export default function LoyaltyHistoryList(props: any) {
  const loyalData = props?.data;
  const isArabic = props?.isArabic;
  const isDeducted = loyalData?.type == 0 ? true : false;
  const isRefunded = loyalData?.is_refund == 1 ? true : false;
  const welcomeOrder = loyalData?.earning_against == "Welcome" ? true : false;
  let prefix = "GF-"; // default
  if (isRefunded) {
    prefix = "RR-";
  } else if (isDeducted) {
    prefix = "US-";
  } else if (
    loyalData?.type == 1 &&
    (loyalData?.earning_against?.startsWith("S") ||
      loyalData?.earning_against?.startsWith("TKS"))
  ) {
    prefix = "OR-";
  }
  const isPending = loyalData?.date
    ? dayjs().isBefore(dayjs(loyalData.date).add(8, "days"))
    : false;

  const [showPopup, setShowPopup] = useState(false);
  const togglePopup = () => setShowPopup(!showPopup);
  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-md shadow-md mb-2 w-full">
      <div>
        <p className="text-sm font-semibold text-dark -mb-2">
          {prefix}
          {loyalData?.earning_against}
        </p>
        <div className="inline-flex items-center gap-1">
          <span className="text-10 font-medium text-dark/60">
            {dayjs(loyalData?.created_at).locale("en").format("MMM DD, YYYY")}{" "}
            at {dayjs(loyalData?.created_at).locale("en").format("hh:mm A")}{" "}
            {!isDeducted && isPending && !isRefunded && welcomeOrder && " - "}
          </span>
          {!isDeducted && isPending && !isRefunded && welcomeOrder && (
            <button
              onClick={togglePopup}
              className="relative text-10 flex items-center gap-1 text-orange font-semibold cursorpointer outline-none"
            >
              {isArabic ? "قيد الانتظار" : "Pending"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
              </svg>
              {showPopup && (
                <div
                  className={`absolute bottom-full left-1/2 -translate-x-1/2 rounded-lg p-2 bg-white border border-primary/10 text-xxs text-dark text-start w-64 showPopup ? "opacity-100 visible" : "opacity-0 invisible"`}
                >
                  <div
                    onClick={() => setShowPopup(false)}
                    className="flex justify-end ml-auto"
                  >
                    <CloseIcon size={8} color="#000000" />
                  </div>
                  {isArabic
                    ? "ستكون نقاط تمكين النخبة مؤهلة للاستخدام بعد سبعة (7) أيام من تاريخ تفعيل الطلب."
                    : " Tamkeen Nukhb points will be eligible for use after seven (7) days from the date the order was placed."}
                </div>
              )}
            </button>
          )}
        </div>
      </div>
      <span
        className={`text-sm leading-3.5 flex text-right font-semibold mb-1 ${
          !isDeducted && isPending && !isRefunded && welcomeOrder
            ? "text-orange"
            : !isDeducted
            ? "text-greenDark"
            : "text-[#e8000b]"
        }`}
      >
        {loyalData?.loyalty_points ? (
          <div className="flex items-center gap-2">
            {isDeducted || isRefunded ? (
              <div className="text-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-dash-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                  <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
                </svg>
              </div>
            ) : (
              <div className="text-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-plus-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                </svg>
              </div>
            )}
            <div className="text-xs w-full flex flex-col text-right">
              <div className="flex items-center justify-end gap-1 W-20">
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
