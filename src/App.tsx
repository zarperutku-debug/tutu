/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Upload, Camera, Sparkles, Check, Layers } from 'lucide-react';
import {
  STYLE_PRESETS,
  SAMPLE_MODELS,
  ORIGINAL_OUTFIT_IMAGE,
  StyleId,
  WardrobeItem,
  RevisionEffect,
  CartItem,
  mergeWardrobeWithRevisions,
} from './utils/stylistEngine';
import { CompareSlider } from './components/CompareSlider';
import { StylistChatPanel, ChatMessage } from './components/StylistChatPanel';
import { CompleteWardrobeGrid } from './components/CompleteWardrobeGrid';
import { WardrobeDrawer } from './components/WardrobeDrawer';

const STYLE_ORDER: StyleId[] = [
  'old-money',
  'smart-casual',
  'streetwear',
  'minimalist',
  'avant-garde',
];

export default function App() {
  const [beforeImageUrl, setBeforeImageUrl] = useState<string>(ORIGINAL_OUTFIT_IMAGE);
  const [selectedSampleId, setSelectedSampleId] = useState<string>(SAMPLE_MODELS[0].id);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const [activeStyleId, setActiveStyleId] = useState<StyleId>('old-money');
  const [customAfterImageUrl, setCustomAfterImageUrl] = useState<string | null>(null);
  const [isRestyling, setIsRestyling] = useState<boolean>(false);

  const [appliedRevisions, setAppliedRevisions] = useState<RevisionEffect[]>([]);
  const [isChatSending, setIsChatSending] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content:
        'Atelier Véra Kişisel Stil Atölyesine hoş geldiniz. Boydan fotoğrafınızı şu an "Old Money" (Sessiz Lüks) estetiğiyle yeniden kurguladım. Yukarıdaki Öncesi/Sonrası kaydırıcısıyla dönüşümü inceleyebilir veya bana "Pantolonun paçasını daralt, ayakkabıyı beyaz sneaker yap" gibi anlık terzilik revizyonları verebilirsiniz.',
      timestamp: '14:00',
    },
  ]);

  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      item: STYLE_PRESETS['old-money'].wardrobeItems[0],
      selectedSize: 'M',
      quantity: 1,
    },
  ]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activePreset = STYLE_PRESETS[activeStyleId];
  const latestRevision =
    appliedRevisions.length > 0 ? appliedRevisions[appliedRevisions.length - 1] : null;

  const displayedAfterImageUrl =
    customAfterImageUrl ??
    latestRevision?.visualAdjustments.overrideAfterImageUrl ??
    activePreset.afterImageUrl;

  const displayedCssFilter =
    latestRevision?.visualAdjustments.cssFilter ?? activePreset.cssFilter;

  const displayedHotspots = latestRevision
    ? latestRevision.updatedHotspots
    : activePreset.hotspots;

  const allInjectedItems = appliedRevisions.flatMap((r) => r.injectedWardrobeItems);
  const displayedWardrobeItems = mergeWardrobeWithRevisions(
    activePreset.wardrobeItems,
    allInjectedItems
  );

  const totalCartCount = cartItems.reduce((sum, entry) => sum + entry.quantity, 0);

  // Trigger image restyle via backend /api/restyle-image (gemini-nano-banana-2.1 + studio engine fallback)
  const handleSelectStyle = async (styleId: StyleId) => {
    if (styleId === activeStyleId && !customAfterImageUrl && appliedRevisions.length === 0) {
      return;
    }
    setActiveStyleId(styleId);
    setAppliedRevisions([]);
    setCustomAfterImageUrl(null);
    setIsRestyling(true);

    const nextPreset = STYLE_PRESETS[styleId];

    try {
      const response = await fetch('/api/restyle-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageSource: beforeImageUrl,
          styleId,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.afterImageUrl) {
          setCustomAfterImageUrl(data.afterImageUrl);
        }
      }
    } catch {
      // Keep preset high-res studio image on network error
    } finally {
      setIsRestyling(false);
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `style-switch-${Date.now()}`,
        role: 'assistant',
        content: `Stil rotanızı **${nextPreset.name}** (${nextPreset.subtitle}) olarak güncelledim. ${nextPreset.silhouetteNote} Aşağıdaki "Gardırobu Tamamla" kartları da bu yeni kombinin parçalarıyla yenilendi.`,
        timestamp: new Date().toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);
  };

  // Handle user uploading their own full-body outfit photo
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : null;
      if (!dataUrl) return;
      setBeforeImageUrl(dataUrl);
      setUploadedFileName(file.name);
      setSelectedSampleId('custom-upload');
      setIsRestyling(true);

      try {
        const response = await fetch('/api/restyle-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageSource: dataUrl,
            styleId: activeStyleId,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          if (data.afterImageUrl) {
            setCustomAfterImageUrl(data.afterImageUrl);
          }
        }
      } catch {
        // Fallback handled seamlessly
      } finally {
        setIsRestyling(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle selecting one of the studio full-body base models
  const handleSelectSampleModel = (sampleId: string) => {
    const found = SAMPLE_MODELS.find((m) => m.id === sampleId);
    if (!found) return;
    setSelectedSampleId(found.id);
    setUploadedFileName(null);
    setBeforeImageUrl(found.imageUrl);
    setCustomAfterImageUrl(null);
  };

  // Multi-turn AI Stylist revision handler
  const handleSendStylistMessage = async (messageText: string) => {
    const timestamp = new Date().toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp,
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setIsChatSending(true);
    setIsRestyling(true);

    try {
      // Request both stylist chat analysis and image revision in parallel
      const [chatRes, imgRes] = await Promise.all([
        fetch('/api/stylist-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: updatedHistory.map((m) => ({ role: m.role, content: m.content })),
            latestMessage: messageText,
            currentStyleId: activeStyleId,
            imageSource: beforeImageUrl,
          }),
        }),
        fetch('/api/restyle-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageSource: beforeImageUrl,
            styleId: activeStyleId,
            customRevisionPrompt: messageText,
          }),
        }),
      ]);

      if (imgRes.ok) {
        const imgData = await imgRes.json();
        if (imgData.afterImageUrl) {
          setCustomAfterImageUrl(imgData.afterImageUrl);
        }
      }

      if (chatRes.ok) {
        const chatData = await chatRes.json();
        const revEffect: RevisionEffect | undefined = chatData.revisionEffect;
        if (revEffect) {
          setAppliedRevisions((prev) => [...prev, revEffect]);
        }

        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: chatData.reply,
          timestamp: new Date().toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          appliedRevision: revEffect,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch {
      // Offline / unexpected fallback
    } finally {
      setIsChatSending(false);
      setIsRestyling(false);
    }
  };

  const handleResetRevisions = () => {
    setAppliedRevisions([]);
    setCustomAfterImageUrl(null);
  };

  const handleAddToCart = (item: WardrobeItem, selectedSize: string) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (entry) => entry.item.id === item.id && entry.selectedSize === selectedSize
      );
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex] = {
          ...copy[existingIndex],
          quantity: copy[existingIndex].quantity + 1,
        };
        return copy;
      }
      return [...prev, { item, selectedSize, quantity: 1 }];
    });
  };

  const handleAddEntireLook = (items: WardrobeItem[]) => {
    items.forEach((item) => {
      const defaultSize = item.sizes[1] ?? item.sizes[0] ?? 'Standart';
      handleAddToCart(item, defaultSize);
    });
    setIsDrawerOpen(true);
  };

  const handleUpdateCartQuantity = (itemId: string, size: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((entry) =>
          entry.item.id === itemId && entry.selectedSize === size
            ? { ...entry, quantity: entry.quantity + delta }
            : entry
        )
        .filter((entry) => entry.quantity > 0)
    );
  };

  const handleRemoveCartItem = (itemId: string, size: string) => {
    setCartItems((prev) =>
      prev.filter((entry) => !(entry.item.id === itemId && entry.selectedSize === size))
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#181615]">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-xs border-b border-[#E6E0D6]">
        <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-8 px-6 py-4">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#kombin-atolyesi"
            className="font-display text-2xl font-bold tracking-tight text-[#181615] whitespace-nowrap shrink-0"
          >
            ATELIER VÉRA
          </a>

          {/* Zone 2: 4 single-line navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#575049]">
            <a
              href="#kombin-atolyesi"
              className="hover:text-[#181615] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Kombin Atölyesi
            </a>
            <a
              href="#stil-menusu"
              className="hover:text-[#181615] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Stil Menüsü
            </a>
            <a
              href="#ai-stylist"
              className="hover:text-[#181615] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              AI Stilist
            </a>
            <a
              href="#gardirobu-tamamla"
              className="hover:text-[#181615] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Gardırobu Tamamla
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action Button */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="px-4 py-2 text-xs font-medium text-[#FAF8F5] bg-[#181615] rounded-lg hover:bg-[#2E2A27] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Gardırop Çantası ({totalCartCount})
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container (1360px max width for 1440px desktop baseline) */}
      <main className="flex-1 max-w-[1360px] w-full mx-auto px-6 py-8 space-y-12">
        {/* Section 1: Studio Hero & Interactive Before/After Restyling Workspace */}
        <section id="kombin-atolyesi" className="space-y-6">
          {/* Editorial Intro Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#E6E0D6] pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#6E665E]">
                <span>Kişisel Silüet & Terzilik Atölyesi</span>
                <span aria-hidden="true">·</span>
                <span>Boydan Kombin Dönüşümü</span>
              </div>
              <h1
                style={{ textWrap: 'balance' }}
                className="font-display text-4xl sm:text-5xl font-semibold text-[#181615] mt-1 tracking-tight"
              >
                Kişisel Kombininizi Yapay Zeka İle Yeniden Tasarlayın
              </h1>
            </div>

            <p className="text-sm text-[#575049] max-w-md leading-relaxed">
              Boydan kıyafet fotoğrafınızı yükleyin veya stüdyo modellerimizden birini seçin;
              farklı moda akımlarını Öncesi/Sonrası kaydırıcısıyla anında karşılaştırın.
            </p>
          </div>

          {/* 12-Column Split Studio: Left 7 Cols (Before/After Slider + Style Menu below), Right 5 Cols (Upload & AI Stylist Chat) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (7 cols): Photo Compare Slider + Style Menu directly underneath */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white border border-[#E6E0D6] rounded-xl p-5">
                <CompareSlider
                  beforeImageUrl={beforeImageUrl}
                  afterImageUrl={displayedAfterImageUrl}
                  styleName={activePreset.name}
                  styleSubtitle={activePreset.subtitle}
                  cssFilter={displayedCssFilter}
                  hotspots={displayedHotspots}
                  isLoading={isRestyling}
                  activeRevisionSummary={latestRevision ? latestRevision.summaryTitle : null}
                />
              </div>

              {/* Style Menu directly under the photo as requested */}
              <div
                id="stil-menusu"
                className="bg-white border border-[#E6E0D6] rounded-xl p-5 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#6E665E]">
                      <Layers className="w-3.5 h-3.5 text-[#8C6239]" />
                      <span>Stil Menüsü · Fotoğrafı Seçilen Estetiğe Göre Yenile</span>
                    </div>
                    <h2 className="font-display text-2xl font-semibold text-[#181615] mt-0.5">
                      Dönüştürülecek Tarzı Seçin
                    </h2>
                  </div>

                  {/* Active Color Palette Swatches */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#6E665E]">Renk Paleti:</span>
                    <div className="flex items-center gap-1.5">
                      {activePreset.colorPalette.map((swatch) => (
                        <div
                          key={swatch.name}
                          className="flex items-center gap-1 text-xs text-[#575049]"
                          title={swatch.name}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/15 inline-block"
                            style={{ backgroundColor: swatch.hex }}
                          />
                          <span className="hidden sm:inline">{swatch.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Style Selector Buttons */}
                <div
                  role="tablist"
                  aria-label="Kombin Stil Menüsü"
                  className="grid grid-cols-2 sm:grid-cols-5 gap-2.5"
                >
                  {STYLE_ORDER.map((styleId) => {
                    const preset = STYLE_PRESETS[styleId];
                    const isSelected = activeStyleId === styleId;
                    return (
                      <button
                        key={styleId}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        onClick={() => handleSelectStyle(styleId)}
                        className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#181615] text-[#FAF8F5] border-[#181615] shadow-xs'
                            : 'bg-[#FAF8F5] text-[#181615] border-[#E6E0D6] hover:border-[#181615]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-semibold whitespace-nowrap truncate">
                            {preset.name}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#D8C8B4] shrink-0" />}
                        </div>
                        <span
                          className={`text-[11px] mt-1 line-clamp-1 ${
                            isSelected ? 'text-[#D8C8B4]' : 'text-[#6E665E]'
                          }`}
                        >
                          {preset.subtitle}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Active Style Editorial Note */}
                <div className="pt-3 border-t border-[#E6E0D6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#575049]">
                  <p>
                    <span className="font-semibold text-[#181615]">{activePreset.name} Notu: </span>
                    {activePreset.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Full-Body Photo Uploader + Context-Aware AI Stylist Chat */}
            <div className="lg:col-span-5 space-y-6">
              {/* Full-Body Photo Upload & Base Outfit Picker Card */}
              <div className="bg-white border border-[#E6E0D6] rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#6E665E]">
                      <Camera className="w-3.5 h-3.5 text-[#8C6239]" />
                      <span>Adım 1 · Kaynak Görsel</span>
                    </div>
                    <h2 className="font-display text-2xl font-semibold text-[#181615] mt-0.5">
                      Boydan Kıyafet Fotoğrafınız
                    </h2>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="fullbody-photo-upload"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 bg-[#181615] text-[#FAF8F5] text-xs font-medium rounded-lg hover:bg-[#2E2A27] transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Fotoğraf Yükle</span>
                  </button>
                </div>

                {uploadedFileName && (
                  <div className="px-3 py-2 rounded-md bg-[#FAF8F5] border border-[#E6E0D6] text-xs text-[#181615] flex items-center justify-between">
                    <span className="truncate">Yüklenen Fotoğraf: {uploadedFileName}</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#8C6239] shrink-0" />
                  </div>
                )}

                {/* Preset Base Outfit Selector for Instant Testing */}
                <div>
                  <p className="text-xs text-[#6E665E] mb-2">
                    Veya örnek boydan fotoğraflardan birini seçin:
                  </p>
                  <div className="grid grid-cols-3 gap-2.5">
                    {SAMPLE_MODELS.map((sample) => {
                      const isCurrent = selectedSampleId === sample.id;
                      return (
                        <button
                          key={sample.id}
                          type="button"
                          onClick={() => handleSelectSampleModel(sample.id)}
                          className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                            isCurrent
                              ? 'border-[#181615] bg-[#FAF8F5]'
                              : 'border-[#E6E0D6] hover:border-[#8C8277]'
                          }`}
                        >
                          <div className="aspect-[3/4] rounded overflow-hidden bg-[#F3EFEA] mb-1.5">
                            <img
                              src={sample.imageUrl}
                              alt={sample.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover object-top"
                            />
                          </div>
                          <p className="text-[11px] font-medium text-[#181615] line-clamp-1">
                            {sample.name}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Context-Aware AI Stylist Multi-Turn Chat */}
              <StylistChatPanel
                activeStyle={activePreset}
                messages={messages}
                appliedRevisions={appliedRevisions}
                isSending={isChatSending}
                onSendMessage={handleSendStylistMessage}
                onResetRevisions={handleResetRevisions}
              />
            </div>
          </div>
        </section>

        {/* Section 2: Complete the Wardrobe ("Gardırobu Tamamla") Shopping Cards */}
        <CompleteWardrobeGrid
          styleName={activePreset.name}
          items={displayedWardrobeItems}
          onAddToCart={handleAddToCart}
          onAddEntireLook={handleAddEntireLook}
        />
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-[#E6E0D6] bg-white mt-16">
        <div className="max-w-[1360px] mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6E665E]">
          <p className="font-display text-base font-semibold text-[#181615]">
            ATELIER VÉRA — Kişisel AI Stil ve Terzilik Atölyesi
          </p>
          <p>
            Öncesi/Sonrası Silüet Karşılaştırması · Bağlama Duyarlı AI Stilist · Gardırobu Tamamla
          </p>
        </div>
      </footer>

      {/* Slide-Over Wardrobe Cart Drawer */}
      <WardrobeDrawer
        isOpen={isDrawerOpen}
        cartItems={cartItems}
        onClose={() => setIsDrawerOpen(false)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCartItems([])}
      />
    </div>
  );
}
