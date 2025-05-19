"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { usePathname, useParams } from "next/navigation";
import Link from "next/link";

const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();
  const { storeId } = useParams();

  const routes = [
    {
      label: "Overview",
      href: `/${storeId}/`,
    },
    {
      label: "Billboards",
      href: `/${storeId}/billboards`,
    },
    {
      label: "Categories",
      href: `/${storeId}/categories`,
    },
    {
      label: "Sizes",
      href: `/${storeId}/sizes`,
    },
    {
      label: "Colors",
      href: `/${storeId}/colors`,
    },
    {
      label: "Products",
      href: `/${storeId}/products`,
    },
    {
      label: "Settings",
      href: `/${storeId}/settings`,
    },
  ];
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {routes.map((route, index) => (
        <Link
          key={index}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === route.href
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;
