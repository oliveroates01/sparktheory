import { Suspense } from "react";
import TopicClient from "./TopicClient";

export default function ElectricalTopicPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1F1F1F] text-white" />}>
      <TopicClient />
    </Suspense>
  );
}
