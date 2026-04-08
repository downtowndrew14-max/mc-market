"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Account, getCapeList } from "@/lib/db";

function ncLabel(n: number) {
  if (n === 0) return "Prename (0)";
  if (n >= 15) return "15+";
  return String(n);
}

export default function AccountPage() {
  const { id } = useParams<{ id: string }>();
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    fetch(`/api/accounts/${id}`).then((r) => r.json()).then(setAccount);
  }, [id]);

  if (!account) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
      </div>
    );
  }

  const capes = getCapeList(account.capes);

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/browse" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-6 transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m15 18-6-6 6-6"/>
        </svg>
        Back to Browse
      </Link>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: character */}
        <div className="md:w-72 shrink-0">
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex justify-center items-end" style={{ height: 360 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://mc-heads.net/body/${account.username}/300`}
              alt={account.username}
              className="h-full object-contain"
            />
          </div>

          {/* Cape thumbnails */}
          {capes.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {capes.map((cape) => (
                <div key={cape} className="bg-white border border-gray-200 rounded-xl px-3 py-2 flex flex-col items-center gap-1 shadow-sm">
                  <div className="w-10 h-14 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-[9px] text-gray-400 font-bold text-center leading-tight px-1">{cape.slice(0, 4).toUpperCase()}</span>
                  </div>
                  <span className="text-[10px] text-gray-600 font-medium text-center leading-tight max-w-[60px]">{cape}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: info */}
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-gray-900">{account.username}</h1>

          {/* Description */}
          <div className="bg-white border border-gray-100 rounded-xl p-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              {account.description || "No description provided."}
            </p>
          </div>

          {/* Meta */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">Name Changes</p>
              <p className="text-base font-semibold text-gray-900">{ncLabel(account.nameChanges)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">Type</p>
              <p className="text-base font-semibold text-gray-900">{account.type}</p>
            </div>
          </div>

          {/* Pricing + CTA */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">Current Offer</p>
                <p className="text-2xl font-bold text-gray-900">
                  {account.currentOffer > 0 ? `$${account.currentOffer.toFixed(2)}` : "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">Buy It Now</p>
                <p className="text-2xl font-bold text-gray-900">
                  {account.price > 0 ? `$${account.price.toFixed(2)}` : "-"}
                </p>
              </div>
            </div>

            {/* Contact buttons */}
            <div className="flex flex-col gap-2">
              {account.discord && (
                <a href={`https://discord.com/users/${account.discord}`} target="_blank" rel="noopener noreferrer"
                  className="w-full bg-gray-900 hover:bg-gray-700 text-white text-sm font-bold py-3 rounded-xl text-center transition-colors tracking-wide uppercase">
                  Purchase / Bid
                </a>
              )}
              {account.telegram && (
                <a href={`https://t.me/${account.telegram}`} target="_blank" rel="noopener noreferrer"
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold py-2.5 rounded-xl text-center transition-colors">
                  Telegram: @{account.telegram}
                </a>
              )}
              {account.oguser && (
                <a href={account.oguser} target="_blank" rel="noopener noreferrer"
                  className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold py-2.5 rounded-xl text-center transition-colors">
                  OGUser Profile
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
