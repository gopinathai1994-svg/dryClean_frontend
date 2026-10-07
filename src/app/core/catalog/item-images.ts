const itemImageMap: Record<string, string> = {
  'reception gown': 'reception-gown',
  'wedding gown': 'reception-gown',
  gown: 'reception-gown',
  shirt: 'shirt',
  pant: 'pant',
  pants: 'pant',
  't-shirt': 't-shirt',
  't shirt': 't-shirt',
  tshirt: 't-shirt',
  jeans: 'jeans',
  kurta: 'kurta',
  salwar: 'salwar',
  'salwar suit': 'salwar-suit',
  churidar: 'churidar',
  saree: 'saree',
  'silk saree': 'saree',
  'designer saree': 'saree',
  'wedding saree': 'saree',
  'cotton saree': 'cotton-saree',
  blouse: 'blouse',
  lehenga: 'lehenga',
  'bridal lehenga': 'lehenga',
  'normal veshti': 'normal-veshti',
  veshti: 'normal-veshti',
  'pattu veshti': 'pattu-veshti',
  'bed sheet': 'bed-sheet',
  bedsheet: 'bed-sheet',
  blanket: 'blanket',
  'pillow cover': 'pillow-cover',
  curtain: 'curtain',
  shorts: 'shorts',
  'night suit': 'night-suit',
  skirt: 'skirt',
  towel: 'towel',
  'bath towel': 'bath-towel',
  'cushion cover': 'cushion-cover',
  'sofa cover': 'cushion-cover',
  duvet: 'duvet',
  quilt: 'quilt',
  'table cloth': 'table-cloth',
  tablecloth: 'table-cloth',
};

function normalizeItemName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function imageForCatalogItem(itemName: string, serviceType = ''): string {
  const normalized = normalizeItemName(itemName);
  const directMatch = itemImageMap[normalized];

  if (directMatch) {
    return `/assets/services/items/${directMatch}.png`;
  }

  if (/(blanket|bed|curtain|cover|cloth|quilt|duvet|towel)/.test(normalized)) {
    return '/assets/services/wash-fold-banner.png';
  }

  if (/(saree|lehenga|gown|dress|blouse|dupatta|skirt|veshti|shawl)/.test(normalized)) {
    return '/assets/services/dry-cleaning-banner.png';
  }

  if (/(shirt|pant|jeans|kurta|salwar|shorts|night)/.test(normalized)) {
    return '/assets/services/wash-iron-banner.png';
  }

  if (serviceType === 'Steam Ironing') {
    return '/assets/services/steam-ironing-banner.png';
  }

  if (serviceType === 'Wash & Iron') {
    return '/assets/services/wash-iron-banner.png';
  }

  return serviceType === 'Dry Cleaning' ? '/assets/services/dry-cleaning-banner.png' : '/assets/services/wash-fold-banner.png';
}
