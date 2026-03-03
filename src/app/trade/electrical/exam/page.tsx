import { Suspense } from "react";
import ElectricalExamClient from "./ElectricalExamClient";

export default function ElectricalExamPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1F1F1F] text-white" />}>
      <ElectricalExamClient />
    </Suspense>
  );
}
