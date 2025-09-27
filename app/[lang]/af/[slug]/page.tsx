"use client"; // This is a client component 👈🏽
import React, { useEffect } from 'react'
import { useRouter, usePathname } from "next/navigation"
import { useApp } from '@/app/_ctx/AppContext';
import { getAffliationData, postStoreLocatorData } from '@/lib/footerpages/store-locator.client';

export default function AF(searchParams: any) {
  const { lang, slugStr } = useApp();
  const router = useRouter();
  const path = usePathname();

   useEffect(() => {
    if (searchParams?.notifications?.length) {
      notificationCount()
    }

    checkAffiliation()

  }, [])

  const notificationCount = async () => {
    if (searchParams?.notifications?.length) {
      var data = {
        id: searchParams?.notifications,
        desktop: true,
      }
      const notifyData = await postStoreLocatorData(data);
      if (notifyData?.storeLocatorData?.success) {
      }
    }
  }

  const checkAffiliation = async () => {
    const checkData = await getAffliationData(slugStr);
    if (checkData?.affliationData?.success) {
      if (checkData?.affliationData?.data?.custom_link) {
        router.push(`${origin}/${lang}/${checkData?.affliationData?.data?.custom_link}`);
      } else {
        router.push(`/`);
      }
    }
  }
  return (
    <>
      <h1>{lang === 'ar' ? 'تحميل...' : 'loading...'}</h1>
    </>
  )
}