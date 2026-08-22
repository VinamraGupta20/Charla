"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

const SearchInput = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("topic") || "");

  useEffect(() => {
    const delay = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set("topic", query);
      } else {
        params.delete("topic");
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, 400);

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div
      className="flex items-center gap-2 px-3 rounded-lg flex-1 min-w-[200px]"
      style={{ backgroundColor: "var(--surface-2)", border: "1px solid var(--border)", height: "36px" }}
    >
      <Image src="/icons/search.svg" alt="search" width={16} height={16} className="opacity-50" />
      <input
        placeholder="Search companions..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-transparent border-none outline-none text-sm w-full"
        style={{ color: "var(--foreground)" }}
      />
    </div>
  );
};

export default SearchInput;