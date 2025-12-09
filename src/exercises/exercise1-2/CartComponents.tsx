/**
 * Shopping Cart Components
 * 
 * Components using Redux to manage shopping cart
 */

import { useAppDispatch, useAppSelector } from './hooks';
import {
  addItem,
  removeItem,
  clearCart,
  selectCartItems,
  selectTotalAmount,
  selectCartTax,
  selectTotalWithTax,
  selectCartItemCount,
} from './cartSlice';

// ============ Sample Products ============
const SAMPLE_PRODUCTS = [
  { id: 'p1', name: 'React T-Shirt', price: 299000, image: '👕' },
  { id: 'p2', name: 'TypeScript Cap', price: 199000, image: '🧢' },
  { id: 'p3', name: 'Redux Sneakers', price: 599000, image: '👟' },
  { id: 'p4', name: 'Vite Bag', price: 399000, image: '👜' },
];

// ============ Product Card Component ============
interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
}

function ProductCard({ id, name, price, image }: ProductCardProps) {
  // useAppDispatch to send actions to store
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    // Dispatch addItem action with product info as payload
    dispatch(addItem({ id, name, price, image }));
  };

  return (
    <div className="product-card">
      <div className="product-image">{image}</div>
      <h3>{name}</h3>
      <p className="price">{price.toLocaleString('en-US')}$</p>
      <button onClick={handleAddToCart} className="add-btn">
        🛒 Add to Cart
      </button>
    </div>
  );
}

// ============ Cart Item Component ============
interface CartItemRowProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

function CartItemRow({ id, name, price, quantity, image }: CartItemRowProps) {
  const dispatch = useAppDispatch();

  return (
    <div className="cart-item">
      <span className="item-image">{image || '📦'}</span>
      <div className="item-info">
        <span className="item-name">{name}</span>
        <span className="item-price">{price.toLocaleString('en-US')}$</span>
      </div>
      <div className="quantity-controls">
        <button onClick={() => dispatch(removeItem(id))}>➖</button>
        <span>{quantity}</span>
        <button onClick={() => dispatch(addItem({ id, name, price, image }))}>➕</button>
      </div>
      <span className="item-total">
        {(price * quantity).toLocaleString('en-US')}$
      </span>
    </div>
  );
}

// ============ Shopping Cart Component ============
function ShoppingCart() {
  const dispatch = useAppDispatch();
  
  // Use selectors to get data from store
  const items = useAppSelector(selectCartItems);
  const totalAmount = useAppSelector(selectTotalAmount);
  const tax = useAppSelector(selectCartTax); // Memoized selector!
  const totalWithTax = useAppSelector(selectTotalWithTax);
  const itemCount = useAppSelector(selectCartItemCount);

  return (
    <div className="shopping-cart">
      <div className="cart-header">
        <h2>🛒 Shopping Cart ({itemCount} items)</h2>
        {items.length > 0 && (
          <button onClick={() => dispatch(clearCart())} className="clear-btn">
            🗑️ Clear All
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="empty-cart">Your cart is empty! Add some products 🛍️</p>
      ) : (
        <>
          <div className="cart-items">
            {items.map((item) => (
              <CartItemRow key={item.id} {...item} />
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>{totalAmount.toLocaleString('en-US')}$</span>
            </div>
            <div className="summary-row">
              <span>Tax (10%):</span>
              <span>{tax.toLocaleString('en-US')}$</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>{totalWithTax.toLocaleString('en-US')}$</span>
            </div>
          </div>

          <button className="checkout-btn">
            💳 Checkout
          </button>
        </>
      )}
    </div>
  );
}

// ============ Product List Component ============
function ProductList() {
  return (
    <div className="product-list">
      <h2>🏪 Store</h2>
      <div className="products-grid">
        {SAMPLE_PRODUCTS.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}

// ============ Main Export ============
export { ProductList, ShoppingCart };
