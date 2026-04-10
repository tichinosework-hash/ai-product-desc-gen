"use client";

import { useState, useCallback } from "react";
import {
  Upload,
  Sparkles,
  Copy,
  Check,
  ShoppingBag,
  Store,
  Globe,
  Loader2,
  ImageIcon,
  ArrowRight,
} from "lucide-react";

const PLATFORMS = [
  { id: "rakuten", name: "楽天市場", icon: ShoppingBag },
  { id: "amazon", name: "Amazon", icon: Store },
  { id: "shopify", name: "Shopify", icon: Globe },
] as const;

const CATEGORIES = [
  "食品・グルメ",
  "ファッション・アパレル",
  "コスメ・美容",
  "家電・ガジェット",
  "インテリア・雑貨",
  "ペット用品",
  "スポーツ・アウトドア",
  "ベビー・キッズ",
  "その他",
];

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [platform, setPlatform] = useState("rakuten");
  const [category, setCategory] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError("");
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
        setError("");
      }
    },
    []
  );

  const handleGenerate = async () => {
    if (!image) return;
    setLoading(true);
    setError("");
    setResult("");

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("platform", platform);
      if (category) formData.append("category", category);

      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.result);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "生成に失敗しました";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#4F46E5] rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-base font-semibold text-[#111827]">
                AI Product Desc
              </h1>
              <p className="text-[11px] text-[#9CA3AF]">
                EC商品説明文ジェネレーター
              </p>
            </div>
          </div>
          <a
            href="https://taigi-i.com"
            className="text-xs text-[#9CA3AF] hover:text-[#4F46E5] transition-colors"
          >
            by taigi-i.com
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        {/* Hero */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#111827] mb-2">
            商品画像から説明文を
            <span className="text-[#4F46E5]">自動生成</span>
          </h2>
          <p className="text-sm text-[#6B7280] max-w-md mx-auto">
            画像をアップロードするだけ。楽天・Amazon・Shopify向けのSEO最適化された商品説明文を数秒で生成。
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Input Card */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <h3 className="text-[11px] font-medium text-[#9CA3AF] uppercase tracking-wider mb-5">
              INPUT
            </h3>

            <div className="space-y-5">
              {/* Image Upload */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  imagePreview
                    ? "border-[#4F46E5] bg-indigo-50/30"
                    : "border-[#E5E7EB] hover:border-[#4F46E5] hover:bg-indigo-50/20"
                }`}
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {imagePreview ? (
                  <div className="space-y-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-40 mx-auto rounded-xl"
                    />
                    <p className="text-xs text-[#9CA3AF]">クリックで変更</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 mx-auto bg-[#F0F2F5] rounded-2xl flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-[#9CA3AF]" strokeWidth={1.5} />
                    </div>
                    <p className="text-sm font-medium text-[#111827]">
                      商品画像をドロップ
                    </p>
                    <p className="text-xs text-[#9CA3AF]">
                      またはクリックして選択
                    </p>
                  </div>
                )}
              </div>

              {/* Platform */}
              <div>
                <label className="block text-xs font-medium text-[#6B7280] mb-2">
                  出品プラットフォーム
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPlatform(p.id)}
                      className={`p-3 rounded-xl border transition-all text-center ${
                        platform === p.id
                          ? "border-[#4F46E5] bg-[#EEF2FF] shadow-sm"
                          : "border-[#E5E7EB] hover:border-[#C7D2FE]"
                      }`}
                    >
                      <p.icon
                        className={`w-4 h-4 mx-auto mb-1 ${
                          platform === p.id
                            ? "text-[#4F46E5]"
                            : "text-[#9CA3AF]"
                        }`}
                        strokeWidth={1.5}
                      />
                      <span
                        className={`text-xs font-medium ${
                          platform === p.id
                            ? "text-[#4F46E5]"
                            : "text-[#6B7280]"
                        }`}
                      >
                        {p.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-[#6B7280] mb-2">
                  商品カテゴリ（任意）
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]"
                >
                  <option value="">自動判定</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Generate */}
              <button
                onClick={handleGenerate}
                disabled={!image || loading}
                className="w-full py-3.5 rounded-xl bg-[#4F46E5] text-white font-semibold text-sm hover:bg-[#4338CA] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-[0_1px_2px_rgba(79,70,229,0.3)]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" strokeWidth={1.5} />
                    商品説明文を生成
                    <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: Output Card */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col min-h-[480px]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F3F4F6]">
              <h3 className="text-[11px] font-medium text-[#9CA3AF] uppercase tracking-wider">
                OUTPUT
              </h3>
              {result && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F0F2F5] hover:bg-[#E5E7EB] text-[#6B7280] transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" strokeWidth={1.5} />
                      コピー済み
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" strokeWidth={1.5} />
                      コピー
                    </>
                  )}
                </button>
              )}
            </div>
            <div className="flex-1 px-6 py-4 overflow-auto">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm mb-3">
                  {error}
                </div>
              )}
              {result ? (
                <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans text-[#111827]">
                  {result}
                </pre>
              ) : (
                <div className="h-full flex items-center justify-center">
                  {loading ? (
                    <div className="text-center space-y-3">
                      <Loader2 className="w-8 h-8 mx-auto animate-spin text-[#4F46E5]" strokeWidth={1.5} />
                      <p className="text-sm text-[#9CA3AF]">
                        AIが画像を分析しています...
                      </p>
                    </div>
                  ) : (
                    <div className="text-center space-y-2">
                      <Upload className="w-8 h-8 mx-auto text-[#D1D5DB]" strokeWidth={1.5} />
                      <p className="text-sm text-[#9CA3AF]">
                        画像をアップロードして生成
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5E7EB] py-5 text-center text-xs text-[#9CA3AF]">
        Powered by{" "}
        <a
          href="https://taigi-i.com"
          className="text-[#4F46E5] hover:underline"
        >
          taigi-i.com
        </a>
      </footer>
    </div>
  );
}
