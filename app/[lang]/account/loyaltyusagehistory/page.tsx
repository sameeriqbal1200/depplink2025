"use client"; // This is a client component 👈🏽

import React, { Fragment, useEffect, useRef, useState } from "react";
import "dayjs/locale/ar";
import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { getDictionary } from "../../dictionaries";
import { usePathname } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import { AdminApi, NewMedia } from "../../api/Api";
import { get, post } from "../../api/ApiCalls";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Dialog, Transition, RadioGroup } from "@headlessui/react";
import LoyaltyHistoryList from "../../components/LoyaltyHistoryList";
import { useApp } from "@/app/_ctx/AppContext";
import { getLoyaltyHistoryData } from "@/lib/accounts/loyaltyData.client";

const MobileHeader = dynamic(() => import("../../components/MobileHeader"), {
  ssr: true,
});
const AccountSidebar = dynamic(
  () => import("../../components/AccountSidebar"),
  { ssr: false }
);

export default function AddressDetails({
  params,
}: {
  params: { lang: string; data: any; slug: string; devicetype: any };
}) {
  const router = useRouter();
   const { t, lang, deviceType, origin } = useApp();
  const path = usePathname();
  const isArabic = params.lang === "ar";
  const isMobileOrTablet =
    params?.devicetype === "mobile" || params?.devicetype === "tablet"
      ? true
      : false;
  const containerClass =
    params.devicetype == "mobile" || params.devicetype == "tablet"
      ? "container"
      : "px-20";

  const [loyaltyData, setLoyalityData] = useState<any>([]);

  const getLoyalityHistory = async () => {
    try {
      const userId = typeof window !== "undefined" ? localStorage.getItem("userid") : null;

      if (!userId) {
        router.push(`${origin}/${lang}`);
        return;
      }

      const userLoyaltyData = await getLoyaltyHistoryData();
      setLoyalityData(userLoyaltyData?.userLoyaltyData?.data ?? []);
    } catch (err) {
      console.error("Failed to fetch loyalty history:", err);
      setLoyalityData([]); // fallback
    }
  };

  useEffect(() => {
    getLoyalityHistory();
  }, [params.lang]);

  const AccountSidebar = dynamic(
    () => import("../../components/AccountSidebar"),
    { ssr: true }
  );
  return (
    <>
      {params.devicetype === "mobile" ? (
        <MobileHeader
          type="Third"
          lang={params.lang}
          pageTitle={
            params.lang === "ar" ? "سجل استخدام الولاء" : "Loyalty Usage History"
          }
        />
      ) : null}
      <div className="container md:py-4 py-16">
        <div className="flex items-start my-4 gap-x-5">
          {params?.devicetype === "mobile" ? null : (
            <AccountSidebar lang={lang} path={path} origin={origin} />
          )}

          <div className="w-full">
            <div className="align__center heading__base mb-4 max-md:hidden">
              <h2>
                {params.lang == "ar" ? "سجل استخدام الولاء" : "Loyalty Usage History"}
              </h2>
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
      </div>
    </>
  );
}
