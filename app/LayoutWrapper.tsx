// app/LayoutWrapper.tsx (or ../LayoutWrapper.tsx)
"use client"; // if this file uses state/effects

import React from "react";

export type LayoutWrapperProps = {
  children: React.ReactNode;
  homepageProps?: Record<string, any>;
  dict?: any;                // ✅ added
  selectedCity?: string;     // ✅ added
  lang?: string;             // (optional) handy to pass down
};

export default function LayoutWrapper({
  children,
  // homepageProps,
  // dict,
  // selectedCity,
  // lang,
}: LayoutWrapperProps) {
  // use dict / selectedCity as needed
  // e.g. provide to a context/provider if many children need them
  return (
    <div>
      {children}
    </div>
  );
}
