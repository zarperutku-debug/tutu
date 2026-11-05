import React, { useState } from 'react';
import { X, Minus, Plus, Trash2, CheckCircle2, ShoppingBag } from 'lucide-react';
import { CartItem, calculateWardrobeSummary, formatTRY } from '../utils/stylistEngine';

interface WardrobeDrawerProps {
  isOpen: boolean;
  cartItems: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (itemId: string, size: string, delta: number) => void;
  onRemoveItem: (itemId: string, size: string) => void;
  onClearCart: () => void;
}

export const WardrobeDrawer: React.FC<WardrobeDrawerProps> = ({
  isOpen,
  cartItems,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [orderCompletedId, setOrderCompletedId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const summary = calculateWardrobeSummary(cartItems);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerCity.trim()) {
      setFormError('Lütfen teslimat için ad soyad ve şehir bilgisini girin.');
      return;
    }
    setFormError(null);
    const orderNum = `AV-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderCompletedId(orderNum);
    onClearCart();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/45 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Gardırop Çantası"
    >
      <div className="w-full max-w-md bg-[#FAF8F5] h-full flex flex-col justify-between border-l border-[#E6E0D6] shadow-xl">
        {/* Header */}
        <div className="px-6 py-5 bg-white border-b border-[#E6E0D6] flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#181615]">
              Gardırop Çantası
            </h2>
            <p className="text-xs text-[#6E665E] mt-0.5 font-mono-num">
              {summary.itemCount} seçili parça · Ücretsiz terzi paça boyu ayarı dahil
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setOrderCompletedId(null);
              onClose();
            }}
            aria-label="Gardırop çantasını kapat"
            className="p-2 text-[#575049] hover:text-[#181615] rounded-lg hover:bg-[#F3EFEA] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {orderCompletedId ? (
            <div className="bg-white border border-[#E6E0D6] rounded-xl p-6 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-[#2E5A44] mx-auto" />
              <h3 className="font-display text-2xl font-semibold text-[#181615]">
                Sipariş #{orderCompletedId} Onaylandı
              </h3>
              <p className="text-xs text-[#575049] leading-relaxed">
                Sayın <span className="font-semibold text-[#181615]">{customerName}</span>,
                seçtiğiniz kombin parçaları {customerCity} adresinize özel terzi ölçü notlarıyla
                birlikte hazırlanıyor.
              </p>
              <button
                type="button"
                onClick={() => {
                  setOrderCompletedId(null);
                  onClose();
                }}
                className="mt-2 px-4 py-2 bg-[#181615] text-[#FAF8F5] text-xs font-medium rounded-lg"
              >
                Atölyeye Dön
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="bg-white border border-[#E6E0D6] rounded-xl p-8 text-center space-y-2">
              <ShoppingBag className="w-8 h-8 text-[#8C8277] mx-auto" />
              <p className="font-display text-xl font-semibold text-[#181615]">
                Gardırop Çantanız Boş
              </p>
              <p className="text-xs text-[#6E665E]">
                “Gardırobu Tamamla” bölümünden kombindeki parçaları veya AI stilist revizyonlarını ekleyebilirsiniz.
              </p>
            </div>
          ) : (
            <>
              {cartItems.map((entry) => (
                <div
                  key={`${entry.item.id}-${entry.selectedSize}`}
                  className="bg-white border border-[#E6E0D6] rounded-xl p-4 flex gap-4 items-center"
                >
                  <img
                    src={entry.item.imageUrl}
                    alt={entry.item.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-20 object-cover rounded-lg bg-[#F3EFEA] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-[#6E665E] uppercase tracking-wider truncate">
                      {entry.item.brand}
                    </p>
                    <h4 className="text-sm font-semibold text-[#181615] truncate">
                      {entry.item.name}
                    </h4>
                    <p className="text-xs text-[#575049] mt-0.5">
                      Beden: <span className="font-mono-num">{entry.selectedSize}</span> · {entry.item.colorName}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-semibold font-mono-num text-[#181615]">
                        {formatTRY(entry.item.priceTRY * entry.quantity)}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          aria-label={`${entry.item.name} adet azalt`}
                          onClick={() =>
                            onUpdateQuantity(entry.item.id, entry.selectedSize, -1)
                          }
                          className="p-1 rounded border border-[#E6E0D6] hover:bg-[#F3EFEA]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono-num px-1.5">{entry.quantity}</span>
                        <button
                          type="button"
                          aria-label={`${entry.item.name} adet artır`}
                          onClick={() =>
                            onUpdateQuantity(entry.item.id, entry.selectedSize, 1)
                          }
                          className="p-1 rounded border border-[#E6E0D6] hover:bg-[#F3EFEA]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          aria-label={`${entry.item.name} sepetten çıkar`}
                          onClick={() => onRemoveItem(entry.item.id, entry.selectedSize)}
                          className="p-1 text-[#8C6239] hover:text-[#181615] ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Customer Delivery Form */}
              <form id="wardrobe-checkout-form" onSubmit={handleCheckout} className="bg-white border border-[#E6E0D6] rounded-xl p-4 space-y-3">
                <p className="text-xs font-semibold text-[#181615]">
                  Kişisel Terzi & Teslimat Bilgileri
                </p>
                <div>
                  <label htmlFor="checkout-name" className="block text-[11px] text-[#6E665E] mb-1">
                    Ad Soyad
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Örn: Defne Kaya"
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E6E0D6] rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="checkout-city" className="block text-[11px] text-[#6E665E] mb-1">
                    Şehir / Semt
                  </label>
                  <input
                    id="checkout-city"
                    type="text"
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    placeholder="Örn: Nişantaşı, İstanbul"
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E6E0D6] rounded-md"
                  />
                </div>
                {formError && (
                  <p className="text-xs text-[#9E2A2B] font-medium">{formError}</p>
                )}
              </form>
            </>
          )}
        </div>

        {/* Footer Summary */}
        {cartItems.length > 0 && !orderCompletedId && (
          <div className="p-6 bg-white border-t border-[#E6E0D6] space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#575049]">
                <span>Ara Toplam</span>
                <span className="font-mono-num">{formatTRY(summary.subtotalTRY)}</span>
              </div>
              {summary.qualifiesForBundleDiscount && (
                <div className="flex justify-between text-[#2E5A44] font-medium">
                  <span>Tam Kombin Set İndirimi (%12)</span>
                  <span className="font-mono-num">-{formatTRY(summary.bundleDiscountTRY)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#575049]">
                <span>Özel Kurye & Terzi Teslimatı</span>
                <span className="font-mono-num">
                  {summary.shippingTRY === 0 ? 'Ücretsiz' : formatTRY(summary.shippingTRY)}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#181615] pt-2 border-t border-[#E6E0D6]">
                <span>Toplam</span>
                <span className="font-mono-num">{formatTRY(summary.totalTRY)}</span>
              </div>
            </div>

            <button
              type="submit"
              form="wardrobe-checkout-form"
              className="w-full py-3 px-4 bg-[#181615] text-[#FAF8F5] text-xs font-medium rounded-lg hover:bg-[#2E2A27] transition-colors cursor-pointer"
            >
              Siparişi ve Terzi Ölçüsünü Onayla
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
