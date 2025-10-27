'use client';
import { useEffect } from 'react';

interface RichContentProps {
  brand: string;
  productId: string;
  language: string;
}

export default function RichContentWidget({ brand, productId, language }: RichContentProps) {
  useEffect(() => {
    // Check if script already added
    if (document.getElementById('ttl-stream-script')) return;

    const script = document.createElement('script');
    script.id = 'ttl-stream-script';
    script.src = 'https://content.24ttl.stream/widget.js';
    script.async = true;

    const ttlStreamReady = new Promise((resolve) => {
      script.onload = function () {
        // @ts-ignore
        window.ttlStream = new window.TTLStream({});
        resolve(window.ttlStream);
      };
    });

    document.body.appendChild(script);

    ttlStreamReady.then(() => {
      // @ts-ignore
      window.ttlStream.findAndInsert({
        brand,
        productId,
        retailerDomain: 'tamkeenstores.com.sa',
        resultType: 'html',
        contentType: 'minisite',
        el: '.exampleWrapperContent',
        templateType: 'master_template',
        language: 'sa_' + language,
      });
    });
  }, [brand, productId, language]);

  return (
    <div className="exampleWrapperContent"></div>
  );
}