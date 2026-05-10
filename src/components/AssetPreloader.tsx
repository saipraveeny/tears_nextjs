"use client";

import { useEffect } from "react";

const ASSETS_TO_CACHE = [
  "/assets/wild.mp4",
  "/assets/glitch.mp4",
  "/assets/Background.mp4",
  "/assets/wild.png",
  "/assets/glitch.png",
  "/assets/green.png",
  "/assets/logo.png",
];

const CACHE_NAME = "tears-asset-cache-v1";

export default function AssetPreloader() {
  useEffect(() => {
    if (!("caches" in window)) return;

    const cacheAssets = async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        
        // Check if assets are already cached to avoid redundant network calls
        const cachedKeys = await cache.keys();
        const cachedUrls = cachedKeys.map(request => new URL(request.url).pathname);
        
        const assetsToFetch = ASSETS_TO_CACHE.filter(
          asset => !cachedUrls.includes(asset)
        );

        if (assetsToFetch.length > 0) {
          console.log("Caching new assets for performance:", assetsToFetch);
          await cache.addAll(assetsToFetch);
        }
      } catch (error) {
        console.error("Asset caching failed:", error);
      }
    };

    // Run caching after the page has loaded to not interfere with initial TTI
    if (document.readyState === "complete") {
      cacheAssets();
    } else {
      window.addEventListener("load", cacheAssets);
      return () => window.removeEventListener("load", cacheAssets);
    }
  }, []);

  return null;
}
