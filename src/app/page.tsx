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
  { id: "rakuten", name: "楽天市場", icon: ShoppingBag, color: "bg-red-500" },
  { id: "amazon", name: "Amazon", icon: Store, color: "bg-orange-500" },
  { id: "shopify", name: "Shopify", icon: Globe, color: "bg-green-500" },
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
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#FF7A1A]" />
            <h1 className="text-lg font-bold">AI Product Desc</h1>
          </div>
          <span className="text-xs text-gray-400">by taigi-i.com</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">
            商品画像から説明文を
            <span className="text-[#FF7A1A]">自動生成</span>
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            画像をアップロードするだけ。楽天・Amazon・Shopify向けの
            SEO最適化された商品説明文を数秒で生成します。
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Input */}
          <div className="space-y-6">
            {/* Image Upload */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
                imagePreview
                  ? "border-[#FF7A1A] bg-orange-50/50"
                  : "border-gray-300 hover:border-[#FF7A1A] hover:bg-orange-50/30"
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
                <div className="space-y-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-lg shadow-sm"
                  />
                  <p className="text-sm text-gray-500">
                    クリックで画像を変更
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">
                      商品画像をドロップ
                    </p>
                    <p className="text-sm text-gray-400">
                      またはクリックして選択
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Platform Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                出品プラットフォーム
              </label>
              <div className="grid grid-cols-3 gap-3">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    className={`p-3 rounded-xl border-2 transition-all text-center ${
                      platform === p.id
                        ? "border-[#FF7A1A] bg-orange-50 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <p.icon
                      className={`w-5 h-5 mx-auto mb-1 ${
                        platform === p.id ? "text-[#FF7A1A]" : "text-gray-400"
                      }`}
                    />
                    <span className="text-xs font-medium">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                商品カテゴリ（任意）
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7A1A]/30 focus:border-[#FF7A1A]"
              >
                <option value="">自動判定</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!image || loading}
              className="w-full py-4 rounded-xl bg-[#FF7A1A] text-white font-bold text-lg hover:bg-[#e56b10] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF7A1A]/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  商品説明文を生成
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Right: Output */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-200 min-h-[400px] flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="font-medium text-sm text-gray-700">
                  生成結果
                </h3>
                {result && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-500" />
                        コピー済み
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        コピー
                      </>
                    )}
                  </button>
                )}
              </div>
              <div className="flex-1 p-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm mb-3">
                    {error}
                  </div>
                )}
                {result ? (
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans text-gray-800">
                    {result}
                  </pre>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                    {loading ? (
                      <div className="text-center space-y-3">
                        <Loader2 className="w-8 h-8 mx-auto animate-spin text-[#FF7A1A]" />
                        <p>AIが画像を分析しています...</p>
                      </div>
                    ) : (
                      <div className="text-center space-y-2">
                        <Upload className="w-8 h-8 mx-auto text-gray-300" />
                        <p>画像をアップロードして生成してください</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 py-6 text-center text-xs text-gray-400">
        <p>
          Powered by{" "}
          <a
            href="https://taigi-i.com"
            className="text-[#FF7A1A] hover:underline"
          >
            taigi-i.com
          </a>{" "}
          | AI Product Description Generator
        </p>
      </footer>
    </div>
  );
}
