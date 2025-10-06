// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import Negotiator from "negotiator";

const SUPPORTED_LOCALES = ["en", "ar"] as const;
const DEFAULT_LOCALE: (typeof SUPPORTED_LOCALES)[number] = "ar";
const PUBLIC_FILE = /\.[^/]+$/;

const enc = (v: string | null | undefined) =>
    v == null ? "" : encodeURIComponent(v);

function isPrefixedWithSupportedLocale(pathname: string) {
    return SUPPORTED_LOCALES.some(
        (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
    );
}

function detectPreferredLocale(req: NextRequest): (typeof SUPPORTED_LOCALES)[number] {
    const negotiator = new Negotiator({
        headers: { "accept-language": req.headers.get("accept-language") ?? "en" },
    });
    const languages = negotiator.languages();
    const match = languages.find((l) =>
        SUPPORTED_LOCALES.includes(l.toLowerCase().split("-")[0] as any)
    );
    return (match ? match.split("-")[0] : DEFAULT_LOCALE) as (typeof SUPPORTED_LOCALES)[number];
}

function classifyDevice(h: Headers) {
    const ua = (h.get("user-agent") ?? "").toLowerCase();
    const chMobile = h.get("sec-ch-ua-mobile");
    const chPlatform = (h.get("sec-ch-ua-platform") ?? "").replace(/"/g, "");
    const chModel = (h.get("sec-ch-ua-model") ?? "").toLowerCase();

    const isAndroid = /android/.test(ua) || chPlatform === "Android";
    const isiPhone = /iphone|ipod/.test(ua);
    const isiPad = /ipad/.test(ua) || (/macintosh/.test(ua) && /mobile/.test(ua)) || chModel.includes("ipad");
    const isIOS = isiPhone || isiPad || chPlatform === "iOS";

    const isWebViewIOS = isIOS && /applewebkit/.test(ua) && !/safari/.test(ua);
    const isWebViewAndroid = isAndroid && ((/; wv/.test(ua) || /version\/\d+\.\d+/.test(ua)) && !/chrome\/\d+/.test(ua));
    const isWebView = isWebViewIOS || isWebViewAndroid;

    const isAndroidTablet = isAndroid && !/mobile/.test(ua);
    const isTablet = isiPad || isAndroidTablet;
    const isMobileByCH = chMobile === "?1";
    const isMobileByUA = /mobile/.test(ua) || isiPhone || (isAndroid && !isAndroidTablet);
    const isMobile = !isTablet && (isMobileByCH || isMobileByUA);

    const os =
        isIOS ? "iOS" :
            isAndroid ? "Android" :
                /windows/.test(ua) ? "Windows" :
                    /mac os x|macintosh/.test(ua) ? "macOS" :
                        /cros/.test(ua) ? "ChromeOS" :
                            /linux/.test(ua) ? "Linux" : "Unknown";

    const deviceType: "mobile" | "tablet" | "desktop" = isTablet ? "tablet" : isMobile ? "mobile" : "desktop";

    let deviceDetail:
        | "iOS Mobile"
        | "Android Mobile"
        | "Webview iOS Mobile"
        | "Webview Android Mobile"
        | "Tablet"
        | "Desktop" = "Desktop";
    if (deviceType === "tablet") deviceDetail = "Tablet";
    else if (deviceType === "mobile") {
        if (isWebView && isIOS) deviceDetail = "Webview iOS Mobile";
        else if (isWebView && isAndroid) deviceDetail = "Webview Android Mobile";
        else if (isIOS) deviceDetail = "iOS Mobile";
        else if (isAndroid) deviceDetail = "Android Mobile";
        else deviceDetail = "Android Mobile";
    }
    return { deviceType, deviceDetail, isWebView, os };
}

export function middleware(req: NextRequest) {
    const { pathname, searchParams } = req.nextUrl;

    // Skip public files
    if (PUBLIC_FILE.test(pathname)) return NextResponse.next();

    // Skip APIs
    if (pathname.startsWith("/api/")) return NextResponse.next();

    // Skip Next.js internal paths
    if (pathname.startsWith('/_next/') || pathname.includes('__next') || pathname.includes('/_not-found')) {
        return NextResponse.next();
    }

    // 1) Ensure locale prefix - but only for valid paths
    if (!isPrefixedWithSupportedLocale(pathname)) {
        const detected = detectPreferredLocale(req);
        const url = req.nextUrl.clone();
        
        // For root path, redirect to localized root
        if (pathname === '/') {
            url.pathname = `/${detected}`;
            return NextResponse.redirect(url);
        }
        
        // For other paths, redirect to localized version
        url.pathname = `/${detected}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
        return NextResponse.redirect(url);
    }

    // At this point, we have a localized path like /ar/something or /en/something

    // Locale from path
    const localeFromPath = (pathname.split("/")[1] || DEFAULT_LOCALE) as (typeof SUPPORTED_LOCALES)[number];

    // 2) Slug extraction (everything after /[lang])
    const parts = pathname.split("/").filter(Boolean);
    const slugParts = parts.slice(1);
    const slugStr = slugParts.length ? slugParts[slugParts.length - 1] : "";

    // 3) Device detection
    const { deviceType, deviceDetail, isWebView, os } = classifyDevice(req.headers);

    // 4) City detection (may be Arabic)
    const cookieCityRaw = req.cookies.get("city")?.value || "";
    const qpCityRaw = searchParams.get("city") || ""; // /ar?city=جدة
    const cityRaw =
        qpCityRaw ||
        // @ts-ignore Vercel edge runtime
        (req.geo?.city as string | undefined) ||
        req.headers.get("x-vercel-ip-city") ||
        req.headers.get("cf-ipcity") ||
        cookieCityRaw ||
        "";

    // 5) Origin
    const xfProto = req.headers.get("x-forwarded-proto");
    const xfHost = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const origin = xfProto && xfHost ? `${xfProto}://${xfHost}` : req.nextUrl.origin;

    // 6) Forward (encode all possibly non-ASCII values)
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-lang", localeFromPath);
    requestHeaders.set("x-slug-str", enc(slugStr));
    requestHeaders.set("x-slug-parts", JSON.stringify(slugParts.map((p) => enc(p))));
    requestHeaders.set("x-device-type", deviceType);
    requestHeaders.set("x-device-detail", deviceDetail);
    requestHeaders.set("x-webview", isWebView ? "1" : "0");
    requestHeaders.set("x-os", os);
    requestHeaders.set("x-origin", origin);
    requestHeaders.set("x-pathname", enc(req.nextUrl.pathname));
    requestHeaders.set("x-search", enc(req.nextUrl.search || ""));
    if (cityRaw) requestHeaders.set("x-city", enc(cityRaw)); // ✅ encode Arabic

    const res = NextResponse.next({ request: { headers: requestHeaders } });

    // 7) Cookies (encode the city to keep ASCII-only cookie value)
    res.cookies.set("lang", localeFromPath, { path: "/" });
    res.cookies.set("deviceType", deviceType, { path: "/" });
    if (cityRaw) {
        res.cookies.set("city", enc(cityRaw), {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 30,
        });
    }

    // 8) Client Hints & Vary
    res.headers.set("Accept-CH", "Sec-CH-UA, Sec-CH-UA-Platform, Sec-CH-UA-Model, Sec-CH-UA-Mobile");
    res.headers.set("Critical-CH", "Sec-CH-UA-Platform, Sec-CH-UA-Mobile");
    res.headers.set("Vary", "Accept-Language, User-Agent, Sec-CH-UA-Platform, Sec-CH-UA-Mobile");

    return res;
}

export const config = {
    matcher: [
        "/((?!api/|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|images|icons|assets|fonts|\\.well-known).*)",
    ],
};