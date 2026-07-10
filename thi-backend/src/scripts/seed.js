const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

// Import models (which will dynamically resolve Mongoose or Fallback due to Proxy)
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/learts';
    console.log(`[Seed] Attempting connection to MongoDB: ${mongoUri}...`);
    
    // We set a 2-second timeout to fail fast if offline
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
    console.log('[Seed] Connected to MongoDB! Running standard seeding...');
    process.env.USE_FALLBACK_DB = 'false';
    await executeSeedLogic();
    console.log('[Seed] Standard MongoDB seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.log(`\n\x1b[33m[Seed Info] MongoDB connection failed: ${error.message}\x1b[0m`);
    console.log(`\x1b[33m[Seed Info] Switching database layer to JSON File Fallback Mode...\x1b[0m`);
    
    process.env.USE_FALLBACK_DB = 'true';
    await executeSeedLogic();
    console.log('\x1b[32m[Seed] Local JSON Fallback DB seeded successfully in the \'data/\' directory!\x1b[0m');
    console.log('\x1b[32m[Seed] Credentials created: Username: admin, Password: admin123\x1b[0m');
    process.exit(0);
  }
};

const executeSeedLogic = async () => {
  // Clear existing records
  await User.deleteMany({});
  await Category.deleteMany({});
  await Product.deleteMany({});
  await Order.deleteMany({});
  console.log('[Seed] Wiped stale collections.');

  // 1. Create Default Admin User
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin123', salt);
  const admin = await User.create({
    username: 'admin',
    email: 'admin@learts.com',
    password: hashedPassword,
    role: 'admin'
  });
  console.log('[Seed] Created Admin User (Username: admin, Password: admin123)');

  // 2. Create Categories
  const categoriesData = [
    { name: 'Pots', description: 'Handmade ceramic pots and planters' },
    { name: 'Home Decor', description: 'Beautiful ornaments and accessories for your home' },
    { name: 'Kids & Babies', description: 'Handcrafted toys and play items for children' },
    { name: 'Kitchen', description: 'Exquisite kitchenware, mugs, and teapots' },
    { name: 'Knitting & Sewing', description: 'Traditional scissors and sewing sets' },
    { name: 'Toys', description: 'Fun toys for everyone' }
  ];

  const seededCategories = await Category.insertMany(categoriesData);
  console.log(`[Seed] Seeded ${seededCategories.length} categories.`);

  // Helper to get category ID by name
  const getCategoryId = (name) => {
    const cat = seededCategories.find(c => c.name === name);
    return cat ? cat._id : null;
  };

  // 3. Create Products
  const productsData = [
    {
      name: '3D Attractive Pot',
      description: 'An elegant 3D printed geometric pot designed for modern apartments and minimalistic home decor. Suitable for small indoor plants and succulents.',
      price: 90.00,
      imageUrl: 'https://html-demo-orcin.vercel.app/premium/learts/assets/images/product/s328/product-17.webp',
      stock: 15,
      category: getCategoryId('Pots'),
      badge: 'none'
    },
    {
      name: 'Abstract Folded Pots',
      description: 'Set of abstract design ceramic pots with folded folds pattern. These handmade pots add an artistic, contemporary touch to any tabletop or windowsill.',
      price: 50.00,
      imageUrl: 'https://html-demo-orcin.vercel.app/premium/learts/assets/images/product/s328/product-14.webp',
      stock: 8,
      category: getCategoryId('Pots'),
      badge: 'new'
    },
    {
      name: 'Adhesive Tape Dispenser',
      description: 'A premium handmade wooden adhesive tape dispenser, combining high functionality with aesthetic workspace design. Crafted from sustainable oak.',
      price: 15.00,
      imageUrl: 'https://html-demo-orcin.vercel.app/premium/learts/assets/images/product/s328/product-30.webp',
      stock: 25,
      category: getCategoryId('Home Decor'),
      badge: 'hot'
    },
    {
      name: 'Decorative Christmas Fox',
      description: 'Adorable hand-knitted decorative fox ornament, perfect for adding warmth to your living room or gifting during the festive winter holidays.',
      price: 50.00,
      imageUrl: 'https://html-demo-orcin.vercel.app/premium/learts/assets/images/product/s328/product-8.webp',
      stock: 12,
      category: getCategoryId('Home Decor'),
      badge: 'hot'
    },
    {
      name: 'Clear Silicate Teapot',
      description: 'Heat-resistant silicate glass teapot, featuring a built-in spiral filter in the spout. Perfect for brewing blooming teas or loose leaf varieties.',
      price: 140.00,
      imageUrl: 'https://html-demo-orcin.vercel.app/premium/learts/assets/images/product/s328/product-6.webp',
      stock: 5,
      category: getCategoryId('Kitchen'),
      badge: 'none'
    },
    {
      name: 'Bouncer Measuring Cup',
      description: 'Heavy-duty commercial grade glass measuring cup with standard ounce and milliliter markings. Features a robust handle and easy-pour spout.',
      price: 150.00,
      imageUrl: 'https://html-demo-orcin.vercel.app/premium/learts/assets/images/product/s328/product-31.webp',
      stock: 10,
      category: getCategoryId('Kitchen'),
      badge: 'new'
    },
    {
      name: 'Boho Beard Mug',
      description: 'Quirky custom handmade ceramic mug styled with a classic mustache and beard imprint. A rustic handle makes it the perfect vessel for hot coffee.',
      price: 39.00,
      imageUrl: 'https://html-demo-orcin.vercel.app/premium/learts/assets/images/product/s328/product-1.webp',
      stock: 20,
      category: getCategoryId('Kitchen'),
      badge: 'sale',
      originalPrice: 45.00
    },
    {
      name: 'Antique Sewing Scissors',
      description: 'Vintage-style sewing scissors made from forged carbon steel with ornate handle carvings. Extremely sharp blades optimized for fabric and thread.',
      price: 12.00,
      imageUrl: 'https://html-demo-orcin.vercel.app/premium/learts/assets/images/product/s328/product-25.webp',
      stock: 30,
      category: getCategoryId('Knitting & Sewing'),
      badge: 'sale',
      originalPrice: 15.00
    },
    {
      name: 'Cape Cottage Playhouse',
      description: 'Charming cottage-style play tent for children, decorated with curtains, letters, and windows. Made of organic cotton fabric and sturdy wooden frames.',
      price: 35.00,
      imageUrl: 'https://html-demo-orcin.vercel.app/premium/learts/assets/images/product/s328/product-12.webp',
      stock: 7,
      category: getCategoryId('Kids & Babies'),
      badge: 'none'
    }
  ];

  const seededProducts = await Product.insertMany(productsData);
  console.log(`[Seed] Seeded ${seededProducts.length} products.`);

  // 4. Create a Sample Order
  const sampleOrder = await Order.create({
    customerName: 'Nguyen Van A',
    customerPhone: '0987654321',
    customerAddress: '123 Duong Le Loi, Quan 1, TP. HCM',
    totalAmount: 129.00,
    status: 'Pending',
    items: [
      {
        product: seededProducts[0]._id, // 3D Attractive Pot
        name: seededProducts[0].name,
        price: seededProducts[0].price,
        quantity: 1
      },
      {
        product: seededProducts[6]._id, // Boho Beard Mug
        name: seededProducts[6].name,
        price: seededProducts[6].price,
        quantity: 1
      }
    ]
  });
  console.log(`[Seed] Seeded sample order. ID: ${sampleOrder._id}`);
};

seedData();
