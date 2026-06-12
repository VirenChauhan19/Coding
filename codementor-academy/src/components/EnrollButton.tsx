"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function EnrollButton({
  courseId,
  enrolled,
  size = "md",
  className,
}: {
  courseId: string;
  enrolled: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (enrolled) {
    return (
      <Button variant="secondary" size={size} className={className} disabled>
        ✓ Enrolled
      </Button>
    );
  }

  async function enroll() {
    setLoading(true);
    await fetch("/api/courses/enroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <Button variant="primary" size={size} className={className} onClick={enroll} disabled={loading}>
      {loading ? "Enrolling…" : "Enroll"}
    </Button>
  );
}
