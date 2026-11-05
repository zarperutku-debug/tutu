import React, { useState, useRef } from 'react';
import { MoveHorizontal, Sparkles, Check, Eye, EyeOff } from 'lucide-react';
import { GarmentHotspot, clampSliderPosition } from '../utils/stylistEngine';

interface CompareSliderProps {
  beforeImageUrl: string;
  afterImageUrl: string;
  styleName: string;
  styleSubtitle: string;
  cssFilter?: string;
  hotspots: GarmentHotspot[];
  isLoading: boolean;
  activeRevisionSummary: string | null;
  onHotspotClick?: (hotspot: GarmentHotspot) => void;
}

export const CompareSlider: React.FC<CompareSliderProps> = ({
  beforeImageUrl,
  afterImageUrl,
  styleName,
  styleSubtitle,
  cssFilter,
  hotspots,
  isLoading,
  activeRevisionSummary,
  onHotspotClick,
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [beforeImgError, setBeforeImgError] = useState(false);
  const [afterImgError, setAfterImgError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);

  const updateSliderFromClientX = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width <= 0) return;
    const percentage = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(clampSliderPosition(percentage));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Do not hijack clicks on hotspot buttons
    if ((e.target as HTMLElement).closest('button[data-hotspot="true"]')) {
      return;
    }
    isDraggingRef.current = true;
    updateSliderFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    updateSliderFromClientX(e.clientX);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Top control bar above the comparison canvas */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1 border-b border-[#E6E0D6]">
        <div className="flex items-center gap-2 text-xs text-[#6E665E]">
          <span className="font-medium text-[#181615]">Öncesi / Sonrası Karşılaştırma</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-num">%{sliderPos} Orijinal / %{100 - sliderPos} {styleName}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#F3EFEA] p-1 rounded-md">
            <button
              type="button"
              onClick={() => setSliderPos(5)}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                sliderPos <= 10
                  ? 'bg-[#181615] text-[#FAF8F5]'
                  : 'text-[#575049] hover:text-[#181615]'
              }`}
            >
              Tam Yeni Kombin
            </button>
            <button
              type="button"
              onClick={() => setSliderPos(50)}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                sliderPos > 10 && sliderPos < 90
                  ? 'bg-[#181615] text-[#FAF8F5]'
                  : 'text-[#575049] hover:text-[#181615]'
              }`}
            >
              50/50 Karşılaştır
            </button>
            <button
              type="button"
              onClick={() => setSliderPos(95)}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                sliderPos >= 90
                  ? 'bg-[#181615] text-[#FAF8F5]'
                  : 'text-[#575049] hover:text-[#181615]'
              }`}
            >
              Orijinal Fotoğraf
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowHotspots((prev) => !prev)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#181615] bg-white border border-[#E6E0D6] rounded-md hover:bg-[#F3EFEA] transition-colors whitespace-nowrap shrink-0"
            aria-label={showHotspots ? 'Terzi noktalarını gizle' : 'Terzi noktalarını göster'}
          >
            {showHotspots ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showHotspots ? 'Detay Noktalarını Gizle' : 'Detay Noktalarını Göster'}</span>
          </button>
        </div>
      </div>

      {/* Main Before/After Viewport (3:4 Editorial Full-Body Frame) */}
      <div
        ref={containerRef}
        data-testid="compare-slider-viewport"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative w-full aspect-[3/4] max-h-[680px] bg-[#EAE4DC] rounded-xl overflow-hidden select-none cursor-ew-resize border border-[#E6E0D6]"
      >
        {/* Base Layer: AFTER (Restyled AI Look) */}
        <div className="absolute inset-0 w-full h-full">
          {!afterImgError ? (
            <img
              src={afterImageUrl}
              alt={`Yeni ${styleName} kombin tasarımı`}
              referrerPolicy="no-referrer"
              onError={() => setAfterImgError(true)}
              style={{ filter: cssFilter || undefined }}
              className="w-full h-full object-cover object-top transition-all duration-300"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#EAE4DC] to-[#D8CFC2] p-8 text-center">
              <Sparkles className="w-8 h-8 text-[#8C6239] mb-2" />
              <p className="font-display text-2xl font-semibold text-[#181615]">{styleName} Kombin Görünümü</p>
              <p className="text-xs text-[#575049] mt-1">{styleSubtitle}</p>
            </div>
          )}

          {/* Scrim for legible bottom labels */}
          <div className="
            absolute inset-x-0 bottom-0 h-28
            bg-gradient-to-t from-black/75 via-black/35 to-transparent
            pointer-events-none
          " />
        </div>

        {/* Clipped Overlay Layer: BEFORE (Original User Outfit) */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          {!beforeImgError ? (
            <img
              src={beforeImageUrl}
              alt="Orijinal boydan kıyafet fotoğrafı"
              referrerPolicy="no-referrer"
              onError={() => setBeforeImgError(true)}
              className="w-full h-full object-cover object-top"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#E5DFD5] p-8 text-center">
              <p className="font-display text-xl font-semibold text-[#181615]">Orijinal Fotoğraf</p>
            </div>
          )}
          <div className="
            absolute inset-x-0 bottom-0 h-28
            bg-gradient-to-t from-black/75 via-black/35 to-transparent
            pointer-events-none
          " />
        </div>

        {/* Corner Editorial Labels (Clean unboxed typography on dark scrim) */}
        <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
          <p className="text-[11px] tracking-wider text-white/75">ÖNCESİ</p>
          <p className="text-sm font-medium text-white">Orijinal Kombin</p>
        </div>

        <div className="absolute bottom-4 right-4 z-10 text-right pointer-events-none">
          <p className="text-[11px] tracking-wider text-white/80">SONRASI · {styleName.toUpperCase()}</p>
          <p className="text-sm font-medium text-white">
            {activeRevisionSummary ? activeRevisionSummary : styleSubtitle}
          </p>
        </div>

        {/* Interactive Garment Hotspots on the AFTER side */}
        {showHotspots &&
          hotspots.map((hs) => {
            const effectiveX = Math.max(hs.xPercent, 64);
            const isVisibleOnAfterSide = effectiveX > sliderPos + 8;
            if (!isVisibleOnAfterSide) return null;
            const isExpanded = activeHotspotId === hs.id;

            return (
              <div
                key={hs.id}
                style={{ left: `${effectiveX}%`, top: `${hs.yPercent}%` }}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
              >
                <button
                  type="button"
                  data-hotspot="true"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveHotspotId(isExpanded ? null : hs.id);
                    onHotspotClick?.(hs);
                  }}
                  aria-label={`Parça detayı: ${hs.label}`}
                  className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-transform duration-150 shadow-sm whitespace-nowrap ${
                    hs.isRevised
                      ? 'bg-[#8C6239] text-white ring-2 ring-white/90'
                      : 'bg-[#181615]/90 text-white hover:bg-[#181615] ring-1 ring-white/60'
                  }`}
                >
                  {hs.isRevised && <Check className="w-3 h-3 shrink-0" />}
                  <span>{hs.label}</span>
                </button>

                {isExpanded && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="mt-1.5 w-56 p-2.5 rounded-lg bg-[#181615]/95 text-[#FAF8F5] text-xs shadow-md border border-white/15"
                  >
                    <p className="font-semibold text-white">{hs.label}</p>
                    <p className="text-white/80 mt-0.5 leading-relaxed">{hs.detail}</p>
                  </div>
                )}
              </div>
            );
          })}

        {/* Vertical Divider Line & Drag Handle */}
        <div
          style={{ left: `${sliderPos}%` }}
          className="absolute inset-y-0 z-20 w-0.5 bg-white/90 shadow-[0_0_12px_rgba(0,0,0,0.45)] pointer-events-none"
        >
          <div className="
            absolute top-1/2 -translate-x-1/2 -translate-y-1/2
            w-10 h-10 rounded-full bg-[#181615] text-[#FAF8F5]
            border-2 border-white shadow-md
            flex items-center justify-center
          ">
            <MoveHorizontal className="w-4 h-4" />
          </div>
        </div>

        {/* Loading Overlay during Gemini Image Restyling */}
        {isLoading && (
          <div className="absolute inset-0 z-30 bg-[#181615]/65 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin mb-3" />
            <p className="font-display text-2xl font-semibold">
              {styleName} Silüeti İşleniyor...
            </p>
            <p className="text-xs text-white/80 mt-1 max-w-xs">
              Kumaş dokuları, paça boyu ve renk dengesi boydan fotoğrafınıza uyarlanıyor.
            </p>
          </div>
        )}
      </div>

      {/* Accessible Range Input for Keyboard & Fine-Grained Control */}
      <div className="flex items-center gap-3 pt-1">
        <label
          htmlFor="before-after-range"
          className="text-xs font-medium text-[#575049] whitespace-nowrap shrink-0"
        >
          Kaydırıcı Konumu
        </label>
        <input
          id="before-after-range"
          type="range"
          min={5}
          max={95}
          value={sliderPos}
          aria-label="Öncesi ve Sonrası Karşılaştırma Kaydırıcısı"
          onChange={(e) => setSliderPos(clampSliderPosition(Number(e.target.value)))}
          className="w-full h-1.5 bg-[#E6E0D6] rounded-lg appearance-none cursor-pointer accent-[#181615]"
        />
        <span className="text-xs font-mono-num text-[#575049] w-12 text-right shrink-0">
          %{sliderPos}
        </span>
      </div>
    </div>
  );
};
