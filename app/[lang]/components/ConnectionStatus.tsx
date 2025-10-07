"use client";
import React, { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import LottieAnimation from "./LottieAnimation";
import { useApp } from "@/app/_ctx/AppContext";
import CheckIcon from "./Icons/CheckIcon";

const ConnectionStatus = () => {
  const { lang } = useApp();
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [showOfflineNotification, setShowOfflineNotification] =
    useState<boolean>(false);
  const [showOnlineNotification, setShowOnlineNotification] =
    useState<boolean>(false);

  useEffect(() => {
    // Set initial status
    setIsOnline(navigator.onLine);

    // Add event listeners for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineNotification(false);
      setShowOnlineNotification(true);

      // Hide online notification after 3 seconds
      setTimeout(() => {
        setShowOnlineNotification(false);
      }, 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineNotification(true);
      setShowOnlineNotification(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Clean up event listeners
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      {/* Offline Notification Modal */}
      <Transition appear show={showOfflineNotification} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setShowOfflineNotification(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl text-left align-middle shadow-xl transition-all">
                  {/* Background with gradient */}
                  <div className="flex flex-col items-center justify-center text-center py-28 px-14">
                    <LottieAnimation
                      src="/json/connection-error.json"
                      loop
                      width={200}
                      height={200}
                    />
                    <h1 className="text-[#404553] text-[22px] font-semibold">
                      {lang === "ar" ? "انقطع الاتصال" : "Connection Lost"}
                    </h1>

                    <p className="text-[#7e859b] text-sm mt-2">
                      {lang === "ar"
                        ? "يبدو أن اتصالك بالإنترنت غير متصل"
                        : "Your internet connection appears to be offline"}
                    </p>
                    <p className="text-[#7e859b] text-sm mt-2">
                      {lang === "ar"
                        ? "قد لا تتوفر بعض الميزات حتى يتم استعادة الاتصال."
                        : "Some features may not be available until your connection is restored."}
                    </p>
                    {/* 👇 Use plain <a> so it doesn’t resubmit the wrong path */}
                    <Link href="/" className="btn nc__278mainInnerLink mt-6">
                      {lang === "ar"
                        ? "العودة إلى الصفحة الرئيسية"
                        : "Back to Home"}
                    </Link>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Online Notification Toast */}
      <Transition
        show={showOnlineNotification}
        as={Fragment}
        enter="transform ease-out duration-300 transition"
        enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enterTo="translate-y-0 opacity-100 sm:translate-x-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed top-2 right-4 z-50 max-w-sm w-full bg-[#20831E] shadow-lg rounded-lg pointer-events-auto ring-1 ring-green-200 overflow-hidden border border-[#20831E]">
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-teal-100 shadow-md">
                  {/* <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="white"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg> */}
                  <CheckIcon color="20831E" className="w-6 h-6" />
                </div>
              </div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm font-bold text-white">
                  {lang === "ar" ? "تم استعادة الاتصال" : "Connection Restored"}
                </p>
                <p className="mt-1 text-sm text-white">
                  {lang === "ar"
                    ? "اتصالك بالإنترنت متصل الآن."
                    : "Your internet connection is back online."}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  className="bg-white rounded-md inline-flex text-green-700 hover:text-green-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                  onClick={() => setShowOnlineNotification(false)}
                >
                  <span className="sr-only">
                    {lang === "ar" ? "إغلاق" : "Close"}
                  </span>

                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </>
  );
};

export default ConnectionStatus;
