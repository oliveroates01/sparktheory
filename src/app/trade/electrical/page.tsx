import { Suspense } from "react";
import TradeElectricalClient from "./TradeElectricalClient";

export default function ElectricalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1F1F1F] text-white" />}>
      <TradeElectricalClient />
    </Suspense>
  );
}
