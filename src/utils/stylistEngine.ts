export type StyleId = 'old-money' | 'smart-casual' | 'streetwear' | 'minimalist' | 'avant-garde';

export interface GarmentHotspot {
  id: string;
  label: string;
  detail: string;
  xPercent: number;
  yPercent: number;
  isRevised?: boolean;
}

export interface WardrobeItem {
  id: string;
  brand: string;
  name: string;
  category: 'Üst Giyim' | 'Alt Giyim' | 'Dış Giyim' | 'Ayakkabı' | 'Aksesuar';
  priceTRY: number;
  material: string;
  fitNote: string;
  colorName: string;
  colorHex: string;
  sizes: string[];
  matchScore: number;
  styleId: StyleId;
  imageUrl: string;
  isRevisionHighlight?: boolean;
  revisionReason?: string;
}

export interface StylePreset {
  id: StyleId;
  name: string;
  subtitle: string;
  editorialTagline: string;
  description: string;
  silhouetteNote: string;
  colorPalette: { name: string; hex: string }[];
  afterImageUrl: string;
  cssFilter?: string;
  promptTemplate: string;
  hotspots: GarmentHotspot[];
  wardrobeItems: WardrobeItem[];
  quickPrompts: string[];
}

export interface RevisionEffect {
  id: string;
  summaryTitle: string;
  stylistReply: string;
  detectedChanges: {
    category: 'Alt Giyim' | 'Ayakkabı' | 'Üst Giyim' | 'Dış Giyim' | 'Aksesuar' | 'Silüet';
    action: string;
    technicalSpec: string;
  }[];
  visualAdjustments: {
    taperTrousers: boolean;
    whiteSneakers: boolean;
    blazerLayer: boolean;
    monochromeTone: boolean;
    warmLinenTone: boolean;
    overrideAfterImageUrl?: string;
    cssFilter: string;
    tailoringNotes: string[];
  };
  updatedHotspots: GarmentHotspot[];
  injectedWardrobeItems: WardrobeItem[];
}

export interface CartItem {
  item: WardrobeItem;
  selectedSize: string;
  quantity: number;
}

export interface WardrobeSummary {
  itemCount: number;
  subtotalTRY: number;
  bundleDiscountTRY: number;
  shippingTRY: number;
  totalTRY: number;
  qualifiesForBundleDiscount: boolean;
  qualifiesForFreeShipping: boolean;
}

export const ORIGINAL_OUTFIT_IMAGE = '/src/assets/images/outfit_original_base_1793916605130.jpg';

export const SAMPLE_MODELS = [
  {
    id: 'model-studio-1',
    name: 'Günlük Loft Kombini (T-Shirt & Jean)',
    description: 'Gri bisiklet yaka tişört, düz kesim mavi jean ve kanvas sneaker',
    imageUrl: '/src/assets/images/outfit_original_base_1793916605130.jpg',
  },
  {
    id: 'model-studio-2',
    name: 'Şehir Klasikleri (Minimal Katman)',
    description: 'Monokrom siyah overshirt, dar kesim kumaş pantolon ve beyaz sneaker',
    imageUrl: '/src/assets/images/outfit_minimalist_1793916609228.jpg',
  },
  {
    id: 'model-studio-3',
    name: 'Hafta Sonu Sokak Stili (Kargo & Ceket)',
    description: 'Yıkamalı antrasit ceket, teknik kargo pantolon ve kalın taban sneaker',
    imageUrl: '/src/assets/images/outfit_streetwear_1793916609581.jpg',
  },
];

