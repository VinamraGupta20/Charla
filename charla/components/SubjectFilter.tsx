"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { subjects } from "@/constants";

const SubjectFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSubject = searchParams.get("subject") || "";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("subject", value);
    } else {
      params.delete("subject");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <select
      className="input"
      style={{ width: "180px" }}
      value={currentSubject}
      onChange={(e) => handleChange(e.target.value)}
    >
      <option value="">All Subjects</option>
      {subjects.map((s) => (
        <option key={s} value={s} className="capitalize">
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </option>
      ))}
    </select>
  );
};

export default SubjectFilter;