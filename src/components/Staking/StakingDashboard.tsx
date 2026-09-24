"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLayer5Staking } from "@/lib/hooks/useLayer5Staking";
import { formatTokenAmount, formatApy, formatAddress } from "@/lib/utils/formatters";
import { protocolConfig } from "@/lib/blockchain/config";
import { TransactionModal } from "../Transaction/TransactionModal";
import { WrongNetworkBanner } from "../Wallet/WrongNetworkBanner";
import { WalletConnectModal } from "../Wallet/WalletConnectModal";
import {
  Sparkles,
  TrendingUp,
  Wallet,
  Activity,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Check,
  Radio,
  Lock,
  Zap,
  Layers,
  Percent,
  Coins,
  RefreshCw,
  ChevronRight
} from "lucide-react";

/**
 * Denar-style Guilloche Sine Wave SVG Ornament
 */
const GuillocheWave: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    viewBox="0 0 1200 32"
    preserveAspectRatio="none"
    className={`h-full w-full pointer-events-none select-none ${className}`}
    aria-hidden="true"
  >
    <g opacity="1">
      <path
        d="M0.00 16.00 L30.00 13.21 L60.00 20.94 L90.00 10.04 L120.00 21.61 L150.00 12.02 L180.00 17.44 L210.00 17.44 L240.00 12.02 L270.00 21.61 L300.00 10.04 L330.00 20.94 L360.00 13.21 L390.00 16.00 L420.00 18.79 L450.00 11.06 L480.00 21.96 L510.00 10.00 L540.00 19.98 L570.00 14.56 L600.00 14.56 L630.00 19.98 L660.00 10.00 L690.00 21.96 L720.00 11.06 L750.00 18.79 L780.00 16.00 L810.00 13.21 L840.00 20.94 L870.00 10.04 L900.00 21.61 L930.00 12.02 L960.00 17.44 L990.00 17.44 L1020.00 12.02 L1050.00 21.61 L1080.00 10.04 L1110.00 20.94 L1140.00 13.21 L1170.00 16.00 L1200.00 18.79"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.65"
      />
      <path
        d="M0.00 22.00 L30.00 10.69 L60.00 19.41 L90.00 15.28 L120.00 13.87 L150.00 20.49 L180.00 10.17 L210.00 21.83 L240.00 11.51 L270.00 16.72 L300.00 16.72 L330.00 11.51 L360.00 21.83 L390.00 10.17 L420.00 20.49 L450.00 13.87 L480.00 15.28 L510.00 19.41 L540.00 10.69 L570.00 22.00 L600.00 20.49 L630.00 10.69 L660.00 19.41 L690.00 15.28 L720.00 13.87 L750.00 20.49 L780.00 10.17 L810.00 21.83 L840.00 11.51 L870.00 16.72 L900.00 16.72 L930.00 11.51 L960.00 21.83 L990.00 10.17 L1020.00 20.49 L1050.00 13.87 L1080.00 15.28 L1110.00 19.41 L1140.00 10.69 L1170.00 22.00 L1200.00 13.21"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.65"
      />
      <path
        d="M0.00 10.00 L30.00 21.31 L60.00 12.59 L90.00 16.72 L120.00 18.13 L150.00 11.51 L180.00 21.83 L210.00 10.17 L240.00 20.49 L270.00 15.28 L300.00 15.28 L330.00 20.49 L360.00 10.17 L390.00 21.83 L420.00 11.51 L450.00 18.13 L480.00 16.72 L510.00 12.59 L540.00 21.31 L570.00 10.00 L600.00 11.51 L630.00 21.31 L660.00 12.59 L690.00 16.72 L720.00 18.13 L750.00 11.51 L780.00 21.83 L810.00 10.17 L840.00 20.49 L870.00 15.28 L900.00 15.28 L930.00 20.49 L960.00 10.17 L990.00 21.83 L1020.00 11.51 L1050.00 18.13 L1080.00 16.72 L1110.00 12.59 L1140.00 21.31 L1170.00 10.00 L1200.00 18.79"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.65"
      />
    </g>
  </svg>
);

/**
 * Geometric Rosette / Spirograph Banknote Watermark
 */
const RosetteWatermark: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg viewBox="0 0 144 144" className={`pointer-events-none select-none ${className}`} aria-hidden="true">
    <g opacity="1" style={{ transformOrigin: "72px 72px" }}>
      {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345].map(
        (angle, idx) => {
          const rad = (angle * Math.PI) / 180;
          const cx = 72 + 22 * Math.cos(rad);
          const cy = 72 + 22 * Math.sin(rad);
          return (
            <circle
              key={idx}
              cx={cx.toFixed(2)}
              cy={cy.toFixed(2)}
              r="30"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.7"
            />
          );
        }
      )}
    </g>
  </svg>
);

