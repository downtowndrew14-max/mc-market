"use client";

import dynamic from "next/dynamic";
import { Account } from "@/lib/db";

const MinecraftViewer = dynamic(() => import("./MinecraftViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-[120px] h-[180px] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
    </div>
  ),
});

function timeAgo(iso: string | Date) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const TYPE_COLORS: Record<string, string> = {
  "OG Name": "text-yellow-300 bg-yellow-900/30 border-yellow-700/40",
  "Full Access": "text-blue-300 bg-blue-900/30 border-blue-700/40",
  "Hypixel": "text-red-300 bg-red-900/30 border-red-700/40",
  "Rare Name": "text-purple-300 bg-purple-900/30 border-purple-700/40",
};

export default function AccountCard({ account }: { account: Account }) {
  return (
    <div className="group relative bg-[#0f0f0f] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/[0.12] transition-all duration-300 hover:shadow-[0_0_30px_rgba(74,222,128,0.05)] hover:-translate-y-0.5">
      {/* Top glow accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Character viewer area */}
      <div className="relative flex justify-center items-end pt-4 pb-0 bg-gradient-to-b from-[#151515] to-[#0f0f0f] overflow-hidden" style={{ height: 200 }}>
        {/* Background glow under character */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-12 bg-green-500/10 blur-2xl rounded-full" />
        <MinecraftViewer username={account.username} width={130} height={200} />
      </div>

      {/* Info */}
      <div className="p-4 pt-3 flex flex-col gap-2.5">
        {/* Name + Price */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-bold text-white text-base leading-tight truncate">{account.username}</p>
            <span className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded border mt-1 ${TYPE_COLORS[account.type] ?? "text-gray-400 bg-white/5 border-white/10"}`}>
              {account.type}
            </span>
          </div>
          <div className="text-right shrink-0">
            <p className="text-green-400 font-bold text-lg leading-tight">${account.price.toFixed(2)}</p>
            <p className="text-[10px] text-gray-600 mt-0.5">{timeAgo(account.createdAt)}</p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {account.hasCape && (
            <span className="text-[10px] bg-purple-900/30 text-purple-300 border border-purple-700/40 px-2 py-0.5 rounded-full">
              {account.capeType || "Cape"}
            </span>
          )}
          {account.nameChanges === 0 && (
            <span className="text-[10px] bg-yellow-900/30 text-yellow-300 border border-yellow-700/40 px-2 py-0.5 rounded-full">
              Original Name
            </span>
          )}
          {account.nameChanges > 0 && (
            <span className="text-[10px] bg-white/5 text-gray-400 border border-white/10 px-2 py-0.5 rounded-full">
              {account.nameChanges}x renamed
            </span>
          )}
        </div>

        {/* Description */}
        {account.description && (
          <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">{account.description}</p>
        )}

        {/* Contact button */}
        <a
          href={`https://discord.com/users/${account.discord}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 w-full flex items-center justify-center gap-2 bg-indigo-600/80 hover:bg-indigo-500 text-white text-xs font-semibold py-2 rounded-lg transition-all duration-200 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
          </svg>
          Contact Seller
        </a>
      </div>
    </div>
  );
}
