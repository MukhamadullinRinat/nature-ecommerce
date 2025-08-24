import type { Product } from '../types/Product';

interface ProductCardProps {
  product: Product;
  onProductClick: (id: string) => void;
}

const ProductCard = ({ product, onProductClick }: ProductCardProps) => {
  return (
    <div 
      className="product-card"
      onClick={() => onProductClick(product.id)}
      style={{ cursor: 'pointer' }}
    >
      <div className="product-image">
        <img 
          src={product.images[0]} 
          alt={product.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-nature.svg';
          }}
        />
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <p className="product-description">{product.description}</p>
        
        <div className="product-characteristics">
          {Object.entries(product.characteristics).slice(0, 2).map(([key, value]) => (
            <span key={key} className="characteristic-tag">
              <strong>{key}:</strong> {Array.isArray(value) ? value.join(', ') : value}
            </span>
          ))}
        </div>
        
        <div className="product-footer">
          <span className="product-price">
            {product.currency} ${product.price.toFixed(2)}
          </span>
          <span className={`stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
            {product.inStock ? `${product.quantity} in stock` : 'Out of stock'}
          </span>
        </div>
        
        <div className="product-tags">
          {product.tags.slice(0, 3).map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
