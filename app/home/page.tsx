"use client";
import Link from "next/link";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <Header />
      <main className="w-full bg-gray-100 main-height py-8 md:py-16 px-4 md:px-8 flex items-center justify-center">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-12 text-center">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
              損益分岐点&加算効果シミュレータ
            </h1>
            <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8">
              生活介護サービス費検索システム
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-8 md:mt-12">
              <Link href="/init">
                <div className="p-6 md:p-8 bg-main rounded-lg hover:bg-blue-100 transition-colors border border-main">
                  <h2 className="text-lg md:text-xl font-semibold text-white mb-2 md:mb-3">基本設定</h2>
                  <p className="text-xs md:text-sm text-white">基本報酬と加算の入力・計算</p>
                </div>
              </Link>
              
              <Link href="/calculate">
                <div className="p-6 md:p-8 bg-main rounded-lg hover:bg-blue-100 transition-colors border border-main">
                  <h2 className="text-lg md:text-xl font-semibold text-white mb-2 md:mb-3">損益分岐点と加算効果</h2>
                  <p className="text-xs md:text-sm text-white">損益分岐点と加算効果のシミュレーション</p>
                </div>
              </Link>
              
              <Link href="/comparison">
                <div className="p-6 md:p-8 bg-main rounded-lg hover:bg-blue-100 transition-colors border border-main">
                  <h2 className="text-lg md:text-xl font-semibold text-white mb-2 md:mb-3">比較（入力→自動計算）</h2>
                  <p className="text-xs md:text-sm text-white">昨年度・今年度・目標の比較分析</p>
                </div>
              </Link>
              
              <Link href="/service">
                <div className="p-6 md:p-8 bg-main rounded-lg hover:bg-blue-100 transition-colors border border-main">
                  <h2 className="text-lg md:text-xl font-semibold text-white mb-2 md:mb-3">厚生労働省</h2>
                  <p className="text-xs md:text-sm text-white">サービスコード表検索</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
