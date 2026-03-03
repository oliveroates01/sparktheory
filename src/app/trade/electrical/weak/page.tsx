import { Suspense } from "react";
import WeakElectricalClient from "./WeakElectricalClient";

export default function WeakElectricalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1F1F1F] text-white" />}>
      <WeakElectricalClient />
    </Suspense>
  );
}
