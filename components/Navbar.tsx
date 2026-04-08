import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-white/[0.06] bg-[#080808]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/browse" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect x="0" y="0" width="7" height="7" fill="#000" opacity="0.8"/>
              <rect x="9" y="0" width="7" height="7" fill="#000" opacity="0.8"/>
              <rect x="0" y="9" width="7" height="7" fill="#000" opacity="0.8"/>
              <rect x="9" y="9" width="7" height="7" fill="#000" opacity="0.8"/>
            </svg>
          </div>
          <span className="font-bold text-white text-base tracking-tight">
            mc<span className="text-green-400">market</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/browse" className="text-sm text-gray-400 hover:text-white transition-colors">
            Browse
          </Link>
          <Link
            href="/list-account"
            className="text-sm bg-green-500 hover:bg-green-400 text-black font-semibold px-4 py-1.5 rounded-lg transition-all duration-200 hover:shadow-[0_0_15px_rgba(74,222,128,0.3)]"
          >
            + List Account
          </Link>
        </div>
      </div>
    </nav>
  );
}
