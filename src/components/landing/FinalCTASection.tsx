"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";
import { Layer5Emblem } from "@/components/Brand/Layer5Emblem";
import { protocolConfig } from "@/lib/blockchain/config";

export const FinalCTASection: React.FC = () => {
  return (
    <footer className="relative w-full pt-28 sm:pt-36 lg:pt-48 pb-12 px-4 sm:px-8 lg:px-12 bg-[#F6F3EC] border-t border-black/[0.08] overflow-hidden">
      {/* Background atmospheric ambient aura */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] sm:w-[1000px] h-[450px] bg-gradient-to-t from-[#EAE4D6]/70 via-[#E2DDD0]/30 to-transparent blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-24 sm:space-y-36">
        {/* Massive Closing Invitation */}
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-black/[0.08] font-mono text-[11px] uppercase tracking-[0.2em] text-[#283615] shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#283615]" />
            <span>06 // FINAL CALL TO YIELD</span>
          </div>

          <h2 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase text-[#1C1B18] leading-[0.98]">
            BUILT FOR
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1C1B18] via-[#283615] to-[#1C1B18]">
              EVERY BLOCK.
            </span>
          </h2>

          <p className="font-sans text-base sm:text-lg md:text-xl text-[#6B665E] max-w-2xl mx-auto leading-relaxed">
            Deposit USDG, initiate constant-time Synthetix O(1) reward streaming, and withdraw anytime with zero friction on Robinhood Chain.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/stake"
              className="w-full sm:w-auto px-10 py-5 rounded-full bg-[#1C1B18] hover:bg-[#2d2b27] text-[#F6F3EC] font-display text-sm font-bold uppercase tracking-[0.12em] transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.14)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>START STAKING NOW</span>
              <ArrowUpRight className="w-4 h-4 text-[#F6F3EC]" />
            </Link>

            <Link
              href="/position"
              className="w-full sm:w-auto px-8 py-5 rounded-full bg-white hover:bg-[#FAF8F5] text-[#1C1B18] font-mono text-xs sm:text-sm font-medium uppercase tracking-[0.1em] border border-black/[0.12] hover:border-black/30 transition-all duration-300 shadow-sm flex items-center justify-center gap-2"
            >
              <span>VIEW PORTFOLIO</span>
            </Link>
          </div>
        </div>

        {/* Editorial Footer Grid */}
        <div className="pt-16 border-t border-black/[0.08] space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-12">
            {/* Brand Column */}
            <div className="md:col-span-5 space-y-4">
              <Link href="/" className="flex items-center gap-3 group">
                <Layer5Emblem size={28} variant="black" animate={false} />
                <span className="font-display font-extrabold text-lg text-[#1C1B18] tracking-wider uppercase">
                  AEGIS PROTOCOL
                </span>
              </Link>
              <p className="font-sans text-sm text-[#6B665E] max-w-sm leading-relaxed">
                Autonomous non-custodial staking infrastructure powered by the Synthetix O(1) streaming algorithm on Robinhood Chain L2.
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-[#6B665E] pt-2">
                <ShieldCheck className="w-4 h-4 text-[#283615]" />
                <span>NON-CUSTODIAL SMART CONTRACTS</span>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="md:col-span-2 space-y-3 font-mono text-xs">
              <div className="text-[#1C1B18] uppercase font-bold tracking-widest text-[11px]">
                NAVIGATION
              </div>
              <ul className="space-y-2 text-[#6B665E]">
                <li>
                  <Link href="/" className="hover:text-[#1C1B18] transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/stake" className="hover:text-[#1C1B18] transition-colors">
                    Stake USDG
                  </Link>
                </li>
                <li>
                  <Link href="/position" className="hover:text-[#1C1B18] transition-colors">
                    Position
                  </Link>
                </li>
                <li>
                  <Link href="/stats" className="hover:text-[#1C1B18] transition-colors">
                    Stats & Analytics
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-[#1C1B18] transition-colors">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>

            {/* Protocol Governance / Verification */}
            <div className="md:col-span-3 space-y-3 font-mono text-xs">
              <div className="text-[#1C1B18] uppercase font-bold tracking-widest text-[11px]">
                ROBINHOOD CHAIN
              </div>
              <ul className="space-y-2 text-[#6B665E]">
                <li>
                  <a
                    href={`${protocolConfig.explorerUrl}/address/${protocolConfig.stakingContractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#1C1B18] transition-colors flex items-center gap-1"
                  >
                    <span>Staking Contract</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a
                    href={`${protocolConfig.explorerUrl}/token/${protocolConfig.rewardTokenAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#1C1B18] transition-colors flex items-center gap-1"
                  >
                    <span>Aegis Token Contract</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a
                    href={`${protocolConfig.explorerUrl}/token/${protocolConfig.stakeTokenAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#1C1B18] transition-colors flex items-center gap-1"
                  >
                    <span>USDG Token Contract</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <Link href="/vodka" className="hover:text-[#1C1B18] transition-colors">
                    Admin Portal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Network State */}
            <div className="md:col-span-2 space-y-3 font-mono text-xs">
              <div className="text-[#1C1B18] uppercase font-bold tracking-widest text-[11px]">
                COMMUNITY
              </div>
              <ul className="space-y-2 text-[#6B665E]">
                <li>
                  <a
                    href="https://x.com/aegistak"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#1C1B18] transition-colors flex items-center gap-1"
                  >
                    <span>X (@aegistak)</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </li>

                <li>
                  <div className="flex items-center gap-2 pt-2 text-[#283615]">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span className="font-semibold text-[11px]">RPC ONLINE</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Hairline & Legal / Timestamp */}
          <div className="pt-8 border-t border-black/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-[11px] text-[#6B665E] uppercase tracking-wider">
            <div>© 2026 AEGIS PROTOCOL. NON-CUSTODIAL LIQUIDITY ENGINE.</div>
            <div className="flex items-center gap-4">
              <span>CHAIN ID: {protocolConfig.chainId}</span>
              <span>•</span>
              <span>BUILD: 2.4.0-ROBINHOOD</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FinalCTASection;
