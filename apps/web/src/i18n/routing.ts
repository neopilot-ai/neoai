import transConfig from "trans.json";
import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: [...transConfig.locale.targets, transConfig.locale.source],
  defaultLocale: transConfig.locale.source,
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
