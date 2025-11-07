"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthContext";

const Header = () => {
  const pathname = usePathname();
  const { isAuthenticated, logout, isLoading } = useAuthContext();

  const navItems = [
    {href: "/home", label: "ホームページ"},
    { href: "/init", label: "基本設定" },
    { href: "/calculate", label: "損益分岐点と加算効果" },
    { href: "/comparison", label: "比較（入力→自動計算）" },
    { href: "/service", label: "厚生労働省" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="flex flex-col md:flex-row md:items-center bg-white shadow-sm border-b">
      <div className="p-2 md:p-4">
        <Link href="/home" className="flex items-center gap-2 md:gap-4 hover:opacity-80 transition-opacity">
          <Image
            src="/logo.png"
            alt="Logo"
            width={160}
            height={80}
            className="object-contain w-32 md:w-40"
            priority
          />
        </Link>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-3 px-3 md:px-6 pb-3 md:pb-0">
        <nav className="w-full md:flex-1 flex items-end bg-white justify-center overflow-x-auto">
          <div className="flex gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 md:px-4 py-2 md:py-4 text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive(item.href)
                    ? "color-main border-b-2 border-main bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
        {/* {isAuthenticated && (
          <Button
            variant="outline"
            className="w-full md:w-auto h-10 md:h-11 text-sm md:text-base bg-main text-white hover:opacity-90 transition-opacity"
            onClick={logout}
            disabled={isLoading}
          >
            ログアウト
          </Button>
        )} */}
      </div>
    </header>
  );
};

export default Header;