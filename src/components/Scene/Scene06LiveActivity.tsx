"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useBlockNumber } from "wagmi";
import { protocolConfig } from "@/lib/blockchain/config";
import {
  Sparkles,
  Radio,
  ExternalLink,
  ShieldCheck,
  Zap,
  ArrowUpRight,
} from "lucide-react";

interface StreamEvent {
  id: string;
  type: "STAKE" | "CLAIM" | "COMPOUND";
  address: string;
  amount: string;
  asset: "USDG" | "AEGIS";
  elapsed: string;
  hash: string;
}

export const Scene06LiveActivity: React.FC = () => {
  const [events, setEvents] = useState<StreamEvent[]>([]);
  const { data: blockNumberData } = useBlockNumber({ watch: true });
  const liveBlockHeight = blockNumberData ? Number(blockNumberData) : 0;

  return (
    <section
      id="activity"
      className="relative w-full min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-24 overflow-hidden border-t border-black/[0.08]"
    >
      <div className="max-w-7xl mx-auto w-full space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-3 text-xs font-mono tracking-[0.3em] text-[#283615] uppercase font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#283615]" />
              <span>SCENE 06 • ON-CHAIN STREAM</span>
            </div>

            <h2 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl tracking-tight text-[#1C1B18] uppercase leading-tight">
              LIVE PROTOCOL <span className="text-[#283615]">ACTIVITY</span>
            </h2>

            <p className="text-sm sm:text-base text-[#6B665E] font-sans">
              Real-time settlement stream synchronized across Robinhood Chain validator nodes.
            </p>
          </div>

          {/* Live Synchronized Block Status */}
          <div className="bg-white rounded-2xl px-5 py-3 border border-black/[0.08] shadow-sm font-mono text-xs flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#283615] animate-pulse" />
              <span className="text-[#6B665E] uppercase text-[10px]">CURRENT BLOCK</span>
              <span className="text-[#1C1B18] font-bold">#{liveBlockHeight.toLocaleString()}</span>
            </div>
            <span className="text-black/10">|</span>
            <span className="text-[#283615] font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#283615]" /> 100% OPERATIONAL
            </span>
          </div>
        </div>

        {/* Cinematic Stream Grid Layout */}
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((ev, i) => {
              const isStake = ev.type === "STAKE";
              const isClaim = ev.type === "CLAIM";

              return (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="bg-white rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-md border border-black/[0.08] hover:border-black/[0.2] transition group relative"
                >
                  {/* Event Header */}
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider ${
                        isStake
                          ? "bg-[#283615]/10 text-[#283615] border border-[#283615]/30"
                          : isClaim
                          ? "bg-sky-500/10 text-sky-700 border border-sky-500/20"
                          : "bg-purple-500/10 text-purple-700 border border-purple-500/20"
                      }`}
                    >
                      {ev.type}
                    </span>
                    <span className="text-[11px] text-[#6B665E]">{ev.elapsed}</span>
                  </div>

                  {/* Amount and Asset Display */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#6B665E] uppercase tracking-widest block">
                      SETTLED VALUE
                    </span>
                    <div className="text-2xl sm:text-3xl font-mono font-bold text-[#1C1B18] tracking-tight flex items-baseline gap-2">
                      <span>{ev.amount}</span>
                      <span className={`text-xs font-semibold ${isStake ? "text-[#283615]" : "text-sky-700"}`}>
                        {ev.asset}
                      </span>
                    </div>
                  </div>

                  {/* Cryptographic Address & Hash */}
                  <div className="pt-3 border-t border-black/[0.06] flex items-center justify-between font-mono text-xs text-[#6B665E]">
                    <div className="space-y-0.5">
                      <span className="text-[9px] uppercase tracking-wider block text-[#6B665E]">
                        DELEGATOR
                      </span>
                      <span className="text-[11px] text-[#1C1B18] font-medium">{ev.address}</span>
                    </div>

                    {protocolConfig.explorerUrl ? (
                      <a
                        href={`${protocolConfig.explorerUrl}/tx/${ev.hash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-[#FAF8F5] hover:bg-black/5 text-[#6B665E] hover:text-[#1C1B18] transition"
                        title="View on Explorer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#6B665E] group-hover:text-[#283615] transition" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center font-mono border border-black/[0.08] shadow-sm space-y-3">
            <span className="w-3 h-3 rounded-full bg-[#283615] inline-block animate-ping mb-2" />
            <div className="text-base text-[#1C1B18] font-bold uppercase tracking-wider">Listening For On-Chain Blocks</div>
            <p className="text-xs text-[#6B665E] max-w-md mx-auto leading-relaxed">
              Real-time staking transactions on Robinhood Chain Mainnet will automatically appear here as they are mined.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
