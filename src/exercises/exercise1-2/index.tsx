/**
 * Exercise 1.2 Demo Page
 * Shopping Cart with Redux Toolkit
 */

import { Provider } from 'react-redux';
import { store } from './store';
import { ProductList, ShoppingCart } from './CartComponents';

// CSS Styles
const styles = `
  .exercise-1-2 {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .shop-layout {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 30px;
    margin-top: 20px;
  }

  /* Product List */
  .product-list h2 {
    margin-bottom: 20px;
  }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  .product-card {
    background: white;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 15px;
    text-align: center;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .product-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }

  .product-image {
    font-size: 50px;
    margin-bottom: 10px;
  }

  .product-card h3 {
    margin: 10px 0;
    font-size: 16px;
  }

  .product-card .price {
    color: #e53935;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .add-btn {
    background: #4caf50;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
  }

  .add-btn:hover {
    background: #43a047;
  }

  /* Shopping Cart */
  .shopping-cart {
    background: #f5f5f5;
    border-radius: 10px;
    padding: 20px;
    position: sticky;
    top: 20px;
  }

  .cart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .cart-header h2 {
    margin: 0;
    font-size: 18px;
  }

  .clear-btn {
    background: #ef5350;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px;
  }

  .empty-cart {
    text-align: center;
    color: #666;
    padding: 40px 0;
  }

  .cart-items {
    max-height: 300px;
    overflow-y: auto;
  }

  .cart-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    background: white;
    border-radius: 8px;
    margin-bottom: 10px;
  }

  .item-image {
    font-size: 24px;
  }

  .item-info {
    flex: 1;
  }

  .item-name {
    display: block;
    font-size: 14px;
    font-weight: 500;
  }

  .item-price {
    display: block;
    font-size: 12px;
    color: #666;
  }

  .quantity-controls {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .quantity-controls button {
    width: 24px;
    height: 24px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 12px;
  }

  .item-total {
    font-weight: bold;
    color: #e53935;
    min-width: 80px;
    text-align: right;
  }

  .cart-summary {
    border-top: 2px dashed #ddd;
    margin-top: 15px;
    padding-top: 15px;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
  }

  .summary-row.total {
    font-weight: bold;
    font-size: 18px;
    color: #1976d2;
    border-top: 1px solid #ddd;
    margin-top: 10px;
    padding-top: 10px;
  }

  .checkout-btn {
    width: 100%;
    padding: 12px;
    background: #1976d2;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 15px;
  }

  .checkout-btn:hover {
    background: #1565c0;
  }

  /* Explanation */
  .explanation {
    background: #e3f2fd;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 20px;
  }

  .explanation h3 {
    margin-top: 0;
  }

  .explanation ul {
    margin: 0;
    padding-left: 20px;
  }

  .explanation li {
    margin: 5px 0;
  }

  @media (max-width: 900px) {
    .shop-layout {
      grid-template-columns: 1fr;
    }
    
    .shopping-cart {
      position: static;
    }
  }
`;

export function Exercise1_2Demo() {
  return (
    // Provider bọc toàn bộ app để cung cấp store
    <Provider store={store}>
      <style>{styles}</style>
      <div className="exercise-1-2">
        <h1>🎯 Exercise 1.2: Redux Toolkit Shopping Cart</h1>

        <div className="explanation">
          <h3>📚 Redux Toolkit Concepts:</h3>
          <ul>
            <li><strong>configureStore</strong>: Create store with default configuration</li>
            <li><strong>createSlice</strong>: Create reducer + actions automatically</li>
            <li><strong>useSelector</strong>: Read data from store</li>
            <li><strong>useDispatch</strong>: Send action to store</li>
            <li><strong>createSelector</strong>: Memoized selector - only recalculates when input changes</li>
          </ul>
          <p>💡 <strong>Open Console (F12)</strong> to see log "Calculating tax..." only runs when totalAmount changes!</p>
        </div>

        <div className="shop-layout">
          <ProductList />
          <ShoppingCart />
        </div>
      </div>
    </Provider>
  );
}

export default Exercise1_2Demo;
