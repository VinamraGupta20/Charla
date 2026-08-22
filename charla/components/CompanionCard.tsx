"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { getSubjectColor } from "@/lib/utils";
import { addBookmark, removeBookmark } from "@/lib/actions/companion.actions";
import { usePathname } from "next/navigation";

interface CompanionCardProps {
  id: string;
  name: string;
  topic: string;
  subject: string;
  duration: number;
  bookmarked?: boolean;
}

const CompanionCard = ({ id, name, topic, subject, duration, bookmarked = false }: CompanionCardProps) => {
  const [isBookmarked, setIsBookmarked] = useState(bookmarked);
  const pathname = usePathname();
  const color = getSubjectColor(subject);

  const toggleBookmark = async () => {
    setIsBookmarked((prev) => !prev);
    if (isBookmarked) {
      await removeBookmark(id, pathname);
    } else {
      await addBookmark(id, pathname);
    }
  };

  return (
    <article
      className="flex flex-col gap-3 p-4 rounded-xl"
      style={{
        backgroundColor: "var(--surface-1)",
        border: "1px solid var(--border)",
        borderLeft: `3px solid ${color}`,
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-xs px-2 py-1 rounded-md capitalize font-medium"
          style={{
            backgroundColor: "var(--surface-2)",
            color: color,
            border: "1px solid var(--border)",
          }}
        >
          {subject}
        </span>
        <button onClick={toggleBookmark} aria-label="Toggle bookmark" className="cursor-pointer">
          <Image
            src={isBookmarked ? "/icons/bookmark-filled.svg" : "/icons/bookmark.svg"}
            alt="bookmark"
            width={16}
            height={16}
          />
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <h3
          className="text-lg font-bold"
          style={{ fontFamily: "var(--font-bricolage)", letterSpacing: "-0.02em", color: "var(--foreground)" }}
        >
          {name}
        </h3>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          {topic}
        </p>
      </div>

      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-1.5" style={{ color: "var(--muted-foreground)" }}>
          <Image src="/icons/clock.svg" alt="duration" width={14} height={14} />
          <span className="text-xs">{duration} mins</span>
        </div>
        <Link href={`/companions/${id}`}>
          <button className="btn-secondary" style={{ height: "32px", fontSize: "13px" }}>
            Start Session
          </button>
        </Link>
      </div>
    </article>
  );
};

export default CompanionCard;