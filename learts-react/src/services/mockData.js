// Dữ liệu giả lập (mock data) đóng vai trò "Backend API".
// Trong thực tế, các hàm trong services/api.js sẽ gọi API thật (VD: axios.get('/api/products')).
// Ở đây ta giả lập độ trễ mạng bằng setTimeout để có thể test trạng thái Loading.

export const CATEGORIES = [
  { id: 'kids-babies', name: 'Kids & Babies', itemCount: 8 },
  { id: 'home-decor', name: 'Home Decor', itemCount: 16 },
  { id: 'gift-ideas', name: 'Gift ideas', itemCount: 16 },
  { id: 'kitchen', name: 'Kitchen', itemCount: 12 },
  { id: 'toys', name: 'Toys', itemCount: 6 },
  { id: 'knitting-sewing', name: 'Kniting & Sewing', itemCount: 4 },
  { id: 'pots', name: 'Pots', itemCount: 7 },
];

const productNames = [
  'Walnut Cutting Board',
  'Lucky Wooden Elephant',
  'Fish Cut Out Set',
  'Cleaning Dustpan & Brush',
  'Ceramic Flower Vase',
  'Handmade Wool Basket',
  'Country Feast Table Set',
  'Knitted Baby Blanket',
  'Wooden Toy Truck',
  'Terracotta Plant Pot',
  'Macrame Wall Hanging',
  'Embroidered Cushion Cover',
  'Bamboo Kitchen Utensil Set',
  'Hand-painted Mug',
  'Woven Storage Basket',
  'Clay Tea Set',
  'Felt Christmas Ornament',
  'Wooden Puzzle Toy',
  'Linen Table Runner',
  'Ceramic Fruit Bowl',
  'Knitted Winter Scarf',
  'Mini Succulent Pot',
  'Rattan Wall Mirror',
  'Handmade Soap Set',
];

const categoryIds = CATEGORIES.map((c) => c.id);

// Sinh 24 sản phẩm mẫu với dữ liệu đầy đủ: giá, tồn kho, mô tả, hình ảnh, danh mục
export const PRODUCTS = productNames.map((name, index) => {
  const price = Math.round((15 + Math.random() * 120) * 100) / 100;
  const hasSale = index % 4 === 0;
  return {
    id: `p${index + 1}`,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name,
    price,
    salePrice: hasSale ? Math.round(price * 0.8 * 100) / 100 : null,
    category: categoryIds[index % categoryIds.length],
    stock: 5 + ((index * 7) % 40),
    rating: 3.5 + ((index % 5) * 0.3),
    reviewCount: 3 + (index % 12),
    images: [
      `https://picsum.photos/seed/learts-${index + 1}-a/600/600`,
      `https://picsum.photos/seed/learts-${index + 1}-b/600/600`,
      `https://picsum.photos/seed/learts-${index + 1}-c/600/600`,
    ],
    description:
      'Sản phẩm thủ công (handmade) được chế tác tỉ mỉ từ nguyên liệu tự nhiên, thân thiện với môi trường. Phù hợp làm quà tặng hoặc trang trí nhà cửa, mang đến nét mộc mạc và ấm cúng cho không gian sống của bạn.',
    isFeatured: index % 3 === 0,
  };
});

export function delay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
