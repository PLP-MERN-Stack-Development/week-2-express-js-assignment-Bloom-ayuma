const { v4: uuidv4 } = require('uuid');
const { NotFoundError } = require('../utils/errors');

let products = [];   // in‑memory store – replace with DB later!

/* GET /api/products  (with ?category=&page=&limit=) */
exports.getAllProducts = (req, res) => {
  let list = [...products];

  const { category, page = 1, limit = 10 } = req.query;

  if (category) {
    list = list.filter(
      p => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  const start = (page - 1) * limit;
  const paged = list.slice(start, start + Number(limit));

  res.json({
    total: list.length,
    page: Number(page),
    limit: Number(limit),
    data: paged
  });
};

/* GET /api/products/:id */
exports.getProductById = (req, res, next) => {
  const found = products.find(p => p.id === req.params.id);
  if (!found) return next(new NotFoundError('Product not found'));
  res.json(found);
};

/* POST /api/products */
exports.createProduct = (req, res) => {
  const { name, description, price, category, inStock } = req.body;
  const product = { id: uuidv4(), name, description, price, category, inStock };
  products.push(product);
  res.status(201).json(product);
};

/* PUT /api/products/:id */
exports.updateProduct = (req, res, next) => {
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return next(new NotFoundError('Product not found'));
  products[idx] = { ...products[idx], ...req.body };
  res.json(products[idx]);
};

/* DELETE /api/products/:id */
exports.deleteProduct = (req, res, next) => {
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return next(new NotFoundError('Product not found'));
  const deleted = products.splice(idx, 1);
  res.json(deleted[0]);
};

/* GET /api/products/search?name= */
exports.searchProducts = (req, res) => {
  const { name = '' } = req.query;
  const term = name.toLowerCase();
  const results = products.filter(p => p.name.toLowerCase().includes(term));
  res.json(results);
};

/* GET /api/products/stats */
exports.getProductStats = (req, res) => {
  const stats = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});
  res.json(stats);
};
