const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '../../data');

// Helper to ensure data folder exists
const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
};

const getFilePath = (name) => {
  return path.join(DATA_DIR, `${name.toLowerCase()}s.json`);
};

const readData = (name) => {
  ensureDataDir();
  const filePath = getFilePath(name);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    return [];
  }
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    return [];
  }
};

const writeData = (name, data) => {
  ensureDataDir();
  const filePath = getFilePath(name);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Chainable query class mimicking Mongoose Query behavior
class QueryChain {
  constructor(data, name) {
    this.data = JSON.parse(JSON.stringify(data)); // Deep copy
    this.name = name;
  }

  populate(field) {
    if (field === 'category') {
      const categories = readData('Category');
      this.data = this.data.map(p => {
        const catId = (p.category && typeof p.category === 'object') ? p.category._id : p.category;
        const cat = categories.find(c => c._id === catId);
        p.category = cat ? { _id: cat._id, name: cat.name } : null;
        return p;
      });
    }
    return this;
  }

  skip(n) {
    this.data = this.data.slice(n);
    return this;
  }

  limit(n) {
    this.data = this.data.slice(0, n);
    return this;
  }

  sort(options) {
    // Sort by createdAt descending by default (which aligns with our API specs)
    this.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return this;
  }

  // Make it thenable (Promise compatible for await)
  then(onResolve) {
    return Promise.resolve(this.data).then(onResolve);
  }
}

// Fallback models definition
const fallbackModels = {
  User: {
    find: (query = {}) => {
      const users = readData('User');
      return new QueryChain(users, 'User');
    },
    findOne: async (query = {}) => {
      const users = readData('User');
      const found = users.find(u => {
        if (query.username && u.username !== query.username) return false;
        if (query.email && u.email !== query.email) return false;
        if (query.$or) {
          return query.$or.some(cond => {
            if (cond.email && u.email === cond.email) return true;
            if (cond.username && u.username === cond.username) return true;
            return false;
          });
        }
        return true;
      });
      
      if (found) {
        // Attach instance method
        found.matchPassword = async function(enteredPassword) {
          return await bcrypt.compare(enteredPassword, this.password);
        };
        return found;
      }
      return null;
    },
    findById: async (id) => {
      const users = readData('User');
      const found = users.find(u => u._id === id.toString());
      if (found) {
        found.matchPassword = async function(enteredPassword) {
          return await bcrypt.compare(enteredPassword, this.password);
        };
        return found;
      }
      return null;
    },
    create: async (data) => {
      const users = readData('User');
      const newUser = {
        _id: 'u_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      users.push(newUser);
      writeData('User', users);

      newUser.matchPassword = async function(enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password);
      };
      return newUser;
    },
    deleteMany: async () => {
      writeData('User', []);
      return { deletedCount: 0 };
    }
  },

  Category: {
    find: (query = {}) => {
      const categories = readData('Category');
      return new QueryChain(categories, 'Category');
    },
    findOne: async (query = {}) => {
      const categories = readData('Category');
      const found = categories.find(c => {
        if (query.name && c.name !== query.name) return false;
        return true;
      });
      return found || null;
    },
    findById: async (id) => {
      const categories = readData('Category');
      const found = categories.find(c => c._id === id.toString());
      return found || null;
    },
    create: async (data) => {
      const categories = readData('Category');
      const newCat = {
        _id: 'c_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      categories.push(newCat);
      writeData('Category', categories);
      return newCat;
    },
    insertMany: async (arr) => {
      const categories = readData('Category');
      const newItems = arr.map(item => ({
        _id: 'c_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      categories.push(...newItems);
      writeData('Category', categories);
      return newItems;
    },
    deleteMany: async () => {
      writeData('Category', []);
      return { deletedCount: 0 };
    }
  },

  Product: {
    countDocuments: async (query = {}) => {
      let products = readData('Product');
      if (query.category) {
        products = products.filter(p => p.category === query.category.toString());
      }
      return products.length;
    },
    find: (query = {}) => {
      let products = readData('Product');
      if (query.category) {
        products = products.filter(p => p.category === query.category.toString());
      }
      return new QueryChain(products, 'Product');
    },
    findById: async (id) => {
      const products = readData('Product');
      const found = products.find(p => p._id === id.toString());
      if (found) {
        // Populate category name
        const categories = readData('Category');
        const cat = categories.find(c => c._id === found.category);
        const populated = {
          ...found,
          category: cat ? { _id: cat._id, name: cat.name } : null
        };
        // Add save instance method
        populated.save = async function() {
          const allProds = readData('Product');
          const idx = allProds.findIndex(p => p._id === this._id);
          if (idx !== -1) {
            const toSave = { ...this };
            if (this.category && typeof this.category === 'object') {
              toSave.category = this.category._id;
            }
            toSave.updatedAt = new Date().toISOString();
            allProds[idx] = toSave;
            writeData('Product', allProds);
          }
          return this;
        };
        return populated;
      }
      return null;
    },
    create: async (data) => {
      const products = readData('Product');
      const category = data.category || data.categoryId;
      const newProd = {
        _id: 'p_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        ...data,
        category,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      products.push(newProd);
      writeData('Product', products);
      return newProd;
    },
    insertMany: async (arr) => {
      const products = readData('Product');
      const newItems = arr.map(item => ({
        _id: 'p_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      products.push(...newItems);
      writeData('Product', products);
      return newItems;
    },
    findByIdAndUpdate: async (id, data, options) => {
      const products = readData('Product');
      const idx = products.findIndex(p => p._id === id.toString());
      if (idx !== -1) {
        products[idx] = {
          ...products[idx],
          ...data,
          updatedAt: new Date().toISOString()
        };
        writeData('Product', products);
        return products[idx];
      }
      return null;
    },
    findByIdAndDelete: async (id) => {
      let products = readData('Product');
      const found = products.find(p => p._id === id.toString());
      products = products.filter(p => p._id !== id.toString());
      writeData('Product', products);
      return found;
    },
    deleteMany: async () => {
      writeData('Product', []);
      return { deletedCount: 0 };
    }
  },

  Order: {
    find: (query = {}) => {
      const orders = readData('Order');
      return new QueryChain(orders, 'Order');
    },
    findById: async (id) => {
      const orders = readData('Order');
      const found = orders.find(o => o._id === id.toString());
      if (found) {
        found.save = async function() {
          const allOrders = readData('Order');
          const idx = allOrders.findIndex(o => o._id === this._id);
          if (idx !== -1) {
            this.updatedAt = new Date().toISOString();
            allOrders[idx] = this;
            writeData('Order', allOrders);
          }
          return this;
        };
        return found;
      }
      return null;
    },
    create: async (data) => {
      const orders = readData('Order');
      const newOrder = {
        _id: 'o_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      orders.push(newOrder);
      writeData('Order', orders);
      return newOrder;
    },
    deleteMany: async () => {
      writeData('Order', []);
      return { deletedCount: 0 };
    }
  }
};

const getFallbackModel = (name) => {
  return fallbackModels[name];
};

module.exports = { getFallbackModel };
