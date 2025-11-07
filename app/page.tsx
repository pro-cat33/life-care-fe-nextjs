"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuthContext();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/home");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const result = await login(email, password);

    if (!result.success) {
      setError(result.message ?? "ログインに失敗しました。入力内容をご確認ください。");
      return;
    }

    setError(null);
    router.replace("/");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 bg-login">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-xl border border-slate-100 px-6 py-10 backdrop-blur">
        <div className="text-center mb-8">
          <h1 className="text-xl text-slate-800">損益分岐点 &amp; 及び加算効果シミュレータ</h1>
          {/* <p className="mt-2 text-sm text-slate-500">
            損益分岐点 &amp; 加算効果シミュレーターにログインしてください
          </p> */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              メールアドレス
            </label>
            <Input
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              パスワード
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full h-12 rounded-xl text-base text-white font-semibold bg-main hover:opacity-90"
            disabled={isLoading}
          >
            {isLoading ? "ログイン中..." : "ログイン"}
          </Button>
        </form>

        {/* <p className="mt-8 text-center text-sm text-slate-500">
          アカウントをお持ちでない場合は{" "}
          <Link
            href="/register"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            新規登録
          </Link>
        </p> */}
      </div>
    </div>
  );
}

