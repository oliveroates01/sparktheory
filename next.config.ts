import type { NextConfig } from "next";

const resolvedGitSha =
  process.env.NEXT_PUBLIC_GIT_SHA ||
  process.env.VERCEL_GIT_COMMIT_SHA ||
  process.env.GIT_COMMIT_SHA ||
  "dev";

const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString();

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_GIT_SHA: resolvedGitSha,
    NEXT_PUBLIC_BUILD_TIME: buildTime,
  },
  generateBuildId: async () => {
    const sha = (process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_COMMIT_SHA || "").trim();
    if (sha) return sha.slice(0, 20);
    return `local-${Date.now()}`;
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
      {
        source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
    ];
  },
};

export default nextConfig;
