"use client";

import Image from "next/image";
import { Account } from "@/lib/db";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AccountCard({ account }: { account: Account }) {
  return (
    <div className="bg-[#111] border border-[#1f1f1f] rounded-xl p-4 flex flex-col gap-3 hover:border-[#2f2f2f] transition-colors">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Image
          src={`https://crafatar.com/avatars/${account.username}?size=48&overlay`}
          alt={account.username}
          width={48}
          height={48}
          className="rounded-md"
          unoptimized
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white truncate">{account.username}</p>
          <span className="text-xs text-gray-500">{account.type}</span>
        </div>
        <p className="text-green-400 font-bold text-lg shrink-0">
          ${account.price.toFixed(2)}
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {account.hasCape && (
          <span className="text-xs bg-purple-900/40 text-purple-300 border border-purple-800/50 px-2 py-0.5 rounded-full">
            {account.capeType || "Cape"}
          </span>
        )}
        {account.nameChanges === 0 && (
          <span className="text-xs bg-yellow-900/40 text-yellow-300 border border-yellow-800/50 px-2 py-0.5 rounded-full">
            OG Name
          </span>
        )}
        {account.nameChanges > 0 && (
          <span className="text-xs bg-[#1a1a1a] text-gray-400 border border-[#2a2a2a] px-2 py-0.5 rounded-full">
            {account.nameChanges} name change{account.nameChanges !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Description */}
      {account.description && (
        <p className="text-xs text-gray-500 line-clamp-2">{account.description}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-1">
        <span className="text-xs text-gray-600">{timeAgo(String(account.createdAt))}</span>
        <a
          href={`https://discord.com/users/${account.discord}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-md transition-colors font-medium"
          onClick={(e) => e.stopPropagation()}
        >
          Contact
        </a>
      </div>
    </div>
  );
}
