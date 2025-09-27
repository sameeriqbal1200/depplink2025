"use client"; // This is a client component 👈🏽

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import { useApp } from "@/app/_ctx/AppContext";
import { getLoyaltyHistoryData } from '@/lib/accounts/loyaltyData.client'
import { useSlot } from '@/app/_ctx/ClientDataRegistry';
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
    deviceType === "mobile" || deviceType === "tablet"
      ? true
      : false;

  const [loyaltyData, setLoyaltyData] = useState<any>([]);

  const getLoyaltyHistory = async () => {
    try {
      const userId = typeof window !== "undefined" ? localStorage.getItem("userid") : null;

      if (!userId) {
        router.push(`/${lang}`);
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
