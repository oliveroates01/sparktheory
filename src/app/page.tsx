import type { Metadata } from "next";
import TopicsPage from "./topics/page";

export const metadata: Metadata = {
  title: "Spark Theory | Electrical Exam Practice & Revision",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Spark Theory",
  alternateName: "SparkTheory",
  url: "https://www.sparktheory.co.uk/",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <TopicsPage />
    </>
  );
}
