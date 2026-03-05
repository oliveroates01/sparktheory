import Link from "next/link";
import ToolboxAccessGate from "@/components/tools/ToolboxAccessGate";

const TOOLS = [
  {
    id: "voltage-drop",
    title: "Voltage Drop Calculator",
    description: "Calculate voltage drop and check compliance against BS 7671 limits.",
    href: "/tools/voltage-drop",
    tag: "Calculator",
    available: true,
  },
  {
    id: "cable-size",
    title: "Cable Size Calculator",
    description: "Estimate a suitable cable size using corrected current-carrying capacity.",
    href: "/tools/cable-size",
    tag: "Calculator",
    available: true,
  },
  {
    id: "zs",
    title: "Earth Fault Loop (Zs) Calculator",
    description: "Calculate Zs from Ze and R1+R2 and compare with device max values.",
    href: "/tools/zs",
    tag: "Calculator",
    available: true,
  },
  {
    id: "conduit-fill",
    title: "Conduit Fill Calculator",
    description: "Check conduit fill percentage and maximum cable count.",
    href: "/tools/conduit-fill",
    tag: "Calculator",
    available: true,
  },
  {
    id: "rcd",
    title: "RCD Checker",
    description: "Validate measured trip times against common test-current rules.",
    href: "/tools/rcd",
    tag: "Calculator",
    available: true,
  },
] as const;

export default function ToolsPage() {
  return (
    <ToolboxAccessGate>
      <main className="min-h-screen bg-[#1F1F1F] text-white page-transition">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#FFC400]/25 via-[#FF9100]/20 to-[#FFC400]/20 blur-3xl" />
          <div className="absolute bottom-[-220px] right-[-200px] h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-[#FFC400]/18 to-[#FF9100]/12 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_30%_20%,rgba(255,196,0,0.14),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(700px_420px_at_70%_80%,rgba(255,145,0,0.12),transparent_60%)]" />
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-6 py-10">
          <div className="mx-auto w-full max-w-6xl">
            <Link
              href="/trade/electrical"
              className="inline-flex rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/10"
            >
              Back
            </Link>
            <h1 className="mt-4 text-3xl font-bold tracking-tight">Tool Box</h1>
            <p className="mt-2 text-sm text-white/70">
              Practical calculators for electrical design checks.
            </p>
          </div>

          <section className="mt-8 mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {TOOLS.map((tool) => (
                <div
                  key={tool.id}
                  className="flex flex-col justify-between min-h-[160px] rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 transition-[background-color,box-shadow,ring-color] duration-200 hover:bg-white/10 hover:ring-white/15"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-bold leading-snug">{tool.title}</h3>

                    <span className="inline-flex items-center gap-2 rounded-full bg-[#FFC400]/20 px-3 py-1 text-xs font-semibold text-[#FFC400] ring-1 ring-[#FF9100]/30">
                      {tool.tag}
                    </span>
                  </div>

                  {tool.available ? (
                    <Link
                      href={tool.href}
                      className="mt-auto block w-full rounded-xl bg-[#FFC400] px-4 py-3 text-center text-sm font-semibold text-black shadow-sm shadow-[#FF9100]/20 transition hover:bg-[#FF9100]"
                    >
                      Open tool
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="mt-auto block w-full cursor-not-allowed rounded-xl bg-white/10 px-4 py-3 text-center text-sm font-semibold text-white/70 ring-1 ring-white/10"
                    >
                      Coming soon
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </ToolboxAccessGate>
  );
}