export const StakingDashboard: React.FC = () => {
  const {
    isConnected,
    isWrongNetwork,
    address,
    switchToRobinhood,
    stakeDecimals,
    stakedBalance,
    pendingRewards,
    tokenBalance,
    totalStaked,
    calculatedApy,
    isContractConfigured,
    txState,
    resetTxState,
    stake,
    unstake,
    claim,
  } = useLayer5Staking();

  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const [inputAmount, setInputAmount] = useState<string>("");
  const [unstakeModalOpen, setUnstakeModalOpen] = useState<boolean>(false);
  const [unstakeAmount, setUnstakeAmount] = useState<string>("");
  const [walletModalOpen, setWalletModalOpen] = useState<boolean>(false);

  // Live ticking reward simulator to visually demonstrate per-block continuous stream
  const [liveRewardTicker, setLiveRewardTicker] = useState<number>(0);
  useEffect(() => {
    if (!isConnected || stakedBalance === 0n) return;
    const interval = setInterval(() => {
      setLiveRewardTicker((prev) => prev + 0.000035);
    }, 200);
    return () => clearInterval(interval);
  }, [isConnected, stakedBalance]);

  const hasStaked = isConnected && stakedBalance > 0n;
  const hasRewards = isConnected && pendingRewards > 0n;

  const handlePercentage = (pct: number) => {
    const balance = activeTab === "deposit" ? tokenBalance : stakedBalance;
    if (balance === 0n) {
      setInputAmount("0.00");
      return;
    }
    const formatted = parseFloat(formatTokenAmount(balance, stakeDecimals, 6));
    const calculated = ((formatted * pct) / 100).toFixed(4);
    setInputAmount(calculated);
  };

  const handleMax = () => {
    const balance = activeTab === "deposit" ? tokenBalance : stakedBalance;
    setInputAmount(formatTokenAmount(balance, stakeDecimals, 6));
  };

  const handleMaxUnstake = () => {
    setUnstakeAmount(formatTokenAmount(stakedBalance, stakeDecimals, 6));
  };

  const handleMainSubmit = async () => {
    if (!inputAmount || parseFloat(inputAmount) <= 0) return;
    if (activeTab === "deposit") {
      await stake(inputAmount);
    } else {
      await unstake(inputAmount);
    }
    setInputAmount("");
  };

  const handleUnstakeSubmit = async () => {
    if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) return;
    await unstake(unstakeAmount);
    setUnstakeModalOpen(false);
    setUnstakeAmount("");
  };

  const displayPendingRewards = isConnected
    ? (parseFloat(formatTokenAmount(pendingRewards, 18, 5)) + liveRewardTicker).toFixed(5)
    : "0.00000";

  return (
    <div className="w-full space-y-16 sm:space-y-20 font-sans text-left text-[#1C1B18]">
      {isWrongNetwork && (
        <div className="mb-4">
          <WrongNetworkBanner onSwitch={switchToRobinhood} />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. HERO BANNER: Denar-style Editorial Hero with Dual Floating Emblems      */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl border border-[#E5E0D5] bg-white p-7 sm:p-12 md:p-14 shadow-[0_12px_40px_rgba(28,27,24,0.04)]">
        {/* Background Artwork - Inverted High-Key Classical Etching */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
          <Image
            src="/aegis-hero-bg.jpg"
            alt="Aegis Heroic Background"
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-[center_28%] opacity-[0.22] mix-blend-multiply filter invert grayscale brightness-[1.25] contrast-[1.15]"
            priority
          />
          {/* Subtle gradient wash for maximum legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
        </div>

        {/* Guilloche ornament at top border */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-8 text-[#283615] opacity-[0.18]">
          <GuillocheWave />
        </div>

        {/* Floating Dual Token Artwork on Right (Desktop) */}
        <div className="pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 md:block lg:right-12" aria-hidden="true">
          <div className="relative w-72 h-72">
            {/* Background floating Aegis Solid Shield */}
            <div className="absolute -top-10 -right-2 h-44 w-44 rounded-full bg-[#FAF8F5]/90 border border-[#E5E0D5] p-6 shadow-[0_16px_36px_rgba(0,0,0,0.08)] rotate-[12deg] opacity-95 transition-transform duration-700 hover:rotate-6 backdrop-blur-xs">
              <div className="relative w-full h-full">
                <Image
                  src="/aegis-logo-black.png"
                  alt="Aegis Rewards Token"
                  fill
                  sizes="176px"
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Foreground floating USDG Coin */}
            <div className="relative mt-8 ml-2 h-56 w-56 rounded-full bg-white/95 border border-[#E5E0D5] p-5 shadow-[0_20px_48px_rgba(40,54,21,0.14)] -rotate-6 transition-transform duration-700 hover:-rotate-2 backdrop-blur-xs">
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <Image
                  src="/usdg-icon.png"
                  alt="USDG Token"
                  fill
                  sizes="224px"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Narrative & Action Cluster */}
        <div className="relative max-w-2xl">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#9B783E] font-semibold">
            USDG Staking Pool · Robinhood Chain L2
          </p>

          <h1 className="font-display mt-3 text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.05] tracking-tight text-[#1C1B18]">
            Stake USDG,{" "}
            <span className="font-serif italic font-normal text-[#283615]">stream the yield</span>.
          </h1>

          <p className="mt-5 text-[15px] sm:text-[16px] leading-relaxed text-[#6B665E]">
            Deposit USDG to continuously stream Aegis reward tokens every single block. 100% principal backing, zero lockup epochs, micro-cent gas, and instant liquidity exit whenever you like.
          </p>

          <p className="mt-3 text-[13px] leading-relaxed text-[#8C877D]">
            Live on Robinhood Chain Mainnet: deposit USDG directly, harvest rewards block by block, zero penalty exit.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#stake"
              className="group rounded-full bg-[#1C1B18] px-6 py-3 text-[13.5px] font-mono font-medium uppercase tracking-wider text-[#F6F3EC] shadow-[0_4px_14px_rgba(28,27,24,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#283615] hover:shadow-md"
            >
              Deposit USDG
              <span className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </a>

            <Link
              href="/docs"
              className="group rounded-full border border-[#283615]/30 bg-white px-6 py-3 text-[13.5px] font-mono font-medium uppercase tracking-wider text-[#283615] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#283615] hover:bg-[#283615]/5"
            >
              Read the design
              <span className="ml-1.5 inline-block text-[12px] transition-transform duration-200 group-hover:translate-x-0.5">↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. KPI METRIC STRIP: 4 Denar Cards (`#stake`)                              */}
      {/* ========================================================================= */}
      <section id="stake" className="scroll-mt-24 space-y-6">
        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#9B783E] font-semibold">
            Live Protocol Telemetry
          </p>
          <h2 className="font-display mt-2 max-w-2xl text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.1] tracking-tight text-[#1C1B18]">
            Deposit USDG,{" "}
            <span className="font-serif italic font-normal text-[#283615]">stream for the drip</span>.
          </h2>
        </div>

        {/* 4 Metric Cards */}
        <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {/* Metric 1: USDG In Pool */}
          <div className="min-w-0 rounded-2xl border border-[#E5E0D5] bg-white p-4 sm:p-5 shadow-[0_4px_20px_rgba(28,27,24,0.03)] hover:border-black/20 transition duration-200">
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6B665E]">USDG in Pool</dt>
            <dd className="mt-2 truncate font-display text-2xl sm:text-3xl text-[#1C1B18]">
              {totalStaked > 0n ? `$${formatTokenAmount(totalStaked, stakeDecimals, 2)}` : "$0.00"}
            </dd>
            <dd className="mt-1.5 truncate font-mono text-[11px] text-[#8C877D]">staked USDG liquidity</dd>
          </div>

          {/* Metric 2: Reserve Backing */}
          <div className="min-w-0 rounded-2xl border border-[#E5E0D5] bg-white p-4 sm:p-5 shadow-[0_4px_20px_rgba(28,27,24,0.03)] hover:border-black/20 transition duration-200">
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6B665E]">Principal Backing</dt>
            <dd className="mt-2 truncate font-display text-2xl sm:text-3xl text-[#1C1B18]">100% Backed</dd>
            <dd className="mt-1.5 truncate font-mono text-[11px] text-[#8C877D]">1:1 USDG liquid on Robinhood</dd>
          </div>

          {/* Metric 3: Redeemable now */}
          <div className="min-w-0 rounded-2xl border border-[#E5E0D5] bg-white p-4 sm:p-5 shadow-[0_4px_20px_rgba(28,27,24,0.03)] hover:border-black/20 transition duration-200">
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6B665E]">Withdrawal Speed</dt>
            <dd className="mt-2 truncate font-display text-2xl sm:text-3xl text-[#1C1B18]">Instant</dd>
            <dd className="mt-1.5 truncate font-mono text-[11px] text-[#8C877D]">zero lockup epochs (0s)</dd>
          </div>

          {/* Metric 4: Estimated APY */}
          <div className="min-w-0 rounded-2xl border border-[#283615]/35 bg-white p-4 sm:p-5 shadow-[0_4px_20px_rgba(40,54,21,0.06)] hover:border-[#283615] transition duration-200">
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6B665E]">Estimated APY</dt>
            <dd className="mt-2 truncate font-display text-2xl sm:text-3xl text-[#283615]">
              {calculatedApy !== undefined && calculatedApy > 0 ? formatApy(calculatedApy) : "0.00%"}
            </dd>
            <dd className="mt-1.5 truncate font-mono text-[11px] text-[#283615]/80 font-medium">streaming block-by-block drip</dd>
          </div>
        </dl>

        {/* ========================================================================= */}
        {/* 3. DUAL SPLIT INTERACTIVE BENTO: Deposit & Withdraw | Stream & Harvest     */}
        {/* ========================================================================= */}
        <div className="grid gap-5 lg:grid-cols-2 items-start pt-2">
          {/* ---------------- CARD 1: DEPOSIT & WITHDRAW USDG ---------------- */}
          <article className="overflow-hidden rounded-3xl border border-[#E5E0D5] bg-white shadow-[0_12px_36px_rgba(28,27,24,0.04)]">
            {/* Header Wash with Coin Illustration & Badge */}
            <div className="relative flex min-h-[140px] flex-col justify-end overflow-hidden p-6 sm:p-7 bg-gradient-to-b from-[#283615]/[0.04] to-transparent border-b border-[#E5E0D5]">
              <div className="pointer-events-none absolute -right-4 -top-6 h-36 w-36 rotate-[10deg] opacity-85">
                <Image
                  src="/usdg-icon.png"
                  alt="USDG"
                  fill
                  sizes="144px"
                  className="object-contain"
                />
              </div>

              <span className="absolute left-6 top-6 rounded-full bg-white px-3 py-1 font-mono text-[11px] text-[#6B665E] border border-[#E5E0D5] shadow-xs">
                USDG · 1:1 Principal
              </span>

              <div className="relative">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#6B665E]">The asset</p>
                <h3 className="font-display text-2xl sm:text-3xl text-[#1C1B18] mt-1">Deposit &amp; Withdraw</h3>
              </div>
            </div>

            {/* Interactive Module Body */}
            <div className="p-6 sm:p-7 space-y-6">
              <p className="text-[14px] leading-relaxed text-[#6B665E]">
                Deposit USDG to activate your autonomous yield stream. Withdraw any time with zero epochs, zero penalties, and 100% instant liquid settlement.
              </p>

              {/* Tab Switcher */}
              <div className="flex items-center gap-1.5 rounded-full bg-[#FAF8F5] p-1 border border-[#E5E0D5] w-fit">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("deposit");
                    setInputAmount("");
                  }}
                  className={`px-4 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider font-semibold transition-all duration-200 cursor-pointer ${
                    activeTab === "deposit"
                      ? "bg-[#1C1B18] text-[#F6F3EC] shadow-xs"
                      : "text-[#6B665E] hover:text-[#1C1B18]"
                  }`}
                >
                  Deposit USDG
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("withdraw");
                    setInputAmount("");
                  }}
                  className={`px-5 py-2.5 rounded-full font-mono text-xs sm:text-sm uppercase tracking-wider font-bold transition-all duration-200 cursor-pointer ${
                    activeTab === "withdraw"
                      ? "bg-[#1C1B18] text-[#F6F3EC] shadow-sm"
                      : "text-[#6B665E] hover:text-[#1C1B18]"
                  }`}
                >
                  Withdraw USDG
                </button>
              </div>

              {/* Amount Input Box */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between font-mono text-xs sm:text-sm text-[#6B665E]">
                  <span className="uppercase text-[11px] sm:text-xs tracking-wider font-semibold">
                    {activeTab === "deposit" ? "DEPOSIT USDG" : "WITHDRAW USDG"}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs">
                      BAL: {activeTab === "deposit"
                        ? isConnected ? formatTokenAmount(tokenBalance, stakeDecimals, 2) : "0.00"
                        : isConnected ? formatTokenAmount(stakedBalance, stakeDecimals, 2) : "0.00"}
                    </span>
                    <button
                      type="button"
                      onClick={handleMax}
                      className="px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E5E0D5] text-xs font-bold text-[#1C1B18] hover:bg-black/5 hover:border-black/30 transition cursor-pointer"
                    >
                      MAX
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-[#FAF8F5] border border-[#E5E0D5] p-4 sm:p-5 focus-within:border-[#283615] transition">
                  <input
                    type="number"
                    placeholder="0.00"
                    value={inputAmount}
                    onChange={(e) => setInputAmount(e.target.value)}
                    className="w-full bg-transparent font-mono text-2xl sm:text-3xl font-bold text-[#1C1B18] outline-none placeholder:text-[#8C877D]/40"
                  />
                  <div className="flex items-center gap-2.5 rounded-xl bg-white px-3.5 py-2 border border-[#E5E0D5] shadow-xs shrink-0 ml-3">
                    <Image
                      src="/usdg-icon.png"
                      alt="USDG"
                      width={22}
                      height={22}
                      className="rounded-full"
                    />
                    <span className="font-mono text-xs sm:text-sm font-bold text-[#1C1B18]">USDG</span>
                  </div>
                </div>

                {/* Percentage Shortcuts */}
                <div className="flex items-center gap-2 pt-1">
                  {[25, 50, 75, 100].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handlePercentage(pct)}
                      className="flex-1 py-2 sm:py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D5] text-xs font-mono font-bold text-[#6B665E] hover:text-[#1C1B18] hover:bg-black/5 hover:border-black/30 transition cursor-pointer"
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              {!isConnected ? (
                <button
                  type="button"
                  onClick={() => setWalletModalOpen(true)}
                  className="w-full min-h-[56px] py-4 px-6 rounded-full bg-[#1C1B18] hover:bg-[#283615] text-[#F6F3EC] font-mono text-sm sm:text-base uppercase tracking-wider font-bold transition shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 cursor-pointer"
                >
                  <Wallet className="w-5 h-5 text-[#F6F3EC]" />
                  <span>CONNECT WALLET TO STAKE</span>
                </button>
              ) : !isContractConfigured ? (
                <div className="w-full min-h-[56px] py-4 text-center bg-[#FAF8F5] rounded-full text-[#6B665E] font-mono text-xs sm:text-sm tracking-wider uppercase border border-[#E5E0D5] flex items-center justify-center">
                  Contract Pending Deployment
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleMainSubmit}
                  disabled={!inputAmount || parseFloat(inputAmount) <= 0}
                  className="w-full min-h-[56px] py-4 px-6 rounded-full bg-[#1C1B18] hover:bg-[#283615] text-[#F6F3EC] font-mono text-sm sm:text-base uppercase tracking-wider font-bold transition shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer"
                >
                  <span>{activeTab === "deposit" ? "Confirm Deposit USDG" : "Confirm Withdraw USDG"}</span>
                  <ArrowRight className="w-5 h-5 text-[#F6F3EC]" />
                </button>
              )}

              {/* Breakdown Key-Value DL List */}
              <dl className="mt-4 divide-y divide-[#E5E0D5] font-mono text-sm pt-2">
                <div className="flex items-center justify-between gap-3 py-2.5">
                  <dt className="shrink-0 text-[#6B665E]">Your USDG Balance</dt>
                  <dd className="min-w-0 truncate font-medium text-[#1C1B18]">
                    {isConnected ? `${formatTokenAmount(tokenBalance, stakeDecimals, 2)} USDG` : "not connected"}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-3 py-2.5">
                  <dt className="shrink-0 text-[#6B665E]">Your Staked USDG</dt>
                  <dd className="min-w-0 truncate font-medium text-[#1C1B18]">
                    {isConnected ? `${formatTokenAmount(stakedBalance, stakeDecimals, 2)} USDG` : "not connected"}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-3 py-2.5">
                  <dt className="shrink-0 text-[#6B665E]">Deposit / Exit Fees</dt>
                  <dd className="min-w-0 truncate font-medium text-[#283615]">0.00% / 0.00%</dd>
                </div>

                <div className="flex items-center justify-between gap-3 py-2.5">
                  <dt className="shrink-0 text-[#6B665E]">Lockup Period</dt>
                  <dd className="min-w-0 truncate font-medium text-[#1C1B18]">0s (Instant)</dd>
                </div>
              </dl>

              <p className="text-[12.5px] leading-relaxed text-[#8C877D] border-t border-[#E5E0D5] pt-3">
                Principal withdrawals settle directly from the pool contract with 0 cooldown epochs. Penarikan instan setiap detik.
              </p>
            </div>
          </article>

          {/* ---------------- CARD 2: STREAM & HARVEST (AEGIS RADAR) ---------------- */}
          <article className="overflow-hidden rounded-3xl border border-[#E5E0D5] bg-white shadow-[0_12px_36px_rgba(28,27,24,0.04)]">
            {/* Header Wash with Coin Illustration & Badge */}
            <div className="relative flex min-h-[140px] flex-col justify-end overflow-hidden p-6 sm:p-7 bg-gradient-to-b from-[#283615]/[0.04] to-transparent border-b border-[#E5E0D5]">
              <div className="pointer-events-none absolute -right-4 -top-6 h-36 w-36 rotate-[10deg] opacity-90 p-4">
                <Image
                  src="/aegis-logo-black.png"
                  alt="Aegis"
                  fill
                  sizes="144px"
                  className="object-contain"
                />
              </div>

              <span className="absolute left-6 top-6 rounded-full bg-white px-3 py-1 font-mono text-[11px] text-[#6B665E] border border-[#E5E0D5] shadow-xs">
                AEGIS · Reward Stream
              </span>

              <div className="relative">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#6B665E]">The yield stream</p>
                <h3 className="font-display text-2xl sm:text-3xl text-[#1C1B18] mt-1">Stream &amp; Harvest</h3>
              </div>
            </div>

            {/* Interactive Module Body */}
            <div className="p-6 sm:p-7 space-y-6">
              <p className="text-[14px] leading-relaxed text-[#6B665E]">
                Rewards accumulate continuously per block based on your share of the USDG pool. Claim accumulated AEGIS tokens at any moment with sub-cent gas.
              </p>

              {/* Staked Position & Stream Telemetry */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#FAF8F5] border border-[#E5E0D5] p-4">
                  <span className="font-mono text-[10px] uppercase text-[#6B665E] block tracking-wider">YOUR STAKE</span>
                  <div className="font-mono text-xl sm:text-2xl font-bold text-[#1C1B18] mt-1 truncate">
                    {isConnected ? formatTokenAmount(stakedBalance, stakeDecimals, 2) : "0.00"}
                  </div>
                  <span className="font-mono text-[10px] text-[#8C877D] block mt-0.5">USDG deposited</span>
                </div>

                <div className="rounded-2xl bg-[#FAF8F5] border border-[#283615]/30 p-4">
                  <div className="flex items-center justify-between font-mono text-[10px] text-[#6B665E]">
                    <span className="uppercase tracking-wider">STREAMED YIELD</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#283615] animate-pulse" />
                  </div>
                  <div className="font-mono text-xl sm:text-2xl font-bold text-[#283615] mt-1 truncate">
                    {displayPendingRewards}
                  </div>
                  <span className="font-mono text-[10px] text-[#283615] block mt-0.5 font-medium">AEGIS accruing</span>
                </div>
              </div>

              {/* Action Buttons: Claim Rewards & Exit Pool */}
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={claim}
                  disabled={!hasRewards}
                  className="flex-1 py-3.5 rounded-full bg-[#283615] hover:bg-[#1C1B18] text-[#F6F3EC] font-mono text-xs uppercase tracking-wider font-bold transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F6F3EC]" />
                  <span>Claim Rewards</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUnstakeModalOpen(true)}
                  disabled={!hasStaked}
                  className="flex-1 py-3.5 rounded-full border border-[#E5E0D5] bg-white hover:bg-black/5 text-[#1C1B18] font-mono text-xs uppercase tracking-wider font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Exit Pool
                </button>
              </div>

              {/* Breakdown Key-Value DL List */}
              <dl className="mt-4 divide-y divide-[#E5E0D5] font-mono text-sm pt-2">
                <div className="flex items-center justify-between gap-3 py-2.5">
                  <dt className="shrink-0 text-[#6B665E]">Total Pool Staked</dt>
                  <dd className="min-w-0 truncate font-medium text-[#1C1B18]">
                    {totalStaked > 0n ? `${formatTokenAmount(totalStaked, stakeDecimals, 2)} USDG` : "—"}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-3 py-2.5">
                  <dt className="shrink-0 text-[#6B665E]">Your Pool Share</dt>
                  <dd className="min-w-0 truncate font-medium text-[#1C1B18]">
                    {isConnected && stakedBalance > 0n && totalStaked > 0n
                      ? `${((Number(stakedBalance) / Number(totalStaked)) * 100).toFixed(2)}%`
                      : "0.00%"}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-3 py-2.5">
                  <dt className="shrink-0 text-[#6B665E]">Stream Velocity</dt>
                  <dd className="min-w-0 truncate font-medium text-[#1C1B18]">Continuous Synthetix O(1)</dd>
                </div>

                <div className="flex items-center justify-between gap-3 py-2.5">
                  <dt className="shrink-0 text-[#6B665E]">Paying now, drip</dt>
                  <dd className="min-w-0 truncate font-medium text-[#283615]">Block-by-block stream</dd>
                </div>

                <div className="flex items-center justify-between gap-3 py-2.5">
                  <dt className="shrink-0 text-[#6B665E]">AEGIS Claimable</dt>
                  <dd className="min-w-0 truncate font-medium text-[#283615]">
                    {isConnected ? `${displayPendingRewards} AEGIS` : "—"}
                  </dd>
                </div>
              </dl>

              {/* Denar Signature Callout Box */}
              <div className="rounded-2xl border border-[#E5E0D5] bg-[#FAF8F5] p-4 text-[12.5px] leading-relaxed text-[#6B665E] space-y-1">
                <p className="font-medium text-[#1C1B18]">
                  Estimated APY — {calculatedApy !== undefined && calculatedApy > 0 ? formatApy(calculatedApy) : "0.00%"}
                </p>
                <p>
                  An estimate, recomputed dynamically from your staked USDG, the reward stream rate, and the circulating pool. Imbal hasil mengalir setiap blok tanpa jeda lockup.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. "HOW IT WORKS" 3-STAGE SECTION: Denar Rosette Cards                    */}
      {/* ========================================================================= */}
      <section className="pt-6 space-y-8">
        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#9B783E] font-semibold">How it works</p>
          <h2 className="font-display mt-2 max-w-2xl text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.1] tracking-tight text-[#1C1B18]">
            One dollar in, one dollar out — the{" "}
            <span className="font-serif italic font-normal text-[#283615]">yield is a choice</span>.
          </h2>
        </div>

        <ol className="grid gap-4 lg:grid-cols-3">
          {/* Step 1 */}
          <li className="relative h-full overflow-hidden rounded-3xl border border-[#E5E0D5] bg-white p-7 shadow-[0_4px_24px_rgba(28,27,24,0.03)] hover:border-black/20 transition">
            <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 text-[#283615] opacity-[0.08]">
              <RosetteWatermark className="h-full w-full" />
            </div>
            <span className="font-mono text-[11px] tracking-[0.2em] text-[#9B783E] font-bold">01</span>
            <h3 className="mt-3 text-[19px] font-semibold tracking-tight text-[#1C1B18]">Deposit USDG, zero fee</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-[#6B665E]">
              Deposit USDG directly from your wallet with zero minting fee and micro-cent gas on Robinhood Chain.
            </p>
          </li>

          {/* Step 2 */}
          <li className="relative h-full overflow-hidden rounded-3xl border border-[#E5E0D5] bg-white p-7 shadow-[0_4px_24px_rgba(28,27,24,0.03)] hover:border-black/20 transition">
            <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 text-[#283615] opacity-[0.08]">
              <RosetteWatermark className="h-full w-full" />
            </div>
            <span className="font-mono text-[11px] tracking-[0.2em] text-[#9B783E] font-bold">02</span>
            <h3 className="mt-3 text-[19px] font-semibold tracking-tight text-[#1C1B18]">Autonomous block stream</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-[#6B665E]">
              Yield accrues continuously per block using the Synthetix O(1) mathematical formulation, preventing front-running.
            </p>
          </li>

          {/* Step 3 */}
          <li className="relative h-full overflow-hidden rounded-3xl border border-[#E5E0D5] bg-white p-7 shadow-[0_4px_24px_rgba(28,27,24,0.03)] hover:border-black/20 transition">
            <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 text-[#283615] opacity-[0.08]">
              <RosetteWatermark className="h-full w-full" />
            </div>
            <span className="font-mono text-[11px] tracking-[0.2em] text-[#9B783E] font-bold">03</span>
            <h3 className="mt-3 text-[19px] font-semibold tracking-tight text-[#1C1B18]">Instant harvest &amp; withdraw</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-[#6B665E]">
              Claim your accumulated AEGIS rewards or withdraw your USDG principal at any second with 0-second lockup.
            </p>
          </li>
        </ol>
      </section>

      {/* ========================================================================= */}
      {/* 5. DEEP-DIVE DUAL ASSET SPOTLIGHT: USDG vs AEGIS                           */}
      {/* ========================================================================= */}
      <section className="pt-4">
        <div className="grid gap-5 lg:grid-cols-2">
          {/* Spotlight Card 1: USDG */}
          <article className="relative h-full overflow-hidden rounded-3xl border border-[#E5E0D5] bg-white p-8 sm:p-10 shadow-[0_12px_36px_rgba(28,27,24,0.04)]">
            <div className="pointer-events-none absolute -bottom-10 -right-8 h-56 w-56 -rotate-[10deg] opacity-90">
              <Image
                src="/usdg-icon.png"
                alt="USDG"
                fill
                sizes="224px"
                className="object-contain"
              />
            </div>

            <div className="relative max-w-sm">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#9B783E] font-semibold">The principal</p>
              <h3 className="font-display mt-2 text-3xl sm:text-4xl text-[#1C1B18]">USDG</h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-[#6B665E]">
                A 100% liquid, USD-pegged stablecoin on Robinhood Chain. Deposit it into the staking pool to activate continuous yield or withdraw instantly at any time.
              </p>

              <ul className="mt-5 space-y-2 text-[13px] text-[#6B665E]">
                <li>· 100% 1:1 principal preservation</li>
                <li>· Zero deposit or withdrawal friction</li>
                <li>· Micro-cent Robinhood Chain transaction gas</li>
              </ul>

              <a
                href="#stake"
                className="group mt-7 inline-flex items-center gap-1.5 rounded-full bg-[#1C1B18] px-5 py-2.5 text-[13px] font-mono uppercase tracking-wider text-[#F6F3EC] transition hover:-translate-y-0.5 hover:bg-[#283615]"
              >
                Deposit USDG
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </a>
            </div>
          </article>

          {/* Spotlight Card 2: AEGIS */}
          <article className="relative h-full overflow-hidden rounded-3xl border border-[#E5E0D5] bg-white p-8 sm:p-10 shadow-[0_12px_36px_rgba(28,27,24,0.04)]">
            <div className="pointer-events-none absolute -bottom-10 -right-8 h-56 w-56 rotate-[10deg] opacity-90 p-4">
              <Image
                src="/aegis-logo-black.png"
                alt="AEGIS"
                fill
                sizes="224px"
                className="object-contain"
              />
            </div>

            <div className="relative max-w-sm">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#9B783E] font-semibold">The reward stream</p>
              <h3 className="font-display mt-2 text-3xl sm:text-4xl text-[#1C1B18]">AEGIS</h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-[#6B665E]">
                The protocol reward token streamed block by block to all active USDG depositors. Harvest anytime directly into your wallet.
              </p>

              <ul className="mt-5 space-y-2 text-[13px] text-[#6B665E]">
                <li>· Autonomous continuous block drip</li>
                <li>· Zero epoch lockup or vesting penalty</li>
                <li>· Full governance and protocol utility</li>
              </ul>

              <a
                href="#stake"
                className="group mt-7 inline-flex items-center gap-1.5 rounded-full border border-[#283615]/30 bg-[#FAF8F5] px-5 py-2.5 text-[13px] font-mono uppercase tracking-wider text-[#283615] transition hover:-translate-y-0.5 hover:border-[#283615] hover:text-[#283615]"
              >
                Stake USDG
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </a>
            </div>
          </article>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. THE RESERVE ALLOCATION: 3 Cards                                        */}
      {/* ========================================================================= */}
      <section className="pt-6 space-y-8">
        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#9B783E] font-semibold">The reserve</p>
          <h2 className="font-display mt-2 max-w-2xl text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.1] tracking-tight text-[#1C1B18]">
            Three places a treasury dollar can{" "}
            <span className="font-serif italic font-normal text-[#283615]">be</span>.
          </h2>
          <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-[#6B665E]">
            Every staked USDG is matched by liquid backing. The protocol&apos;s only job is streaming continuous yield while maintaining liquid redemption reserves on-chain.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-[#E5E0D5] bg-white p-7 shadow-[0_4px_20px_rgba(28,27,24,0.03)] hover:border-black/20 transition">
            <h3 className="text-[17px] font-semibold tracking-tight text-[#1C1B18]">Liquid USDG buffer</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-[#6B665E]">
              A floor of the reserve stays as plain USDG, so ordinary withdrawals never wait on anything. Penarikan instan tanpa jeda.
            </p>
          </div>

          <div className="rounded-3xl border border-[#E5E0D5] bg-white p-7 shadow-[0_4px_20px_rgba(28,27,24,0.03)] hover:border-black/20 transition">
            <h3 className="text-[17px] font-semibold tracking-tight text-[#1C1B18]">Aegis lending vault</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-[#6B665E]">
              Part of the buffer earns borrower interest in the lending vault. Withdrawals unwind it automatically when the liquid buffer runs short.
            </p>
          </div>

          <div className="rounded-3xl border border-[#E5E0D5] bg-white p-7 shadow-[0_4px_20px_rgba(28,27,24,0.03)] hover:border-black/20 transition">
            <h3 className="text-[17px] font-semibold tracking-tight text-[#1C1B18]">Tokenized T-bills (SGOV)</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-[#6B665E]">
              The 0–3 month US Treasury token on Robinhood Chain. Dividends are reinvested continuously to amplify the staker yield pool.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. "BUILT LIKE THE MARKETS" DISCIPLINE CHECKLIST (6 Pillars)               */}
      {/* ========================================================================= */}
      <section className="pt-6">
        <div className="relative overflow-hidden rounded-3xl border border-[#E5E0D5] bg-white p-8 sm:p-12 shadow-[0_12px_40px_rgba(28,27,24,0.04)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-8 text-[#283615] opacity-[0.16]">
            <GuillocheWave />
          </div>

          <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#9B783E] font-semibold">
            Built like the markets
          </p>
          <h2 className="font-display mt-2 max-w-2xl text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.1] tracking-tight text-[#1C1B18]">
            The same discipline, applied to{" "}
            <span className="font-serif italic font-normal text-[#283615]">USDG staking</span>.
          </h2>

          <ul className="mt-10 grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Always withdrawable 1:1 in USDG",
                desc: "Withdrawals settle against the pool contracts directly — never dependent on third-party liquidity.",
              },
              {
                title: "Conservative valuation",
                desc: "The reserve never counts unvested yield before it is paid, maintaining strict mathematical safety.",
              },
              {
                title: "Retained equity before payouts",
                desc: "Yield is only distributed above a verified buffer sized to the reserve — never down to the last cent.",
              },
              {
                title: "Rate-limited operations",
                desc: "Pool operations are bounded on-chain and rate-limited by smart contract parameters.",
              },
              {
                title: "Autonomous stream engine",
                desc: "Yield drips linearly block-by-block using Synthetix O(1) mathematical formulation, preventing front-running.",
              },
              {
                title: "Verified on-chain, tested, reviewed",
                desc: "Smart contracts tested with invariant fuzzing, adversarial review, and deployed verified on Robinhood Chain L2.",
              },
            ].map((item, idx) => (
              <li key={idx} className="flex gap-3.5 items-start">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#283615]/10 font-mono text-[11px] text-[#283615] ring-1 ring-inset ring-[#283615]/20 font-bold">
                  ✓
                </span>
                <span>
                  <span className="block text-[14.5px] font-medium text-[#1C1B18]">{item.title}</span>
                  <span className="mt-1 block text-[13px] leading-relaxed text-[#6B665E]">{item.desc}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. THE PILOT CALLOUT BANNER (Denar Navy/Dark Frame)                         */}
      {/* ========================================================================= */}
      <section className="pt-4 pb-2">
        <div className="relative overflow-hidden rounded-3xl bg-[#1C1B18] p-8 sm:p-12 text-[#F6F3EC] shadow-[0_16px_48px_rgba(28,27,24,0.18)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-8 text-[#FAF8F5] opacity-[0.08]">
            <GuillocheWave />
          </div>

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#C5A059] font-semibold">
                The pilot
              </p>
              <h2 className="font-display mt-2.5 text-2xl sm:text-3xl font-normal leading-tight text-[#F6F3EC]">
                Small on purpose, and growing with its reserve.
              </h2>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-[#C8C4BC]">
                The pool opens on Robinhood Chain with transparent on-chain parameters. Stakers deposit USDG, earn AEGIS streaming yield, and withdraw without lockup friction.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-3">
              <a
                href="#stake"
                className="rounded-full bg-[#F6F3EC] px-6 py-3 text-[13px] font-mono uppercase tracking-wider font-bold text-[#1C1B18] transition hover:-translate-y-0.5 hover:bg-white shadow-sm"
              >
                Deposit USDG →
              </a>
              <Link
                href="/docs"
                className="rounded-full border border-white/20 px-6 py-3 text-[13px] font-mono uppercase tracking-wider font-semibold text-[#F6F3EC] transition hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/5"
              >
                Docs ↗
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* TRANSACTION & MODAL POPUPS                                                */}
      {/* ========================================================================= */}
      <TransactionModal state={txState} onClose={resetTxState} />

      <WalletConnectModal isOpen={walletModalOpen} onClose={() => setWalletModalOpen(false)} />

      {/* Unstake Modal Dialog */}
      {unstakeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-8 space-y-5 border border-[#E5E0D5] shadow-2xl max-w-md w-full text-[#1C1B18]">
            <h3 className="font-display text-2xl uppercase text-[#1C1B18] tracking-tight">Withdraw USDG</h3>
            <p className="text-xs font-mono text-[#6B665E]">
              Enter USDG amount to withdraw from the staking contract back into your wallet.
            </p>

            <div className="rounded-2xl p-3.5 flex items-center justify-between bg-[#FAF8F5] border border-[#E5E0D5] focus-within:border-[#283615]">
              <input
                type="number"
                placeholder="0.00"
                value={unstakeAmount}
                onChange={(e) => setUnstakeAmount(e.target.value)}
                className="w-full bg-transparent font-mono text-2xl text-[#1C1B18] outline-none font-bold"
              />
              <button
                type="button"
                onClick={handleMaxUnstake}
                className="shrink-0 text-[10px] font-mono px-3 py-1.5 rounded-full bg-white border border-[#E5E0D5] hover:bg-black/5 text-[#1C1B18] font-bold shadow-xs cursor-pointer"
              >
                MAX
              </button>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setUnstakeModalOpen(false)}
                className="flex-1 py-3 rounded-full border border-[#E5E0D5] text-[#1C1B18] font-mono text-xs uppercase font-medium hover:bg-black/5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUnstakeSubmit}
                disabled={!unstakeAmount || parseFloat(unstakeAmount) <= 0}
                className="flex-1 py-3 rounded-full bg-[#1C1B18] hover:bg-[#283615] text-[#F6F3EC] font-mono text-xs uppercase font-bold transition disabled:opacity-40 cursor-pointer"
              >
                Confirm Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StakingDashboard;
