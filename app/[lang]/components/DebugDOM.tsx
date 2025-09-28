"use client";
import { useEffect } from "react";

export default function DebugDOM() {
    useEffect(() => {
        console.log("DOM nodes:", document.getElementsByTagName("*").length);
    }, []);

    return null; // no UI, just logs
}
