"use client"; // This is a client component 👈🏽
import React, { useEffect } from 'react'
import { useRouter, usePathname } from "next/navigation"
import { get, post } from "@/lib/api/apiCalls"
import { useApp } from '@/app/_ctx/AppContext';

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

  const notificationCount = () => {
    if (searchParams?.notifications?.length) {
      var data = {
        id: searchParams?.notifications,
        mobileapp: true,
      }
      post('notificationsCounts', data).then((responseJson: any) => {
        if (responseJson?.success) {
          // console.log("responseJsonCount",responseJson?.success)
        }
      })
    }
  }

  const checkAffiliation = () => {

    get(`checkaffiliation/${slugStr}`).then((responseJson: any) => {
      if (responseJson?.success) {
        localStorage.setItem('affiliationCode', responseJson?.data?.slug_code.toString())

        if (typeof window !== 'undefined') {
          window.location.href = responseJson?.data?.custom_link;
        }
        // router.push(`/${params?.lang}/${responseJson?.data?.custom_link}`);
      } else {
        router.push(`/`);
      }

    })
  }
  return (
    <>
      <h1>{lang === 'ar' ? 'تحميل...' : 'loading...'}</h1>
    </>
  )
}