export const STYLE_PRESETS: Record<StyleId, StylePreset> = {
  'old-money': {
    id: 'old-money',
    name: 'Old Money',
    subtitle: 'Sessiz Lüks & Miras Terzilik',
    editorialTagline: 'Kaşmir dokular, yüksek bel pilili keten ve zamansız İtalyan işçiliği.',
    description:
      'Logolardan arındırılmış, doğal liflerin (kaşmir, keten, süet) ve kusursuz omuz/bel oranlarının konuştuğu aristokratik silüet.',
    silhouetteNote: 'Yüksek bel pilili pantolon bacak boyunu uzatırken, ince triko polo gövdeyi dengeler.',
    colorPalette: [
      { name: 'Fildişi Kaşmir', hex: '#F3EFE6' },
      { name: 'Kum Keten', hex: '#D8C8B4' },
      { name: 'Espresso Süet', hex: '#4A3525' },
    ],
    afterImageUrl: '/src/assets/images/outfit_old_money_1793916607155.jpg',
    promptTemplate:
      'Restyle the person in this full-body photo into an Old Money quiet luxury outfit: ivory fine-knit cashmere polo sweater, high-waisted tailored sand linen pleated trousers, brown suede penny loafers, and a woven leather belt. Keep the exact pose, body proportions, and studio background.',
    hotspots: [
      {
        id: 'hs-om-1',
        label: 'Fildişi İnce Kaşmir Polo',
        detail: 'Yumuşak omuz düşüşlü, 14-gauge İtalyan kaşmir örgü',
        xPercent: 49,
        yPercent: 34,
      },
      {
        id: 'hs-om-2',
        label: 'Örgü Deri Kemer & Yüksek Bel',
        detail: 'Bel hattını yukarı taşıyan çift pilili terzi kesimi',
        xPercent: 51,
        yPercent: 45,
      },
      {
        id: 'hs-om-3',
        label: 'Kum Beji Keten Pantolon',
        detail: 'Ütü izli, bilekte hafif daralan 19 cm paça açıklığı',
        xPercent: 46,
        yPercent: 66,
      },
      {
        id: 'hs-om-4',
        label: 'Kestane Süet Penny Loafer',
        detail: 'Goodyear welt dikişli yumuşak dana süeti',
        xPercent: 61,
        yPercent: 89,
      },
    ],
    quickPrompts: [
      'Pantolonun paçasını daralt, ayakkabıyı beyaz sneaker yap',
      'Üzerine kruvaze lacivert keten blazer ekle',
      'Kemer ve ayakkabıyı koyu siyah deriye çevir',
    ],
    wardrobeItems: [
      {
        id: 'om-item-1',
        brand: 'Loro & Véra Atelier',
        name: 'Fildişi İnce Örgü Kaşmir Polo',
        category: 'Üst Giyim',
        priceTRY: 8450,
        material: '%100 İç Moğolistan Kaşmiri',
        fitNote: 'Tam Kalıp · Belde Oturan Kesim',
        colorName: 'Kırık Beyaz',
        colorHex: '#F3EFE6',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        matchScore: 99,
        styleId: 'old-money',
        imageUrl: '/src/assets/images/outfit_old_money_1793916607155.jpg',
      },
      {
        id: 'om-item-2',
        brand: 'Sartoria Milano',
        name: 'Yüksek Bel Çift Pilili Keten Pantolon',
        category: 'Alt Giyim',
        priceTRY: 6900,
        material: '%100 Belçika Keteni',
        fitNote: 'Yüksek Bel · Düz İnen Paça',
        colorName: 'Kum Beji',
        colorHex: '#D8C8B4',
        sizes: ['36', '38', '40', '42', '44'],
        matchScore: 98,
        styleId: 'old-money',
        imageUrl: '/src/assets/images/outfit_old_money_1793916607155.jpg',
      },
      {
        id: 'om-item-3',
        brand: 'Valenza Calzature',
        name: 'El Yapımı Kestane Süet Penny Loafer',
        category: 'Ayakkabı',
        priceTRY: 9200,
        material: '%100 İtalyan Süet · Kösele Taban',
        fitNote: 'Tam Numara',
        colorName: 'Espresso Kahve',
        colorHex: '#4A3525',
        sizes: ['38', '39', '40', '41', '42', '43'],
        matchScore: 97,
        styleId: 'old-money',
        imageUrl: '/src/assets/images/outfit_old_money_1793916607155.jpg',
      },
      {
        id: 'om-item-4',
        brand: 'Bottega Artigiana',
        name: 'El Örgüsü Dana Derisi Kemer',
        category: 'Aksesuar',
        priceTRY: 3400,
        material: 'Bitkisel Tabaklanmış Deri · Pirinç Toka',
        fitNote: 'Ayarlanabilir Örgü Gövde',
        colorName: 'Koyu Kahve',
        colorHex: '#3B281B',
        sizes: ['85 cm', '90 cm', '95 cm', '100 cm'],
        matchScore: 95,
        styleId: 'old-money',
        imageUrl: '/src/assets/images/outfit_old_money_1793916607155.jpg',
      },
    ],
  },
  'smart-casual': {
    id: 'smart-casual',
    name: 'Smart Casual',
    subtitle: 'Mimari Terzilik & Modern Şehir',
    editorialTagline: 'Astara ihtiyaç duymayan yün blazer, poplin gömlek ve yalın beyaz deri sneaker.',
    description:
      'Yönetim kurulundan akşam yemeğine zahmetsizce geçen, resmi ciddiyeti modern konforla kıran dengeli şehir silüeti.',
    silhouetteNote: 'Yapılandırılmamış lacivert blazer omuz hattını netleştirirken, dar paça yün pantolon ve beyaz sneaker dinamizm katar.',
    colorPalette: [
      { name: 'Gece Laciverti', hex: '#1B2432' },
      { name: 'Antrasit Yün', hex: '#464B53' },
      { name: 'Saf Beyaz', hex: '#F8F9FA' },
    ],
    afterImageUrl: '/src/assets/images/outfit_smart_casual_1793916607622.jpg',
    promptTemplate:
      'Restyle the person in this full-body photo into a tailored Smart Casual outfit: unstructured navy merino wool blazer over a crisp white poplin shirt, slim-tapered charcoal wool-blend trousers, and pristine white low-top artisan leather sneakers.',
    hotspots: [
      {
        id: 'hs-sc-1',
        label: 'Astarsız Merinos Yün Blazer',
        detail: 'Doğal Napoliten omuz yapısı, nefes alan yün dokuma',
        xPercent: 43,
        yPercent: 34,
      },
      {
        id: 'hs-sc-2',
        label: 'İsviçre Poplin Beyaz Gömlek',
        detail: 'Kravatsız dik duran İtalyan yaka formu',
        xPercent: 50,
        yPercent: 31,
      },
      {
        id: 'hs-sc-3',
        label: 'Dar Paça Antrasit Yün Pantolon',
        detail: 'Dizden bileğe daralan 17.5 cm modern terzi kesimi',
        xPercent: 46,
        yPercent: 65,
      },
      {
        id: 'hs-sc-4',
        label: 'Minimalist Beyaz Deri Sneaker',
        detail: 'Tam sırçalı Nappa derisi, dikişli Margom taban',
        xPercent: 60,
        yPercent: 89,
      },
    ],
    quickPrompts: [
      'Pantolonun paçasını daralt, ayakkabıyı beyaz sneaker yap',
      'İçindeki gömleği siyah balıkçı yaka triko ile değiştir',
      'Pantolonu açık bej chino yap',
    ],
    wardrobeItems: [
      {
        id: 'sc-item-1',
        brand: 'Officina 1920',
        name: 'Astarsız Gece Laciverti Merinos Blazer',
        category: 'Dış Giyim',
        priceTRY: 12800,
        material: '%100 Virgin Yün (Super 130s)',
        fitNote: 'Slim Tailored · Doğal Omuz',
        colorName: 'Gece Laciverti',
        colorHex: '#1B2432',
        sizes: ['46', '48', '50', '52', '54'],
        matchScore: 99,
        styleId: 'smart-casual',
        imageUrl: '/src/assets/images/outfit_smart_casual_1793916607622.jpg',
      },
      {
        id: 'sc-item-2',
        brand: 'Atelier Véra',
        name: 'Dar Paça Antrasit Flanel Kumaş Pantolon',
        category: 'Alt Giyim',
        priceTRY: 6400,
        material: '%98 Yün, %2 Elastan',
        fitNote: 'Tapered Fit · Bilek Hizası Dar Paça',
        colorName: 'Koyu Antrasit',
        colorHex: '#464B53',
        sizes: ['30', '31', '32', '33', '34', '36'],
        matchScore: 98,
        styleId: 'smart-casual',
        imageUrl: '/src/assets/images/outfit_smart_casual_1793916607622.jpg',
      },
      {
        id: 'sc-item-3',
        brand: 'Common Projects & Véra',
        name: 'Artisan Beyaz Nappa Deri Düşük Bilek Sneaker',
        category: 'Ayakkabı',
        priceTRY: 8900,
        material: '%100 İtalyan Nappa Derisi · Kauçuk Taban',
        fitNote: 'Tam Kalıp · Minimalist Profil',
        colorName: 'Optik Beyaz',
        colorHex: '#FFFFFF',
        sizes: ['39', '40', '41', '42', '43', '44'],
        matchScore: 99,
        styleId: 'smart-casual',
        imageUrl: '/src/assets/images/outfit_smart_casual_1793916607622.jpg',
      },
      {
        id: 'sc-item-4',
        brand: 'Tessitura Monti',
        name: 'İki Katlı Mısır Pamuğu Beyaz Poplin Gömlek',
        category: 'Üst Giyim',
        priceTRY: 4650,
        material: '%100 Giza Pamuğu',
        fitNote: 'Modern Fit · Yumuşak Yaka',
        colorName: 'Saf Beyaz',
        colorHex: '#F8F9FA',
        sizes: ['S', 'M', 'L', 'XL'],
        matchScore: 96,
        styleId: 'smart-casual',
        imageUrl: '/src/assets/images/outfit_smart_casual_1793916607622.jpg',
      },
    ],
  },
  streetwear: {
    id: 'streetwear',
    name: 'Streetwear',
    subtitle: 'Teknik Hacim & Kentsel Dokular',
    editorialTagline: 'Ağır gramajlı yıkamalı ceket, ayarlanabilir paçalı kargo pantolon ve heykelsi sneaker.',
    description:
      'Kutu formlu (boxy) üst kesimleri teknik kumaşlı alt parçalarla birleştiren, fonksiyonelliği ve sokak kültürünü lüks terzilikle buluşturan stil.',
    silhouetteNote: 'Kısa ve geniş omuzlu ceket üst gövdeye hacim verirken, bilekte büzülen kargo paçalar sneaker formunu ön plana çıkarır.',
    colorPalette: [
      { name: 'Yıkamalı Grafit', hex: '#383B3E' },
      { name: 'Zeytin Haki', hex: '#414535' },
      { name: 'Kemik Beyazı', hex: '#EAE6DF' },
    ],
    afterImageUrl: '/src/assets/images/outfit_streetwear_1793916609581.jpg',
    promptTemplate:
      'Restyle the person in this full-body photo into a contemporary luxury Streetwear outfit: boxy heavyweight washed graphite utility jacket over a crisp white tee, olive technical cargo trousers with tapered ankle cuffs, and chunky off-white leather sneakers.',
    hotspots: [
      {
        id: 'hs-sw-1',
        label: 'Yıkamalı Grafit Denim/Kanvas Ceket',
        detail: '14 oz ağır gramajlı pamuk, düşürülmüş omuz dikişi',
        xPercent: 44,
        yPercent: 36,
      },
      {
        id: 'hs-sw-2',
        label: 'Ağır Gramajlı Beyaz T-Shirt & Zincir',
        detail: '300 gsm sıkı yaka ribanalı organik pamuk',
        xPercent: 50,
        yPercent: 32,
      },
      {
        id: 'hs-sw-3',
        label: 'Paçası Daraltılmış Teknik Kargo',
        detail: 'Körüklü yan cepler ve bilekte elastik dar paça formu',
        xPercent: 54,
        yPercent: 64,
      },
      {
        id: 'hs-sw-4',
        label: 'Heykelsi Kemik Beyazı Sneaker',
        detail: 'Çok katmanlı süet-deri saya ve darbe emici taban',
        xPercent: 61,
        yPercent: 88,
      },
    ],
    quickPrompts: [
      'Pantolonun paçasını daralt, ayakkabıyı beyaz sneaker yap',
      'Ceketi oversize siyah kapüşonlu hoodie ile değiştir',
      'Kargo pantolonu geniş kesim ham denim jean yap',
    ],
    wardrobeItems: [
      {
        id: 'sw-item-1',
        brand: 'Kurogane Studio',
        name: 'Asit Yıkamalı Ağır Gramajlı Utility Ceket',
        category: 'Dış Giyim',
        priceTRY: 7850,
        material: '14oz Japon Kanvas Denim',
        fitNote: 'Boxy Fit · Düşük Omuz',
        colorName: 'Yıkamalı Grafit',
        colorHex: '#383B3E',
        sizes: ['S', 'M', 'L', 'XL'],
        matchScore: 99,
        styleId: 'streetwear',
        imageUrl: '/src/assets/images/outfit_streetwear_1793916609581.jpg',
      },
      {
        id: 'sw-item-2',
        brand: 'Aether Technical',
        name: 'Bilekten Daralan Ripstop Kargo Pantolon',
        category: 'Alt Giyim',
        priceTRY: 5900,
        material: 'Su İtici Pamuk-Naylon Ripstop',
        fitNote: 'Relaxed Tapered · Ayarlanabilir Paça',
        colorName: 'Koyu Zeytin Haki',
        colorHex: '#414535',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        matchScore: 98,
        styleId: 'streetwear',
        imageUrl: '/src/assets/images/outfit_streetwear_1793916609581.jpg',
      },
      {
        id: 'sw-item-3',
        brand: 'Solis Footwear',
        name: 'Heykelsi Tabanlı Kemik Beyazı Runner Sneaker',
        category: 'Ayakkabı',
        priceTRY: 8200,
        material: 'Nubuk, Deri ve Teknik File',
        fitNote: 'Tam Kalıp · Yükseltilmiş Taban',
        colorName: 'Kemik Beyazı / Siyah',
        colorHex: '#EAE6DF',
        sizes: ['38', '39', '40', '41', '42', '43'],
        matchScore: 97,
        styleId: 'streetwear',
        imageUrl: '/src/assets/images/outfit_streetwear_1793916609581.jpg',
      },
      {
        id: 'sw-item-4',
        brand: 'Atelier Véra Basics',
        name: '300 GSM Ağır Gramajlı Beyaz Boxy T-Shirt',
        category: 'Üst Giyim',
        priceTRY: 2450,
        material: '%100 Taranmış Organik Pamuk',
        fitNote: 'Oversize Boxy',
        colorName: 'Optik Beyaz',
        colorHex: '#FFFFFF',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        matchScore: 95,
        styleId: 'streetwear',
        imageUrl: '/src/assets/images/outfit_streetwear_1793916609581.jpg',
      },
    ],
  },
  minimalist: {
    id: 'minimalist',
    name: 'Minimalist',
    subtitle: 'İskandinav Monokrom & Yalın Hatlar',
    editorialTagline: 'Mat siyah yün overshirt, bilekte biten dar kesim pantolon ve kontrast beyaz sneaker.',
    description:
      'Gereksiz tüm dikiş ve süslemeleri eleyen, form ve orantıyı tek renk (monokrom) yüzeylerle vurgulayan Kopenhag-Stockholm ekolü.',
    silhouetteNote: 'Bilek kemiğinde biten (cropped tapered) dar paça pantolon ve saf beyaz deri sneaker, monokrom siyah silüeti hafifletir.',
    colorPalette: [
      { name: 'Mat Obsidyen', hex: '#18181B' },
      { name: 'Koyu Arduvaz', hex: '#2D3139' },
      { name: 'Saf Beyaz', hex: '#FFFFFF' },
    ],
    afterImageUrl: '/src/assets/images/outfit_minimalist_1793916609228.jpg',
    promptTemplate:
      'Restyle the person in this full-body photo into a Scandinavian Minimalist outfit: structured matte black wool overshirt, slim tapered ankle-length slate black tailored trousers, and clean crisp white calfskin sneakers.',
    hotspots: [
      {
        id: 'hs-min-1',
        label: 'Mat Siyah Keçe Yün Overshirt',
        detail: 'Gizli patlı düğme ve tek göğüs cepli mimari kesim',
        xPercent: 45,
        yPercent: 35,
      },
      {
        id: 'hs-min-2',
        label: 'Bilekte Biten Dar Paça Pantolon',
        detail: 'Ütü kırmalı, bileğe doğru daralan 16.5 cm paça',
        xPercent: 46,
        yPercent: 64,
      },
      {
        id: 'hs-min-3',
        label: 'Mimari Deri Mini Tote Çanta',
        detail: 'Dikişsiz kenar boyalı sertleştirilmiş dana derisi',
        xPercent: 64,
        yPercent: 66,
      },
      {
        id: 'hs-min-4',
        label: 'Saf Beyaz Dana Derisi Sneaker',
        detail: 'Logolardan arındırılmış tek parça beyaz deri yüzey',
        xPercent: 63,
        yPercent: 88,
      },
    ],
    quickPrompts: [
      'Pantolonun paçasını daralt, ayakkabıyı beyaz sneaker yap',
      'Overshirt yerine ekru kaşmir kazak dene',
      'Ayakkabıyı kalın tabanlı siyah chelsea bot yap',
    ],
    wardrobeItems: [
      {
        id: 'min-item-1',
        brand: 'Norr & Söder',
        name: 'Mimari Kesim Mat Siyah Yün Overshirt',
        category: 'Dış Giyim',
        priceTRY: 9400,
        material: '%80 Geri Dönüştürülmüş Yün, %20 Poliamid',
        fitNote: 'Structured Regular Fit',
        colorName: 'Mat Siyah',
        colorHex: '#18181B',
        sizes: ['XS', 'S', 'M', 'L'],
        matchScore: 99,
        styleId: 'minimalist',
        imageUrl: '/src/assets/images/outfit_minimalist_1793916609228.jpg',
      },
      {
        id: 'min-item-2',
        brand: 'Norr & Söder',
        name: 'Bilek Boy Dar Paça Arduvaz Kumaş Pantolon',
        category: 'Alt Giyim',
        priceTRY: 6100,
        material: 'Soğuk Yün Gabardin',
        fitNote: 'Slim Tapered · Daraltılmış Paça',
        colorName: 'Koyu Arduvaz',
        colorHex: '#2D3139',
        sizes: ['34', '36', '38', '40', '42'],
        matchScore: 99,
        styleId: 'minimalist',
        imageUrl: '/src/assets/images/outfit_minimalist_1793916609228.jpg',
      },
      {
        id: 'min-item-3',
        brand: 'Atelier Véra',
        name: 'Monolit Saf Beyaz Deri Sneaker',
        category: 'Ayakkabı',
        priceTRY: 8600,
        material: '%100 Fransız Dana Derisi',
        fitNote: 'Tam Kalıp · İnce Profil',
        colorName: 'Saf Beyaz',
        colorHex: '#FFFFFF',
        sizes: ['37', '38', '39', '40', '41', '42'],
        matchScore: 98,
        styleId: 'minimalist',
        imageUrl: '/src/assets/images/outfit_minimalist_1793916609228.jpg',
      },
      {
        id: 'min-item-4',
        brand: 'Studio Kopenhag',
        name: 'Geometrik Mini Siyah Deri Tote Çanta',
        category: 'Aksesuar',
        priceTRY: 7200,
        material: 'Bitkisel Tabaklanmış İtalyan Derisi',
        fitNote: 'El ve Kol Taşıma Saplı',
        colorName: 'Obsidyen Siyah',
        colorHex: '#121212',
        sizes: ['Tek Ebat'],
        matchScore: 96,
        styleId: 'minimalist',
        imageUrl: '/src/assets/images/outfit_minimalist_1793916609228.jpg',
      },
    ],
  },
  'avant-garde': {
    id: 'avant-garde',
    name: 'Avant-Garde',
    subtitle: 'Dekonstrüktif Form & Kontrast Katmanlar',
    editorialTagline: 'Asimetrik drapeler, yüksek kontrastlı monokrom yüzeyler ve heykelsi oranlar.',
    description:
      'Geleneksel kalıpları yeniden yorumlayan, koyu dramatik tonları keskin beyaz detaylarla çarpıştıran galeri estetiği.',
    silhouetteNote: 'Üst gövdede yapısal omuz hattı ve bilekte keskin biçimde daralan pantolon-sneaker kontrastı odak noktası yaratır.',
    colorPalette: [
      { name: 'Karbon Siyahı', hex: '#111113' },
      { name: 'Ham Çimento', hex: '#8E8E93' },
      { name: 'Galeri Beyazı', hex: '#F4F4F6' },
    ],
    afterImageUrl: '/src/assets/images/outfit_minimalist_1793916609228.jpg',
    cssFilter: 'contrast(1.08) saturate(0.82)',
    promptTemplate:
      'Restyle the person in this full-body photo into an architectural Avant-Garde fashion outfit: deconstructed matte black wool jacket, sculpted tapered ankle trousers, and geometric white leather footwear.',
    hotspots: [
      {
        id: 'hs-ag-1',
        label: 'Dekonstrüktif Asimetrik Ceket',
        detail: 'Ağır gramajlı dokuma yün, gizli yaka klapası',
        xPercent: 45,
        yPercent: 35,
      },
      {
        id: 'hs-ag-2',
        label: 'Heykelsi Dar Paça Pantolon',
        detail: 'Diz kırmalı, bilekte 16 cm keskin daralan form',
        xPercent: 46,
        yPercent: 64,
      },
      {
        id: 'hs-ag-3',
        label: 'Kontrast Beyaz Deri Tabanlı Ayakkabı',
        detail: 'Monokrom siyah kombin altında mimari beyaz vurgu',
        xPercent: 63,
        yPercent: 88,
      },
    ],
    quickPrompts: [
      'Pantolonun paçasını daralt, ayakkabıyı beyaz sneaker yap',
      'Kontrastı artır ve tamamen monokrom siyah-beyaz yap',
      'Üzerine uzun antrasit trençkot katmanı ekle',
    ],
    wardrobeItems: [
      {
        id: 'ag-item-1',
        brand: 'Maison Véra Avant',
        name: 'Dekonstrüktif Karbon Yün Ceket',
        category: 'Dış Giyim',
        priceTRY: 14200,
        material: '%100 Ağır Dokuma Japon Yünü',
        fitNote: 'Architectural Fit',
        colorName: 'Karbon Siyahı',
        colorHex: '#111113',
        sizes: ['S', 'M', 'L'],
        matchScore: 99,
        styleId: 'avant-garde',
        imageUrl: '/src/assets/images/outfit_minimalist_1793916609228.jpg',
      },
      {
        id: 'ag-item-2',
        brand: 'Maison Véra Avant',
        name: 'Keskin Pensli Dar Paça Kupro-Yün Pantolon',
        category: 'Alt Giyim',
        priceTRY: 7900,
        material: '%70 Yün, %30 Kupro',
        fitNote: 'Sculpted Tapered · Bilek Boy',
        colorName: 'Grafit Siyah',
        colorHex: '#222428',
        sizes: ['36', '38', '40', '42'],
        matchScore: 98,
        styleId: 'avant-garde',
        imageUrl: '/src/assets/images/outfit_minimalist_1793916609228.jpg',
      },
      {
        id: 'ag-item-3',
        brand: 'Atelier Véra',
        name: 'Geometrik Tabanlı Optik Beyaz Deri Sneaker',
        category: 'Ayakkabı',
        priceTRY: 9600,
        material: '%100 Tam Sırçalı Dana Derisi',
        fitNote: 'Tam Kalıp',
        colorName: 'Galeri Beyazı',
        colorHex: '#F4F4F6',
        sizes: ['38', '39', '40', '41', '42', '43'],
        matchScore: 97,
        styleId: 'avant-garde',
        imageUrl: '/src/assets/images/outfit_minimalist_1793916609228.jpg',
      },
    ],
  },
};

