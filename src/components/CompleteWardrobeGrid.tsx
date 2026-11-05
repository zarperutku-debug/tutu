import React, { useState } from 'react';
import { ShoppingBag, Check, Plus, Sparkles } from 'lucide-react';
import { WardrobeItem, formatTRY } from '../utils/stylistEngine';

interface CompleteWardrobeGridProps {
  styleName: string;
  items: WardrobeItem[];
  onAddToCart: (item: WardrobeItem, selectedSize: string) => void;
  onAddEntireLook: (items: WardrobeItem[]) => void;
}

const CATEGORIES = ['Tümü', 'Üst Giyim', 'Alt Giyim', 'Dış Giyim', 'Ayakkabı', 'Aksesuar'] as const;

export const CompleteWardrobeGrid: React.FC<CompleteWardrobeGridProps> = ({
  styleName,
  items,
  onAddToCart,
  onAddEntireLook,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const filteredItems =
    selectedCategory === 'Tümü'
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const totalLookPrice = items.reduce((sum, item) => sum + item.priceTRY, 0);
  const bundlePrice = Math.round(totalLookPrice * 0.88);

  const getSelectedSize = (item: WardrobeItem) => {
    return selectedSizes[item.id] ?? item.sizes[1] ?? item.sizes[0] ?? 'Standart';
  };

  const handleAddSingle = (item: WardrobeItem) => {
    const size = getSelectedSize(item);
    onAddToCart(item, size);
    setRecentlyAddedId(item.id);
    setTimeout(() => {
      setRecentlyAddedId((prev) => (prev === item.id ? null : prev));
    }, 1400);
  };

  return (
    <section
      id="gardirobu-tamamla"
      aria-label="Gardırobu Tamamla Alışveriş Kartları"
      className="pt-8 border-t border-[#E6E0D6]"
    >
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#6E665E]">
            <span>Küratörlü Parça Eşleşmesi</span>
            <span aria-hidden="true">·</span>
            <span>{styleName} Koleksiyonu</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-num">{items.length} Anahtar Parça</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#181615] mt-1">
            Gardırobu Tamamla
          </h2>
          <p className="text-sm text-[#575049] mt-1.5 max-w-2xl">
            Yeni kombininizde yer alan parçaların ve AI stilist revizyonlarınızın birebir muadilleri.
            3 veya daha fazla parça seçtiğinizde %12 tam kombin indirimi otomatik uygulanır.
          </p>
        </div>

        {/* Complete Set Bundle Action */}
        <div className="flex flex-wrap items-center gap-4 bg-white border border-[#E6E0D6] rounded-xl p-4 shrink-0">
          <div>
            <p className="text-xs text-[#6E665E]">Tam Kombin Set Fiyatı (%12 Avantajlı)</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-lg font-semibold font-mono-num text-[#181615]">
                {formatTRY(bundlePrice)}
              </span>
              <span className="text-xs font-mono-num text-[#8C8277] line-through">
                {formatTRY(totalLookPrice)}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onAddEntireLook(items)}
            className="px-4 py-2.5 bg-[#181615] text-[#FAF8F5] text-xs font-medium rounded-lg hover:bg-[#2E2A27] transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Tüm Kombini Ekle ({items.length} Parça)</span>
          </button>
        </div>
      </div>

      {/* Interactive Category Segmented Filter Bar */}
      <div className="flex items-center gap-1 p-1 bg-[#F3EFEA] rounded-lg w-fit max-w-full overflow-x-auto mb-6">
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-white text-[#181615] shadow-xs'
                  : 'text-[#575049] hover:text-[#181615]'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => {
          const activeSize = getSelectedSize(item);
          const isAdded = recentlyAddedId === item.id;

          return (
            <article
              key={item.id}
              data-testid={`wardrobe-card-${item.id}`}
              className="group bg-white border border-[#E6E0D6] rounded-xl overflow-hidden flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5"
            >
              <div>
                {/* Visual Preview Area */}
                <div className="relative aspect-[4/3] bg-[#F3EFEA] overflow-hidden border-b border-[#E6E0D6]">
                  <img
                    src={item.imageUrl}
                    alt={`${item.brand} ${item.name}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-300"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white">
                    <span>{item.category}</span>
                    <span className="font-mono-num">%{item.matchScore} Stil Uyumu</span>
                  </div>
                </div>

                {/* Card Copy — Strictly unboxed metadata with middle-dot separators */}
                <div className="p-4">
                  {item.isRevisionHighlight && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-[#8C6239] mb-1">
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span>AI Stilist Revizyonu · {item.revisionReason}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-xs text-[#6E665E]">
                    <span className="uppercase tracking-wider">{item.brand}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.colorName}</span>
                  </div>

                  <h3 className="text-base font-semibold text-[#181615] mt-1 leading-snug">
                    {item.name}
                  </h3>

                  <p className="text-xs text-[#575049] mt-1.5">
                    {item.material} · {item.fitNote}
                  </p>

                  {/* Price */}
                  <p className="text-base font-semibold font-mono-num text-[#181615] mt-3">
                    {formatTRY(item.priceTRY)}
                  </p>
                </div>
              </div>

              {/* Interactive Size Selection & Add to Wardrobe CTA */}
              <div className="px-4 pb-4 pt-2 border-t border-[#F3EFEA] space-y-3">
                <div>
                  <span className="block text-[11px] text-[#6E665E] mb-1.5">
                    Beden / Ölçü Seçimi:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.sizes.map((size) => {
                      const isSelected = activeSize === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() =>
                            setSelectedSizes((prev) => ({ ...prev, [item.id]: size }))
                          }
                          aria-label={`${item.name} beden ${size}`}
                          className={`px-2.5 py-1 text-xs font-mono-num rounded border transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#181615] text-[#FAF8F5] border-[#181615]'
                              : 'bg-[#FAF8F5] text-[#575049] border-[#E6E0D6] hover:border-[#181615]'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAddSingle(item)}
                  className={`w-full py-2.5 px-4 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isAdded
                      ? 'bg-[#2E5A44] text-white'
                      : 'bg-[#181615] text-[#FAF8F5] hover:bg-[#2E2A27]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Gardırop Çantasına Eklendi ({activeSize})</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Gardıroba Ekle · {activeSize}</span>
                    </>
                  )}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
