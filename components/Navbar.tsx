import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-[#1f1f1f] bg-[#0a0a0a] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/browse" className="text-white font-bold text-lg tracking-tight">
          mc<span className="text-green-400">market</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/browse"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Browse
          </Link>
          <Link
            href="/list-account"
            className="text-sm bg-green-500 hover:bg-green-400 text-black font-semibold px-4 py-1.5 rounded-md transition-colors"
          >
            + List Account
          </Link>
        </div>
      </div>
    </nav>
  );
}
