"use client"; // This is a client component 👈🏽

import React, { useEffect, useState, Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter, usePathname } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { useApp } from "@/app/_ctx/AppContext";
import { getUserProfileData } from "@/lib/accounts/profile.client";
import { postDeleteUser } from "@/lib/accountListing/accountListing.client";
import ArrowLeftIcon from "../components/Icons/ArrowLeftIcon";
import HeartIcon from "../components/Icons/HeartIcon";
import AddressIcon from "../components/Icons/AddressIcon";
import OrdersIcon from "../components/Icons/OrdersIcon";
import BookmarkIcon from "../components/Icons/BookmarkIcon";
import DocumentIcon from "../components/Icons/DocumentIcon";
import LocationPinIcon from "../components/Icons/PinLocationIcon";
import HelpIcon from "../components/Icons/HelpIcon";
import HeadphonesIcon from "../components/Icons/HeadphonesIcon";
import AboutIcon from "../components/Icons/AboutIcon";
import SettingsIcon from "../components/Icons/SettingsIcon";
import CloseIcon from "../components/Icons/CloseIcon";
import UserIcon from "../components/Icons/UserIcon";

const MobileHeader = dynamic(() => import("../components/MobileHeader"), {
  ssr: true,
});

export default function AccountListing() {
  const { t, lang, origin } = useApp();
  const path = usePathname();
  const router = useRouter();
  const [firstWord, setFirstWord] = useState<any>(false);
  const [secondWord, setSecondWord] = useState<any>(false);
  const [userid, setUserid] = useState<any>(false);
  const [confirmationPopup, setConfirmationPopup] = useState<any>(false);
  const [fullName, setfullName] = useState("");

  useEffect(() => {
    getUser();
    UserDataLocalStorage();
  }, []);
  // useEffect(() => {
  //     const loyaltyPointsDB: any = loyaltyData?.t_loyaltypoints || 0;
  //     const loyaltyAmount = loyaltyPointsDB / 100;
  //     setloyaltyPoints(loyaltyPointsDB)
  //     setloyaltyAmount(loyaltyAmount)
  // }, [loyaltyData])

  const getUser: any = () => {
    if (localStorage.getItem("userid")) {
      setUserid(localStorage.getItem("userid"));
    }
  };

  const UserDataLocalStorage = async () => {
    try {
      if (typeof window === "undefined") return;
      const userId = localStorage.getItem("userid");
      if (!userId) return;

      const res: any = await getUserProfileData();
      const u = res?.profileDataCore?.userdata ?? {};
      setfullName(u?.full_name);

      var fullNameWord = u?.full_name?.split(' ');
      if (fullNameWord) {
          if (fullNameWord[0]) {
              setFirstWord(fullNameWord[0].charAt(0))
          }
          if (fullNameWord[1]) {
              setSecondWord(fullNameWord[1].charAt(0))
          }
      }

      // Optional cache
      localStorage.setItem("fullName", fullName);
    } catch (e) {
      console.error("userDataLocalStorage failed:", e);
    }
  };

  const deleteUser = async () => {
    try {
      if (typeof window === "undefined") return;
      const userId = localStorage.getItem("userid");
      if (!userId) {
        router.push(`${origin}/${lang}`);
        return;
      }

      const res: any = await postDeleteUser({ user_id: userId });

      if (res?.deleteUserData?.success) {
        setConfirmationPopup(false);
        topMessageAlartDanger(
          lang === "ar" ? "لقد تم حذف حسابك!" : "Your account has been deleted!"
        );
        await handleLogout?.(); // ensure this clears auth/localStorage & redirects
      } else {
        setConfirmationPopup(false);
        topMessageAlartDanger(
          res?.deleteUserData?.message ||
            (lang === "ar"
              ? "حدث خطأ، حاول لاحقًا."
              : "Error! Something went wrong!")
        );
      }
    } catch (e) {
      console.error("deleteUser failed:", e);
      setConfirmationPopup(false);
      topMessageAlartDanger(
        lang === "ar" ? "حدث خطأ غير متوقع" : "Unexpected error"
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userid");
    localStorage.removeItem("eMail");
    localStorage.removeItem("fullName");
    localStorage.removeItem("phoneNumber");
    localStorage.removeItem("loyaltyCount");
    localStorage.removeItem("compareCount");
    localStorage.removeItem("wishlistCount");
    localStorage.removeItem("orderCount");
    localStorage.removeItem("userWishlist");
    setUserid(false);
    UserDataLocalStorage();
    router.push(path + "?refresh=" + Math.random(), { scroll: false });
    router.refresh();
  };

  const MySwal = withReactContent(Swal);

  const topMessageAlartDanger = (title: any) => {
    MySwal.fire({
      icon: "error",
      title: (
        <div className="text-xs">
          <div className="uppercase">{title}</div>
        </div>
      ),
      toast: true,
      position: lang === "ar" ? "top-start" : "top-end",
      showConfirmButton: false,
      timer: 15000,
      showCloseButton: true,
      background: "#DC4E4E",
      color: "#FFFFFF",
      timerProgressBar: true,
    });
  };

  return (
    <>
      <MobileHeader
        type="Third"
        lang={lang}
        pageTitle={lang === 'ar' ? 'حسابي' : 'Account'}
      />
      <div className="py-16 md:py-4">
        <div className="container">
          {userid ? (
            <Link
              href={`${origin}/${lang}/account/profile`}
              className="bg-white shadow-md rounded-md p-3 flex items-center gap-3"
            >
              <div className="w-14 h-14 rounded-full border-2 border-[#219EBC] flex justify-center items-center bg-[#219EBC]">
                <p className="text-white font-bold">
                  {firstWord}{secondWord}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">
                  {lang === "ar" ? "مرحباً" : "Welcome"}
                </label>
                <h1 className="text-base font-semibold text-[#004B7A]">
                  {userid && fullName !== ""
                    ? fullName
                    : t("header.loginSignup")}
                </h1>
              </div>
            </Link>
          ) : (
            <Link
              href={`${origin}/${lang}/login`}
              className="bg-white shadow-md rounded-md p-3 flex items-center gap-3"
            >
              <UserIcon size={26} color="#000000" />

              <div>
                <label className="text-sm font-medium">
                  {lang === "ar" ? "مرحباً" : "Welcome"}
                </label>
                <div className="text-sm underline font-semibold text-primary">
                  {lang === "ar" ? "Login" : "Sign In / Sign Up"}
                </div>
              </div>
            </Link>
          )}
        </div>
        <div className="mt-2 bg-white pb-24">
          <Link
            prefetch={false}
            scroll={false}
            href={`${origin}/${lang}/account/wishlist`}
            className="border-b border-[#9CA4AB50] px-4 py-3 align__center text-[#004B7A] fill-[#004B7A]"
          >
            <div className="flex items-center gap-x-2">
              <HeartIcon size={26} color="#004b7a" className="text-primary" />
              <h2 className="text-sm font-semibold">
                {lang === "ar" ? "المفضلة" : "Wishlist"}
              </h2>
            </div>
            <ArrowLeftIcon
              size={26}
              color="#004b7a"
              className={lang === "ar" ? "" : "rotate-180"}
            />
          </Link>
          {userid ? (
              <Link prefetch={false} scroll={false} href={`${origin}/${lang}/account/loyaltyhistory`} className="border-b border-[#9CA4AB50] px-4 py-3 align__center text-[#004B7A] fill-[#004B7A]">
                  <div className="flex items-center gap-x-2">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.07868 5.06891C8.87402 1.27893 15.0437 1.31923 18.8622 5.13778C22.6824 8.95797 22.7211 15.1313 18.9262 18.9262C15.1312 22.7211 8.95793 22.6824 5.13774 18.8622C2.87389 16.5984 1.93904 13.5099 2.34047 10.5812C2.39672 10.1708 2.775 9.88377 3.18537 9.94002C3.59575 9.99627 3.88282 10.3745 3.82658 10.7849C3.4866 13.2652 4.27782 15.881 6.1984 17.8016C9.44288 21.0461 14.6664 21.0646 17.8655 17.8655C21.0646 14.6664 21.046 9.44292 17.8015 6.19844C14.5587 2.95561 9.33889 2.93539 6.13935 6.12957L6.88705 6.13333C7.30126 6.13541 7.63535 6.47288 7.63327 6.88709C7.63119 7.3013 7.29372 7.63539 6.87951 7.63331L4.33396 7.62052C3.92269 7.61845 3.58981 7.28556 3.58774 6.8743L3.57495 4.32874C3.57286 3.91454 3.90696 3.57707 4.32117 3.57498C4.73538 3.5729 5.07285 3.907 5.07493 4.32121L5.07868 5.06891Z" fill="currentColor"></path><path opacity="0.5" d="M12 7.25C12.4142 7.25 12.75 7.58579 12.75 8V11.6893L15.0303 13.9697C15.3232 14.2626 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2626 15.3232 13.9697 15.0303L11.5429 12.6036C11.3554 12.416 11.25 12.1617 11.25 11.8964V8C11.25 7.58579 11.5858 7.25 12 7.25Z" fill="currentColor"></path></svg>
                      <h2 className="text-sm font-semibold">
                          {lang === 'ar' ? 'تاريخ الولاء' : 'Loyalty History'}
                      </h2>
                  </div>
                  <svg height="26" viewBox="0 0 24 24" width="26" className={lang === 'ar' ? "" : "rotate-180"} xmlns="http://www.w3.org/2000/svg" id="fi_2722991"><g id="_17" data-name="17"><path d="m15 19a1 1 0 0 1 -.71-.29l-6-6a1 1 0 0 1 0-1.41l6-6a1 1 0 0 1 1.41 1.41l-5.29 5.29 5.29 5.29a1 1 0 0 1 -.7 1.71z"></path></g></svg>
              </Link>
          ) : null}
          {userid ? (
            <>
              <Link
                href={`${origin}/${lang}/account/addressbook`}
                className="border-b border-[#9CA4AB50] px-4 py-3 flex items-center justify-between text-[#004b7a] fill-[#004B7A]"
              >
                <div className="flex items-center gap-x-2">
                  <AddressIcon size={25} color="#004b7a" />
                  <h2 className="text-sm font-semibold text-[#004b7a]">
                    {lang === "ar" ? "عناويني" : "My Addresses"}
                  </h2>
                </div>
                <ArrowLeftIcon
                  size={26}
                  color="#004b7a"
                  className={lang === "ar" ? "" : "rotate-180"}
                />
              </Link>
              <Link
                href={`${origin}/${lang}/account/orderlisting`}
                className="border-b border-[#9CA4AB50] px-4 py-3 flex items-center justify-between text-[#004B7A] fill-[#004B7A]"
              >
                <div className="flex items-center gap-x-2">
                  <OrdersIcon size={24} color="#004b7a" />
                  <h2 className="text-sm font-semibold">
                    {lang === "ar" ? "طلباتي" : "My Orders"}
                  </h2>
                </div>
                <ArrowLeftIcon
                  size={26}
                  color="#004b7a"
                  className={lang === "ar" ? "" : "rotate-180"}
                />
              </Link>
            </>
          ) : null}
          <Link
            href={`${origin}/${lang}/projectsales`}
            className="border-b border-[#9CA4AB50] ltr:pr-4 ltr:pl-3 rtl:pl-4 rtl:pr-[0.625rem] py-3 flex items-center justify-between text-[#004B7A] fill-[#004B7A]"
          >
            <div className="flex items-center gap-1">
              <BookmarkIcon size={33} color="#004B7A" />
              <h2 className="text-sm font-semibold">
                {lang === "ar" ? "مبيعات المشاريع" : "Project Sales"}
              </h2>
            </div>
            <ArrowLeftIcon
              size={26}
              color="#004b7a"
              className={lang === "ar" ? "" : "rotate-180"}
            />
          </Link>
          <Link
            href={`${origin}/${lang}/maintenance`}
            className="border-b border-[#9CA4AB50] px-4 py-3 flex items-center justify-between text-[#004B7A] fill-[#004B7A]"
          >
            <div className="flex items-center gap-x-2">
              <DocumentIcon size={23} color="#004B7A" />
              <h2 className="text-sm font-semibold">
                {lang === "ar" ? "طلبات الصيانة" : "Maintainance Request"}
              </h2>
            </div>
            <ArrowLeftIcon
              size={26}
              color="#004b7a"
              className={lang === "ar" ? "" : "rotate-180"}
            />
          </Link>
          <Link
            href={`${origin}/${lang}/store-locatore`}
            className="border-b border-[#9CA4AB50] px-4 py-3 flex items-center justify-between text-[#004B7A] fill-[#004B7A]"
          >
            <div className="flex items-center gap-1">
              <LocationPinIcon size={23} color="#004B7A" />
              <h2 className="text-sm font-semibold">
                {lang === "ar" ? "فروع تمكين" : "Tamkeen Showrooms"}
              </h2>
            </div>
            <ArrowLeftIcon
              size={26}
              color="#004b7a"
              className={lang === "ar" ? "" : "rotate-180"}
            />
          </Link>
          <Link
            href={`${origin}/${lang}/faqs`}
            className="border-b border-[#9CA4AB50] px-4 py-3 flex items-center justify-between text-[#004B7A] fill-[#004B7A]"
          >
            <div className="flex items-center gap-x-2">
              <HelpIcon size={23} color="#004B7A" />
              <h2 className="text-sm font-semibold">
                {lang === "ar" ? "الأسئلة لشائعة" : "FAQs"}
              </h2>
            </div>
            <ArrowLeftIcon
              size={26}
              color="#004b7a"
              className={lang === "ar" ? "" : "rotate-180"}
            />
          </Link>
          <Link
            href={`${origin}/${lang}/contact-us`}
            className="border-b border-[#9CA4AB50] px-4 py-3 flex items-center justify-between text-[#004B7A] fill-[#004B7A]"
          >
            <div className="flex items-center gap-x-2">
              <HeadphonesIcon
                size={23}
                color="#004B7A"
                className="text-primary"
              />
              <h2 className="text-sm font-semibold">
                {lang === "ar" ? "اتصل بنا" : "Call Us"}
              </h2>
            </div>
            <ArrowLeftIcon
              size={26}
              color="#004b7a"
              className={lang === "ar" ? "" : "rotate-180"}
            />
          </Link>
          <Link
            href={`${origin}/${lang}/terms-and-conditions`}
            className="border-b border-[#9CA4AB50] px-4 py-3 flex items-center justify-between text-[#004B7A] fill-[#004B7A]"
          >
            <div className="flex items-center gap-x-2">
              <AboutIcon size={23} color="#004B7A" />
              <h2 className="text-sm font-semibold">
                {lang == "ar" ? "الشروط والاحكام" : "Terms & Conditions"}
              </h2>
            </div>
            <ArrowLeftIcon
              size={26}
              color="#004b7a"
              className={lang === "ar" ? "" : "rotate-180"}
            />
          </Link>
          <Link
            href={`${origin}/${lang}/returnexchange`}
            className="border-b border-[#9CA4AB50] px-4 py-3 flex items-center justify-between text-[#004B7A] fill-[#004B7A]"
          >
            <div className="flex items-center gap-x-2">
              <AboutIcon size={23} color="#004B7A" />
              <h2 className="text-sm font-semibold">
                {lang === "ar"
                  ? "سياسة الاستبدال و الاسترجاع"
                  : "Exchange & Return Policy"}
              </h2>
            </div>
            <ArrowLeftIcon
              size={26}
              color="#004b7a"
              className={lang === "ar" ? "" : "rotate-180"}
            />
          </Link>
          <Link
            href={`${origin}/${lang}/setting`}
            className="border-b border-[#9CA4AB50] ltr:pr-4 ltr:pl-3 rtl:pl-4 rtl:pr-[0.625rem] py-3 flex items-center justify-between text-[#004B7A] fill-[#004B7A]"
          >
            <div className="flex items-center gap-1">
              <SettingsIcon size={33} color="#004B7A" />
              <h2 className="text-sm font-semibold">
                {lang === "ar" ? "الاعدادات" : "Settings"}
              </h2>
            </div>
            <ArrowLeftIcon
              size={26}
              color="#004b7a"
              className={lang === "ar" ? "" : "rotate-180"}
            />
          </Link>

          <div className="grid grid-cols-5 gap-2 mt-5 pl-5">
            <Link
              href="https://media.tamkeenstores.com.sa/pr0_tam/VAT.pdf"
              target="_blank"
              aria-label="Vat Certificate"
            >
              <Image
                src="https://images.tamkeenstores.com.sa/assets/new-media/e5c754e0462e49eff70525ee6a0ce8381718877392.svg"
                alt="Vat Certificate"
                title="Vat Certificate"
                height={80}
                width={80}
                priority
                style={{ width: "auto", height: "auto" }}
              />
            </Link>
            <Link
              href="https://maroof.sa/businesses/details/213361"
              target="_blank"
              aria-label="Maroof Certificate"
            >
              <Image
                src="https://images.tamkeenstores.com.sa/assets/new-media/91b55e1d094fc0e944a3b906b33ffec71718877392.svg"
                alt="Maroof Certificate"
                title="Maroof Certificate"
                height={80}
                width={80}
                priority
                style={{ width: "auto", height: "auto" }}
              />
            </Link>
            <Link
              href="https://images.tamkeenstores.com.sa/assets/pdf/E-Commerce-Authentication-Certificate.pdf"
              target="_blank"
              aria-label="Saudi Business Center Certificate"
            >
              <Image
                src="https://images.tamkeenstores.com.sa/assets/new-media/0df1dfcf0ce7e8c4b9db91cb1c0dfa291718877392.svg"
                alt="Saudi Business Center Certificate"
                title="Saudi Business Center Certificate"
                height={80}
                width={80}
                priority
                style={{ width: "auto", height: "auto" }}
              />
            </Link>
            <Link href="https://images.tamkeenstores.com.sa/assets/pdf/Online_COC-23Nov.pdf" target='_blank' aria-label="">
                <Image
                    src="https://images.tamkeenstores.com.sa/assets/new-media/12e57a08dbe89d8b6397ea6ad66488f21718877392.svg"
                    alt=''
                    title=''
                    height={80}
                    width={80}
                    priority
                    style={{ width: "auto", height: "auto" }}
                />
            </Link>
          </div>
        </div>
        <div className="fixed bottom-[77px] w-full p-3 bg-white shadow-md border-t border-[#5D686F26]">
          {userid ? (
            <button
              onClick={() => handleLogout()}
              className="focus-visible:outline-none btn border border-[#DC4E4E] bg-[#DC4E4E] p-2.5 rounded-md w-full text-white fill-white flex items-center justify-center font-medium gap-x-2"
            >
              {lang === "ar" ? "تسجيل خروج" : "Log Out"}
            </button>
          ) : (
            <button
              onClick={() => router.push(`/${lang}/login`)}
              className="focus-visible:outline-none btn border border-[#004B7A] bg-[#004B7A] p-2.5 rounded-md w-full text-white fill-white flex items-center justify-center font-medium gap-x-2"
            >
              {lang === "ar" ? "تسجيل الدخول" : "Login"}
            </button>
          )}
        </div>
      </div>

      <Transition appear show={confirmationPopup} as={Fragment}>
        <Dialog
          as="div"
          open={confirmationPopup}
          onClose={() => setConfirmationPopup(false)}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0" />
          </TransitionChild>
          <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel
                  as="div"
                  className="panel border-0 p-5 rounded-lg overflow-hidden w-full h-auto max-w-5xl my-8 text-black bg-white relative"
                >
                  <button
                    type="button"
                    className="focus-visible:outline-none text-dark hover:text-dark fill-dark absolute top-5 z-40 right-5"
                    onClick={() => setConfirmationPopup(false)}
                  >
                    <CloseIcon size={16} color="#000000" />
                  </button>
                  <div className="text-center">
                    <h2 className="text-md font-semibold">
                      {lang === "ar"
                        ? "هل تريد حذف هذا الحساب؟"
                        : "Do you want to delete this account?"}
                    </h2>

                    <div className="flex items-center justify-center mt-3">
                      <button
                        onClick={() => deleteUser()}
                        className="mx-1 focus-visible:outline-none btn border border-[#DC4E4E] bg-[#DC4E4E] p-2.5 rounded-md text-white fill-white flex items-center justify-center font-medium gap-x-2"
                      >
                        {lang === "ar" ? "يتأكد" : "Confirm"}
                      </button>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
