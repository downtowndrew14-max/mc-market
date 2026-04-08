"use client";

import Link from "next/link";
import { Account, getCapeList } from "@/lib/db";

function ncLabel(n: number) {
  if (n === 0) return "PRENAME";
  if (n >= 15) return "15+ NAME CHANGES";
  return `${n} NAME CHANGE${n !== 1 ? "S" : ""}`;
}

export default function AccountCard({ account }: { account: Account }) {
  const capes = getCapeList(account.capes);

  return (
    <Link href={`/account/${account.id}`}>
      <div className="bg-white rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200 border border-gray-100">
        {/* Character render */}
        <div className="relative bg-gray-50 flex justify-center items-end overflow-hidden" style={{ height: 220 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc-heads.net/body/${account.username}/200`}
            alt={account.username}
            className="h-full object-contain"
            loading="lazy"
          />
          {/* Cape thumbnails bottom-left */}
          {capes.length > 0 && (
            <div className="absolute bottom-2 left-2 flex gap-1">
              {capes.slice(0, 3).map((cape) => (
                <div
                  key={cape}
                  title={cape}
                  className="w-8 h-8 bg-white rounded-md border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm"
                >
                  <span className="text-[8px] text-gray-500 font-bold text-center leading-tight px-0.5">
                    {cape.slice(0, 3).toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-bold text-gray-900 text-lg leading-tight">{account.username}</h3>
            <span className="text-xs text-gray-400 font-medium mt-1 shrink-0 ml-2">{ncLabel(account.nameChanges)}</span>
          </div>

          {account.description && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-3 leading-snug">{account.description}</p>
          )}

          <div className="flex items-center gap-4 mt-2">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">C/O</p>
              <p className="text-sm font-semibold text-gray-700">
                {account.currentOffer > 0 ? `$${account.currentOffer.toFixed(2)}` : "-"}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">BIN</p>
              <p className="text-sm font-semibold text-gray-900">
                {account.price > 0 ? `$${account.price.toFixed(2)}` : "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
