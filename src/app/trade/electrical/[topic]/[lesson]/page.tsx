import { Suspense } from "react";
import LessonClient from "./LessonClient";

export default function ElectricalLessonPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1F1F1F] text-white" />}>
      <LessonClient />
    </Suspense>
  );
}
