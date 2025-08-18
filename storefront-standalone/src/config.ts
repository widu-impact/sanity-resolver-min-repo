import { getEnv } from "./lib/env/src";

export function getAppConfig() {
  const isStaging = getEnv("NEXT_PUBLIC_APP_ENV") === "staging";
  const isDevelopment = getEnv("NEXT_PUBLIC_APP_ENV") === "development";

  let defaultRevalidateTime = 60 * 60; // 1hr

  if (isStaging) {
    defaultRevalidateTime = 15 * 60; // 15min
  }

  if (isDevelopment) {
    // We cannot use 0 as value, because it will disable cache invalidation for staticly generated pages.
    // It will result in unability to invalidate cache without full rebuild.
    defaultRevalidateTime = 1; // 1sec
  }

  return {
    cache: {
      revalidateTime: {
        frame: defaultRevalidateTime,
        pages: defaultRevalidateTime,
        translations: defaultRevalidateTime,
        productDetails: defaultRevalidateTime,
        productCollection: defaultRevalidateTime,
        category: defaultRevalidateTime,
        categoryCollection: defaultRevalidateTime,
        market: defaultRevalidateTime,
        priceLists: defaultRevalidateTime,
      },
    },
  };
}