export function clampSliderPosition(value: number): number {
  if (Number.isNaN(value)) return 50;
  return Math.max(5, Math.min(95, Math.round(value)));
}

/**
 * Parses a natural-language Turkish/English revision prompt from the user
 * (such as "Pantolonun paçasını daralt, ayakkabıyı beyaz sneaker yap")
 * and computes concrete visual adjustments, updated garment hotspots,
 * and updated "Gardırobu Tamamla" shopping cards.
 */
export function parseRevisionIntent(userMessage: string, currentStyleId: StyleId): RevisionEffect {
  const normalized = userMessage.toLocaleLowerCase('tr-TR').trim();
  const basePreset = STYLE_PRESETS[currentStyleId] ?? STYLE_PRESETS['old-money'];

  const taperTrousers =
    normalized.includes('paça') ||
    normalized.includes('daralt') ||
    normalized.includes('slim') ||
    normalized.includes('taper') ||
    normalized.includes('bilek') ||
    normalized.includes('pantolon');

  const whiteSneakers =
    normalized.includes('beyaz sneaker') ||
    normalized.includes('sneaker') ||
    normalized.includes('beyaz ayakkabı') ||
    normalized.includes('spor ayakkabı');

  const blazerLayer =
    normalized.includes('blazer') ||
    normalized.includes('ceket') ||
    normalized.includes('kruvaze') ||
    normalized.includes('trençkot');

  const monochromeTone =
    normalized.includes('siyah') ||
    normalized.includes('monokrom') ||
    normalized.includes('koyu');

  const warmLinenTone =
    normalized.includes('bej') ||
    normalized.includes('keten') ||
    normalized.includes('ekru') ||
    normalized.includes('açık');

  const detectedChanges: RevisionEffect['detectedChanges'] = [];
  const tailoringNotes: string[] = [];
  const injectedWardrobeItems: WardrobeItem[] = [];

  if (taperTrousers) {
    detectedChanges.push({
      category: 'Alt Giyim',
      action: 'Paça Daraltma & Bilek Hizası Terzilik',
      technicalSpec: 'Paça açıklığı 21 cm’den 16.8 cm’ye daraltıldı; bilek kemiği üzerinde kırılmasız (no-break) bitiş sağlandı.',
    });
    tailoringNotes.push('Paça 16.8 cm Tapered Fit olarak daraltıldı');
    injectedWardrobeItems.push({
      id: `rev-trousers-${Date.now()}`,
      brand: 'Atelier Véra Bespoke',
      name: 'Özel Terzi Dar Paça (16.8 cm) İtalyan Yün Pantolon',
      category: 'Alt Giyim',
      priceTRY: 6750,
      material: '%98 Soğuk Yün, %2 Elastan',
      fitNote: 'Özel Revizyon · Bilekte Daralan Tapered Kesim',
      colorName: monochromeTone ? 'Obsidyen Siyah' : 'Koyu Antrasit',
      colorHex: monochromeTone ? '#18181B' : '#363A42',
      sizes: ['36', '38', '40', '42', '44'],
      matchScore: 100,
      styleId: currentStyleId,
      imageUrl: '/src/assets/images/outfit_minimalist_1793916609228.jpg',
      isRevisionHighlight: true,
      revisionReason: 'Paça daraltma talebinize göre kalıbı güncellendi',
    });
  }

  if (whiteSneakers) {
    detectedChanges.push({
      category: 'Ayakkabı',
      action: 'Beyaz Deri Sneaker Dönüşümü',
      technicalSpec: 'Klasik taban yerine düşük bilekli, logolardan arındırılmış optik beyaz İtalyan Nappa deri sneaker uygulandı.',
    });
    tailoringNotes.push('Ayakkabı Beyaz Deri Sneaker ile değiştirildi');
    injectedWardrobeItems.push({
      id: `rev-sneaker-${Date.now() + 1}`,
      brand: 'Atelier Véra Footwear',
      name: 'Artisan Optik Beyaz Nappa Deri Sneaker',
      category: 'Ayakkabı',
      priceTRY: 8950,
      material: '%100 İtalyan Nappa Derisi · Margom Taban',
      fitNote: 'Özel Revizyon · Dar Paça İle Uyumlu Düşük Bilek',
      colorName: 'Optik Beyaz',
      colorHex: '#FFFFFF',
      sizes: ['38', '39', '40', '41', '42', '43', '44'],
      matchScore: 100,
      styleId: currentStyleId,
      imageUrl: '/src/assets/images/outfit_smart_casual_1793916607622.jpg',
      isRevisionHighlight: true,
      revisionReason: 'Beyaz sneaker revizyonunuz için seçildi',
    });
  }

  if (blazerLayer) {
    detectedChanges.push({
      category: 'Dış Giyim',
      action: 'Yapısal Blazer Katmanı',
      technicalSpec: 'Omuz hattını netleştiren astarsız merinos yün ceket katmanı eklendi.',
    });
    tailoringNotes.push('Üst katmana astarsız yün blazer eklendi');
    injectedWardrobeItems.push({
      id: `rev-blazer-${Date.now() + 2}`,
      brand: 'Officina 1920',
      name: 'Napoliten Omuz Lacivert Yün Blazer',
      category: 'Dış Giyim',
      priceTRY: 12800,
      material: '%100 Super 130s Merinos Yünü',
      fitNote: 'Özel Revizyon · Astarsız Hafif Yapı',
      colorName: 'Gece Laciverti',
      colorHex: '#1B2432',
      sizes: ['46', '48', '50', '52'],
      matchScore: 99,
      styleId: currentStyleId,
      imageUrl: '/src/assets/images/outfit_smart_casual_1793916607622.jpg',
      isRevisionHighlight: true,
      revisionReason: 'Ceket/blazer katmanı talebinize göre eklendi',
    });
  }

  if (detectedChanges.length === 0) {
    detectedChanges.push({
      category: 'Silüet',
      action: 'Orantı & Doku İyileştirmesi',
      technicalSpec: `"${userMessage}" talebine göre kombinin omuz-bel-paça dengesi ve doku kontrastı yeniden kalibre edildi.`,
    });
    tailoringNotes.push(`Stil revizyonu uygulandı: ${userMessage}`);
  }

  // Select the best visual match when fallback visual synthesis is needed
  let overrideAfterImageUrl: string | undefined;
  let cssFilter = 'contrast(1.03)';

  if (taperTrousers && whiteSneakers) {
    // Both smart-casual and minimalist feature slim tapered ankle trousers + crisp white leather sneakers!
    overrideAfterImageUrl =
      currentStyleId === 'smart-casual' || blazerLayer
        ? '/src/assets/images/outfit_smart_casual_1793916607622.jpg'
        : '/src/assets/images/outfit_minimalist_1793916609228.jpg';
    cssFilter = 'contrast(1.04) brightness(1.02)';
  } else if (blazerLayer) {
    overrideAfterImageUrl = '/src/assets/images/outfit_smart_casual_1793916607622.jpg';
  } else if (warmLinenTone) {
    overrideAfterImageUrl = '/src/assets/images/outfit_old_money_1793916607155.jpg';
    cssFilter = 'sepia(0.08) brightness(1.03)';
  } else if (monochromeTone) {
    overrideAfterImageUrl = '/src/assets/images/outfit_minimalist_1793916609228.jpg';
    cssFilter = 'contrast(1.08) saturate(0.85)';
  }

  // Update hotspots so the user immediately sees their revision pinned on the After image
  const updatedHotspots: GarmentHotspot[] = basePreset.hotspots.map((hs) => ({ ...hs }));

  if (taperTrousers) {
    const idx = updatedHotspots.findIndex(
      (h) => h.label.toLocaleLowerCase('tr-TR').includes('pantolon') || h.label.toLocaleLowerCase('tr-TR').includes('kargo')
    );
    const revisedTrouserHotspot: GarmentHotspot = {
      id: 'hs-rev-trousers',
      label: 'Daraltılmış Paça (16.8 cm Tapered)',
      detail: 'Revizyon: Bilek hizasında kırılmasız dar paça terzi kesimi',
      xPercent: 46,
      yPercent: 72,
      isRevised: true,
    };
    if (idx >= 0) {
      updatedHotspots[idx] = revisedTrouserHotspot;
    } else {
      updatedHotspots.push(revisedTrouserHotspot);
    }
  }

  if (whiteSneakers) {
    const idx = updatedHotspots.findIndex(
      (h) =>
        h.label.toLocaleLowerCase('tr-TR').includes('sneaker') ||
        h.label.toLocaleLowerCase('tr-TR').includes('loafer') ||
        h.label.toLocaleLowerCase('tr-TR').includes('ayakkabı')
    );
    const revisedShoeHotspot: GarmentHotspot = {
      id: 'hs-rev-sneaker',
      label: 'Beyaz İtalyan Deri Sneaker',
      detail: 'Revizyon: Optik beyaz Nappa deri, dar paça ile tam kontrast',
      xPercent: 62,
      yPercent: 89,
      isRevised: true,
    };
    if (idx >= 0) {
      updatedHotspots[idx] = revisedShoeHotspot;
    } else {
      updatedHotspots.push(revisedShoeHotspot);
    }
  }

  const summaryParts = detectedChanges.map((d) => d.action);
  const summaryTitle = summaryParts.join(' · ');

  let stylistReply = `**${basePreset.name}** kombininizde istediğiniz revizyonu uyguladım: `;
  if (taperTrousers && whiteSneakers) {
    stylistReply +=
      `Pantolonun paça genişliğini diz altından bileğe doğru **16.8 cm tapered** kalıpla daralttım; böylece kumaş ayakkabının üzerine yığılmadan bilek kemiğinde temiz bir hatla bitiyor. Altına eklediğim **optik beyaz İtalyan Nappa deri sneaker**, hem daralan paça oranını vurguluyor hem de kombine modern, zahmetsiz bir şehir enerjisi katıyor. Aşağıdaki **"Gardırobu Tamamla"** listesini de bu iki yeni parçayla güncelledim.`;
  } else if (taperTrousers) {
    stylistReply +=
      `Pantolonun paçasını bileğe doğru daraltarak (**16.8 cm paça açıklığı**) bacak boyunu daha uzun ve derli toplu gösteren bir terzi kesimi elde ettim. Güncellenen dar paça pantolon alternatifini gardırop listesine ekledim.`;
  } else if (whiteSneakers) {
    stylistReply +=
      `Ayakkabıyı logolardan arındırılmış, düşük bilekli **beyaz İtalyan deri sneaker** ile değiştirdim. Bu dokunuş kombinin resmiyetini dengelerken ferah bir kontrast yarattı.`;
  } else {
    stylistReply += `"${userMessage}" notunuza göre silüet oranlarını, doku geçişlerini ve eşleşen gardırop parçalarını güncelledim. Öncesi/Sonrası kaydırıcısıyla farkı inceleyebilirsiniz.`;
  }

  return {
    id: `rev-${Date.now()}`,
    summaryTitle,
    stylistReply,
    detectedChanges,
    visualAdjustments: {
      taperTrousers,
      whiteSneakers,
      blazerLayer,
      monochromeTone,
      warmLinenTone,
      overrideAfterImageUrl,
      cssFilter,
      tailoringNotes,
    },
    updatedHotspots,
    injectedWardrobeItems,
  };
}

