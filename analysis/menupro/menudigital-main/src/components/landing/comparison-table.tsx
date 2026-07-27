"use client";

import { motion } from "framer-motion";
import { Check, Minus, Infinity as InfinityIcon } from "lucide-react";
import { LIMIT_COMPARISON, PLANS } from "@/lib/plans";

const PLAN_IDS: Array<"free" | "pro" | "premium" | "full"> = ["free", "pro", "premium", "full"];

export function ComparisonTable() {
  return (
    <section id="comparativa" className="py-20 md:py-28 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#d4af37]/[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header — minimalista */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 tracking-tight">
              Compara cada plan
            </h2>
            <p className="text-base md:text-lg text-white/55 max-w-xl mx-auto">
              Mira exactamente qué obtienes en cada uno.
            </p>
          </motion.div>
        </div>

        {/* ─── DESKTOP: tabla clásica (md+) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="hidden md:block relative rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden"
        >
          {/* Header row */}
          <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr] bg-white/[0.03] border-b border-white/10">
            <div className="p-5">
              <div className="text-xs text-white/40 uppercase tracking-wider font-semibold">Característica</div>
            </div>
            {PLAN_IDS.map((id) => {
              const plan = PLANS[id];
              const isHighlight = plan.highlight || id === "premium";
              return (
                <div
                  key={id}
                  className={`p-5 text-center border-l border-white/5 ${isHighlight ? "bg-white/[0.03]" : ""}`}
                >
                  <div className="text-base font-bold text-white">{plan.name}</div>
                  <div className="text-xs text-white/50 mt-0.5">
                    {plan.priceMonthly === 0 ? "Gratis" : `S/ ${plan.priceMonthly}/mes`}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Body rows */}
          <div className="divide-y divide-white/5">
            {LIMIT_COMPARISON.map((row, idx) => (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: Math.min(idx * 0.02, 0.4) }}
                className="grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr] hover:bg-white/[0.02] transition-colors"
              >
                <div className="p-5 flex items-center gap-2.5">
                  <span className="text-base opacity-70">{row.icon}</span>
                  <span className="text-sm text-white/85 font-medium">{row.label}</span>
                </div>
                {row.values.map((value, i) => {
                  const planId = PLAN_IDS[i];
                  const plan = PLANS[planId];
                  const isCheck = value === "✓";
                  const isDash = value === "—";
                  const isInfinite = value === "∞";
                  return (
                    <div
                      key={i}
                      className="p-5 text-center border-l border-white/5 flex items-center justify-center"
                    >
                      {isCheck ? (
                        <Check className="w-4 h-4" style={{ color: plan.color }} />
                      ) : isDash ? (
                        <Minus className="w-4 h-4 text-white/15" />
                      ) : isInfinite ? (
                        <InfinityIcon className="w-4 h-4 text-white/55" />
                      ) : (
                        <span
                          className="text-sm font-semibold"
                          style={{
                            color: value.includes("/") || value.includes("✓")
                              ? "rgba(255,255,255,0.7)"
                              : "rgba(255,255,255,0.85)",
                          }}
                        >
                          {value}
                        </span>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            ))}
          </div>

          {/* CTA row */}
          <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr] border-t border-white/10 bg-white/[0.02]">
            <div className="p-5" />
            {PLAN_IDS.map((id) => {
              const plan = PLANS[id];
              const href = id === "free" ? "/register" : `/register?plan=${id}`;
              const isPrimary = plan.highlight;
              return (
                <div key={id} className="p-5 border-l border-white/5 flex justify-center">
                  <a
                    href={href}
                    className={`inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                      isPrimary
                        ? "bg-gradient-to-r from-[#d4af37] to-[#f4d35e] text-[#1a1a2e] hover:shadow-lg hover:shadow-[#d4af37]/30"
                        : "border border-white/15 text-white hover:bg-white/10"
                    }`}
                  >
                    Elegir {plan.name}
                  </a>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ─── MOBILE: cards apiladas por plan (< md) ─── */}
        <div className="md:hidden space-y-4">
          {PLAN_IDS.map((planId, planIdx) => {
            const plan = PLANS[planId];
            const isPrimary = plan.highlight;
            const href = planId === "free" ? "/register" : `/register?plan=${planId}`;
            return (
              <motion.div
                key={planId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: planIdx * 0.05 }}
                className={`rounded-2xl border overflow-hidden ${
                  isPrimary
                    ? "border-[#d4af37]/50 bg-gradient-to-b from-[#d4af37]/[0.06] to-transparent"
                    : "border-white/10 bg-white/[0.02]"
                }`}
              >
                {/* Card header */}
                <div className="p-4 border-b border-white/5 flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                    {isPrimary && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#d4af37]/20 text-[#d4af37] uppercase tracking-wider">
                        Popular
                      </span>
                    )}
                  </div>
                  <div className="text-sm">
                    {plan.priceMonthly === 0 ? (
                      <span className="text-white/60">Gratis</span>
                    ) : (
                      <span className="text-white/85 font-bold">S/ {plan.priceMonthly}<span className="text-white/40 font-normal text-xs">/mes</span></span>
                    )}
                  </div>
                </div>

                {/* Features list — tomadas de LIMIT_COMPARISON */}
                <div className="divide-y divide-white/[0.04]">
                  {LIMIT_COMPARISON.map((row) => {
                    const value = row.values[PLAN_IDS.indexOf(planId)];
                    const isCheck = value === "✓";
                    const isDash = value === "—";
                    const isInfinite = value === "∞";
                    return (
                      <div key={row.label} className="px-4 py-2.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-sm opacity-60 flex-shrink-0">{row.icon}</span>
                          <span className="text-xs text-white/70 truncate">{row.label}</span>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          {isCheck ? (
                            <Check className="w-4 h-4 inline" style={{ color: plan.color }} />
                          ) : isDash ? (
                            <Minus className="w-3.5 h-3.5 inline text-white/15" />
                          ) : isInfinite ? (
                            <InfinityIcon className="w-4 h-4 inline text-white/55" />
                          ) : (
                            <span className="text-xs font-semibold text-white/85">{value}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* CTA */}
                <div className="p-4 border-t border-white/5">
                  <a
                    href={href}
                    className={`block w-full text-center py-2.5 rounded-lg text-sm font-bold transition-all ${
                      isPrimary
                        ? "bg-gradient-to-r from-[#d4af37] to-[#f4d35e] text-[#1a1a2e] hover:shadow-lg hover:shadow-[#d4af37]/30"
                        : "border border-white/15 text-white hover:bg-white/10"
                    }`}
                  >
                    Elegir {plan.name}
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Nota debajo — minimalista */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs text-white/40 mt-8 max-w-2xl mx-auto"
        >
          ¿Mesas, mozos o white label? <span className="text-white/65">Premium</span> desde el día 1.
          ¿Multi-sucursal o voucher POS? <span className="text-white/65">Full</span>.
        </motion.p>
      </div>
    </section>
  );
}
