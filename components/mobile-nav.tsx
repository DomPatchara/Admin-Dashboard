"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import { Menu } from "lucide-react";
import { X } from 'lucide-react';
import { useState } from "react";

const MobileNav = () => {
  const pathname = usePathname();
  const { storeId } = useParams();

  const [isOpen, setIsOpen] = useState(false);
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
      label: "Orders",
      href: `/${storeId}/orders`,
    },
    {
      label: "Settings",
      href: `/${storeId}/settings`,
    },
  ];
  return (
    <>
      <div 
      onClick={()=>setIsOpen(true)}
      className="lg:hidden block mr-2 cursor-pointer p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800/50 transition-color duration-300">
        <Menu />
      </div>
      
      <nav
        className={cn(
          "absolute top-0 bottom-0 left-0 -translate-x-70 dark:bg-black bg-gray-100 px-20 lg:hidden flex flex-col items-center justify-center space-y-6 z-10 transition-all duration-500",
          isOpen ? "translate-x-0" : "-translate-x-70"
        )}
      >
        <div 
        onClick={()=>setIsOpen(false)}
        className="absolute top-2 right-2 cursor-pointer p-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full">
            <X size={25} />
        </div>
        {routes.map((route, index) => (
          <Link
            onClick={()=>setIsOpen(false)}
            key={index}
            href={route.href}
            className={cn(
              "text-lg font-medium transition-colors hover:text-primary",
              pathname === route.href
                ? "text-black dark:text-white"
                : "text-muted-foreground"
            )}
          >
            {route.label}
          </Link>
        ))}
      </nav>
    </>
  );
};

export default MobileNav;