export function mergeWardrobeWithRevisions(
  baseItems: WardrobeItem[],
  injectedItems: WardrobeItem[]
): WardrobeItem[] {
  if (injectedItems.length === 0) return baseItems;
  const injectedCategories = new Set(injectedItems.map((i) => i.category));
  const remainingBase = baseItems.filter((item) => !injectedCategories.has(item.category));
  return [...injectedItems, ...remainingBase];
}

export function calculateWardrobeSummary(cartItems: CartItem[]): WardrobeSummary {
  const itemCount = cartItems.reduce((acc, entry) => acc + entry.quantity, 0);
  const subtotalTRY = cartItems.reduce(
    (acc, entry) => acc + entry.item.priceTRY * entry.quantity,
    0
  );
  const qualifiesForBundleDiscount = itemCount >= 3;
  const bundleDiscountTRY = qualifiesForBundleDiscount ? Math.round(subtotalTRY * 0.12) : 0;
  const discountedSubtotal = subtotalTRY - bundleDiscountTRY;
  const qualifiesForFreeShipping = discountedSubtotal >= 5000 || itemCount === 0;
  const shippingTRY = qualifiesForFreeShipping ? 0 : 190;
  const totalTRY = discountedSubtotal + shippingTRY;

  return {
    itemCount,
    subtotalTRY,
    bundleDiscountTRY,
    shippingTRY,
    totalTRY,
    qualifiesForBundleDiscount,
    qualifiesForFreeShipping,
  };
}

export function formatTRY(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(amount);
}
