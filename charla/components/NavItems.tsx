"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Companions", href: "/companions" },
  { label: "Tools", href: "/tools" },
  { label: "My Journey", href: "/my-journey" },
];

const NavItems = () => {
  const pathname = usePathname();

  return (
    <>
      {navItems.map(({ label, href }) => (
        <Link
          key={label}
          href={href}
          className={cn(
            "nav-link",
            pathname === href ? "nav-link-active" : ""
          )}
        >
          {label}
        </Link>
      ))}
    </>
  );
};

export default NavItems;