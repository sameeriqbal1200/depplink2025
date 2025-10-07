"use client"; // This is a client component 👈🏽

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import { useApp } from "@/app/_ctx/AppContext";
import { getLoyaltyHistoryData } from "@/lib/accounts/loyaltyData.client";
import { useSlot } from "@/app/_ctx/ClientDataRegistry";
import LoyaltyHistoryList from "../../components/LoyaltyHistoryList";

const MobileHeader = dynamic(() => import("../../components/MobileHeader"), {
  ssr: true,
});

export default function UserLoyaltyHistory() {
  const { lang, deviceType } = useApp();
  const footer = useSlot<any>("footer");
  const router = useRouter();
  const path = usePathname();
  const isArabic = lang === "ar";
  const isMobileOrTablet =
    deviceType === "mobile" || deviceType === "tablet" ? true : false;

  const [loyaltyData, setLoyaltyData] = useState<any>([]);

  const getLoyaltyHistory = async () => {
    try {
      const userId =
        typeof window !== "undefined" ? localStorage.getItem("userid") : null;

      if (!userId) {
        router.push(`${origin}/${lang}`);
        return;
      }

      const userLoyaltyData = await getLoyaltyHistoryData();
      setLoyaltyData(userLoyaltyData?.userLoyaltyData?.data ?? []);
    } catch (err) {
      console.error("Failed to fetch loyalty history:", err);
      setLoyaltyData([]); // fallback
      // Optionally: show a toast/snackbar to the user
    }
  };

  useEffect(() => {
    getLoyaltyHistory();
  }, [lang]);

  return (
    <div>
      <MobileHeader
        type="Third"
        lang={lang}
        pageTitle={
          lang === "ar" ? "سجل استخدام الولاء" : "Loyalty Usage History"
        }
      />
      <div className="container py-16">
        <div className="loyaltyHistory_header p-3 rounded-lg bg-white shadow-md mb-3 w-full">
          <div className="flex items-center gap-8 pt-2 pb-12 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="bi bi-gift-fill"
              viewBox="0 0 16 16"
            >
              <path d="M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.006c0 .07 0 .27-.038.494H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.038A3 3 0 0 1 3 2.506zm1.068.5H7v-.5a1.5 1.5 0 1 0-3 0c0 .085.002.274.045.43zM9 3h2.932l.023-.07c.043-.156.045-.345.045-.43a1.5 1.5 0 0 0-3 0zm6 4v7.5a1.5 1.5 0 0 1-1.5 1.5H9V7zM2.5 16A1.5 1.5 0 0 1 1 14.5V7h6v9z" />
            </svg>
            <div className="flex flex-col">
              <p className="text-sm leading-3.5 font-bold text-white mb-0.5">
                Points Available
              </p>
              <span className="text-xs text-white">Points Redeemed</span>
            </div>
            <div className="flex flex-col">
              <p className="text-sm leading-3.5 font-bold text-white mb-0.5">
                3,185 pts
              </p>
              <span className="text-xs text-white">-4,431 pts</span>
            </div>
          </div>
          <p className="text-base text-dark font-bold text-center mb-4">1235264773777</p>
          <span className="text-xs text-dark block text-center">
            Show this card to earn at Tamkeen store.
          </span>
        </div>
        {loyaltyData?.map((item: any, i: number) => {
          return (
            <LoyaltyHistoryList
              key={i}
              data={item}
              isArabic={isArabic}
              isMobileOrTablet={isMobileOrTablet}
            />
          );
        })}
      </div>
    </div>
  );
}
