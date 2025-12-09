/**
 * Exercise 2.3: Route-Based Code Splitting
 * 
 * Problem: Bundle too large (5MB), slow on first load
 * Solution: 
 * - React.lazy: Dynamic import component
 * - Suspense: Display fallback while loading
 * - Code splitting: Bundler automatically splits into chunks
 */

import { Suspense, lazy, useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { HomePage } from './HomePage';

/**
 * ❌ BEFORE: Static import - loads immediately with main bundle
 */
// import { AdminPanel } from './AdminPanel';

/**
 * ✅ AFTER: Dynamic import with React.lazy
 * 
 * React.lazy takes a function that returns a Promise
 * This function calls dynamic import()
 * Bundler (Vite/Webpack) will create separate chunk for AdminPanel
 */
const AdminPanel = lazy(() => {
  console.log('📥 Starting to download AdminPanel chunk...');
  
  // Add fake delay to see loading spinner
  return new Promise<{ default: React.ComponentType }>(resolve => {
    setTimeout(() => {
      import('./AdminPanel').then(module => {
        console.log('✅ AdminPanel chunk loaded!');
        resolve(module);
      });
    }, 1500); // 1.5s delay for demo
  });
});

// Styles
const styles = `
  .code-splitting-demo {
    min-height: 100vh;
    background: #f5f5f5;
  }

  .demo-header {
    background: #1976d2;
    color: white;
    padding: 20px;
  }

  .demo-header h1 {
    margin: 0 0 10px 0;
  }

  .explanation {
    background: rgba(255,255,255,0.15);
    padding: 15px;
    border-radius: 8px;
    margin-top: 15px;
    color: #ffffff;
  }

  .explanation ul {
    margin: 10px 0;
    padding-left: 20px;
    color: #ffffff;
  }

  .explanation li {
    color: #ffffff;
  }

  .explanation p {
    color: #ffffff;
  }

  /* Navigation */
  .nav-bar {
    background: white;
    padding: 10px 20px;
    display: flex;
    gap: 10px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }

  .nav-bar button {
    padding: 10px 20px;
    border: none;
    background: #e3f2fd;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
  }

  .nav-bar button:hover {
    background: #bbdefb;
  }

  .nav-bar button.active {
    background: #1976d2;
    color: white;
  }

  /* Loading Spinner */
  .loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100px 20px;
  }

  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #e3f2fd;
    border-top-color: #1976d2;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Pages */
  .page-container {
    padding: 20px;
  }

  .home-page, .admin-panel {
    background: white;
    border-radius: 10px;
    padding: 30px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    color: #333333;
  }

  .home-page h2, .admin-panel h2,
  .home-page h3, .admin-panel h3 {
    color: #1976d2;
  }

  .home-page p, .admin-panel p {
    color: #333333;
  }

  .home-content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-top: 20px;
  }

  .feature-card {
    text-align: center;
    padding: 20px;
    background: #f5f5f5;
    border-radius: 10px;
  }

  .feature-card span {
    font-size: 40px;
  }

  /* Admin Panel styles */
  .load-info {
    background: #e8f5e9;
    padding: 15px;
    border-radius: 8px;
    border-left: 4px solid #4caf50;
  }

  .admin-tabs {
    display: flex;
    gap: 10px;
    margin: 20px 0;
  }

  .admin-tabs button {
    padding: 10px 20px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 5px;
    cursor: pointer;
  }

  .admin-tabs button.active {
    background: #1976d2;
    color: white;
    border-color: #1976d2;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin: 20px 0;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 20px;
    background: #f5f5f5;
    border-radius: 10px;
  }

  .stat-icon {
    font-size: 40px;
  }

  .stat-value {
    display: block;
    font-size: 24px;
    font-weight: bold;
    color: #1976d2;
  }

  .stat-label {
    color: #666;
    font-size: 14px;
  }

  .fake-chart {
    background: #f5f5f5;
    padding: 20px;
    border-radius: 10px;
    margin-top: 20px;
  }

  .chart-bars {
    display: flex;
    align-items: flex-end;
    height: 200px;
    gap: 20px;
    padding-top: 20px;
  }

  .chart-bar {
    flex: 1;
    background: linear-gradient(to top, #1976d2, #64b5f6);
    border-radius: 5px 5px 0 0;
    position: relative;
    transition: height 0.3s;
  }

  .bar-label {
    position: absolute;
    bottom: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    color: #666;
  }

  @media (max-width: 768px) {
    .home-content, .stats-grid {
      grid-template-columns: 1fr 1fr;
    }
  }
`;

export function Exercise2_3Demo() {
  const [currentPage, setCurrentPage] = useState<'home' | 'admin'>('home');

  return (
    <div className="code-splitting-demo">
      <style>{styles}</style>

      <div className="demo-header">
        <h1>🎯 Exercise 2.3: Route-Based Code Splitting</h1>
        
        <div className="explanation">
          <strong>📚 Key Concepts:</strong>
          <ul>
            <li><strong>React.lazy()</strong>: Dynamic import component</li>
            <li><strong>Suspense</strong>: Display fallback UI while loading</li>
            <li><strong>Code Splitting</strong>: Bundler automatically splits code into chunks</li>
          </ul>
          <p>
            👉 Open <strong>Network tab</strong> (F12) → Click "Admin" → 
            See new chunk file being downloaded!
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="nav-bar">
        <button 
          className={currentPage === 'home' ? 'active' : ''}
          onClick={() => setCurrentPage('home')}
        >
          🏠 Home (Static Import)
        </button>
        <button 
          className={currentPage === 'admin' ? 'active' : ''}
          onClick={() => setCurrentPage('admin')}
        >
          ⚙️ Admin (Lazy Load)
        </button>
      </nav>

      {/* Page Content */}
      <div className="page-container">
        {currentPage === 'home' && <HomePage />}
        
        {currentPage === 'admin' && (
          /**
           * Suspense wraps lazy component
           * fallback: UI displayed while downloading chunk
           */
          <Suspense fallback={<LoadingSpinner />}>
            <AdminPanel />
          </Suspense>
        )}
      </div>
    </div>
  );
}

export default Exercise2_3Demo;
