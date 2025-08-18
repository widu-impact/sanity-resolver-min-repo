import withNextIntl from 'next-intl/plugin';

import withBundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';
import fs from 'fs/promises';
import * as v from 'valibot';

const isAnalyzeEnabled = process.env.ANALYZE === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = withNextIntl('./src/features/intl/config/request.ts')({
  swcMinify: true,
  webpack(config) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    config.resolve = config.resolve || {};
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    config.resolve.alias = config.resolve.alias || {};
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    config.module.rules.push({
      // https://react-svgr.com/docs/next/
      // to transform raw SVG into a react components
      test: /\.svg$/i,
      use: ['@svgr/webpack'],
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return config;
  },
});

export default isAnalyzeEnabled
  ? withBundleAnalyzer({
      enabled: isAnalyzeEnabled,
    })(nextConfig)
  : nextConfig;
