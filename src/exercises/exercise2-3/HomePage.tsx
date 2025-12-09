/**
 * Simple Home Page Component
 * Trang chủ nhẹ - load ngay lập tức
 */

export function HomePage() {
  return (
    <div className="home-page">
      <h1>🏠 Trang chủ</h1>
      <p>Đây là trang chủ - load ngay lập tức vì là static import</p>
      
      <div className="home-content">
        <div className="feature-card">
          <span>🚀</span>
          <h3>Nhanh</h3>
          <p>Initial bundle nhỏ, load nhanh hơn</p>
        </div>
        
        <div className="feature-card">
          <span>📦</span>
          <h3>Code Splitting</h3>
          <p>Chỉ load code khi cần thiết</p>
        </div>
        
        <div className="feature-card">
          <span>⚡</span>
          <h3>Lazy Loading</h3>
          <p>React.lazy + Suspense</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
