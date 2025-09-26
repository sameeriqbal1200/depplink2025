'use client';

import React from 'react';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ProgressBar
        height="6px"
        color="linear-gradient(90deg, #004B7A 8.33%, #8C191B 21.27%, #FF7B34 91.81%)"
        options={{ showSpinner: false, parent: '#loader-spin', speed: 400 }}
        shallowRouting
      />
    </>
  );
}
