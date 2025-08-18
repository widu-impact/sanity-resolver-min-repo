import { createNavigation } from 'next-intl/navigation';

import { intlRoutingConfig } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(intlRoutingConfig);
