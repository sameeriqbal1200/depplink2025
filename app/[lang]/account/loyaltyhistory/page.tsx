"use client"; // This is a client component 👈🏽

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import { useApp } from "@/app/_ctx/AppContext";
import { getLoyaltyHistoryData } from "@/lib/accounts/loyaltyData.client";
import { useSlot } from "@/app/_ctx/ClientDataRegistry";
import LoyaltyHistoryList from "../../components/LoyaltyHistoryList";
import SARIcon from "../../components/Icons/SARIcon";
import LottieAnimation from "../../components/LottieAnimation";

const MobileHeader = dynamic(() => import("../../components/MobileHeader"), {
  ssr: true,
});

export default function UserLoyaltyHistory() {
  const { lang, deviceType, origin } = useApp();
  const footer = useSlot<any>("footer");
  const [totalAvailablePoint, setTotalAvailablePoint] = useState<any>(0);
  const [totalAvailableAmount, setTotalAvailableAmount] = useState<any>(0);
  const [totalRedeemPoint, setTotalRedeemPoint] = useState<any>(0);
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
      const redeemData = userLoyaltyData?.userLoyaltyData?.data?.filter((item: any) => item.type == 0);

      // Calculate the sum of redeem points
      const redeemPointSum = redeemData?.reduce((acc: any, item: any) => {
        return acc + (parseInt(item?.loyalty_points) || 0); 
      }, 0); 

      const lastLoyaltyData = userLoyaltyData?.userLoyaltyData?.mainLoyalty;
      const totalPoints = lastLoyaltyData?.t_loyaltypoints ?? 0;
      const totalAmount = lastLoyaltyData?.total_amount ?? 0;
      setTotalAvailablePoint(totalPoints);
      setTotalAvailableAmount(totalAmount);
      setTotalRedeemPoint(redeemPointSum);
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
        pageTitle={isArabic ? "نشاط الولاء" : "Loyalty Activity"}
      />
      <div className="container py-16">
        {loyaltyData.length ? (
          <>
            <div className="rounded-lg shadow-md mb-3 w-full bg-primary">
              <div className="text-white loyaltyHistory_header_two p-3">
                <p className="text-xs">{isArabic ? "الرصيد المتاح:" : "Available balance:"}</p>
                <div className="flex items-center gap-2 mt-1">
                  <SARIcon size={20} color="white" />
                  <h1 className="text-3xl font-bold">{(Number(totalAvailableAmount)).toLocaleString()}</h1>
                </div>
                <p className="text-xs flex items-center gap-1 mt-4">{isArabic ? "إجمالي النقاط المتاحة:" : "Total available points:"} <span className="text-white font-bold">{Number(totalAvailablePoint).toLocaleString()}</span></p>
              </div>
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
          </>
        ) : (
          <div className={`flex flex-col items-center justify-center text-center p-14 h-[88vh]`}>
            <LottieAnimation src="/json/coins.json" loop width={200} height={200} />
              <h1 className="text-[#404553] text-[22px] font-semibold">
                {isArabic
                    ? "ابدأ رحلتك نحو المكافآت."
                    : "Start Your Reward Journey."}
              </h1>
              <p className="text-[#7e859b] text-sm mt-2">
              {isArabic
                  ? "نضم إلى برنامج تمكين نُخُب — كلما تسوقت أكثر، ربحت أكثر."
                  : "Join Tamkeen Nukhub — the more you shop, the more you earn."}
              </p>
              {/* 👇 Use plain <a> so it doesn’t resubmit the wrong path */}
              {/* <Link href="/" className="btn nc__278mainInnerLink mt-6">
                  {isArabic ? "Back to Home" : "العودة إلى الصفحة الرئيسية"}
              </Link> */}
          </div>
        )}
      </div>
    </div>
  );
}
