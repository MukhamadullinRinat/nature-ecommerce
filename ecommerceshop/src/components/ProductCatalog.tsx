import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import productService from '../services/productService';
import type { Product } from '../types/Product';

const ProductCatalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, searchTerm]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (selectedCategory) filters.category = selectedCategory;
      if (searchTerm) filters.search = searchTerm;

      const response = await productService.getProducts(filters);
      setProducts(response.products);
      setError(null);
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const cats = await productService.getCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const handleProductClick = (productId: string) => {
    // For now, just log the product ID
    // In a real app, this would navigate to product detail page
    console.log('Product clicked:', productId);
    const product = products.find(p => p.id === productId);
    if (product) {
      alert(`Product: ${product.name}\nPrice: $${product.price}\nDescription: ${product.description}`);
    }
  };

  if (loading) {
    return (
      <div className="catalog-container">
        <div className="loading">🌿 Loading natural products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="catalog-container">
        <div className="error">❌ {error}</div>
        <button onClick={loadProducts} className="retry-button">
          🔄 Retry
        </button>
      </div>
    );
  }

  return (
    <div className="catalog-container">
      <header className="catalog-header">
        <h1>🌿 Nature E-Commerce Catalog</h1>
        <p>Discover beautiful natural products from leaves to trees</p>
      </header>

      <div className="catalog-filters">
        <div className="search-filter">
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-filter">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="catalog-stats">
        <p>Showing {products.length} products</p>
      </div>

     <div className="products-grid">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onProductClick={handleProductClick}
          />
        ))}
      </div>

      {products.length === 0 && (
        <div className="no-products">
          <p>🍃 No products found matching your criteria.</p>
          <button 
            onClick={() => {
              setSelectedCategory('');
              setSearchTerm('');
            }}
            className="clear-filters-button"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;
