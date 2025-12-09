/**
 * Exercise 2.1: The Laggy List (useMemo & React.memo)
 * 
 * Vấn đề: Component re-render không cần thiết gây lag
 * Giải pháp: 
 * - React.memo: Ngăn child component re-render khi props không đổi
 * - useMemo: Cache kết quả tính toán "đắt tiền"
 */

import { useState, useMemo, memo } from 'react';

// ============ PHẦN 1: ListItem Component ============

interface ListItemProps {
  id: number;
  name: string;
  value: number;
  onDelete: (id: number) => void;
}

/**
 * ❌ TRƯỚC: Component thường - re-render mỗi khi parent render
 */
// function ListItem({ id, name, value, onDelete }: ListItemProps) {
//   console.log(`🔄 ListItem ${id} re-rendered`);
//   return (
//     <div className="list-item">
//       <span>{name}</span>
//       <span>Value: {value}</span>
//       <button onClick={() => onDelete(id)}>🗑️</button>
//     </div>
//   );
// }

/**
 * ✅ SAU: Wrap với React.memo
 * 
 * React.memo làm gì?
 * - So sánh props cũ và mới (shallow comparison)
 * - Nếu props không đổi -> KHÔNG re-render!
 * - Giống như PureComponent trong class component
 */
const ListItem = memo(function ListItem({ 
  id, 
  name, 
  value, 
  onDelete 
}: ListItemProps) {
  // Log này sẽ giúp bạn thấy khi nào component thực sự render
  console.log(`🔄 ListItem ${id} re-rendered`);
  
  return (
    <div className="list-item">
      <span className="item-name">{name}</span>
      <span className="item-value">Value: {value}</span>
      <button onClick={() => onDelete(id)} className="delete-btn">
        🗑️
      </button>
    </div>
  );
});

// ============ PHẦN 2: Helper Functions ============

// Tạo danh sách items giả (10,000 items!)
function generateItems(count: number) {
  const items = [];
  for (let i = 0; i < count; i++) {
    items.push({
      id: i,
      name: `Item #${i + 1}`,
      value: Math.floor(Math.random() * 1000),
    });
  }
  return items;
}

/**
 * Hàm sort "đắt tiền" - mất thời gian để thực hiện
 * Trong thực tế có thể là: filter, map, reduce phức tạp
 */
function expensiveSortAlgorithm(
  items: Array<{ id: number; name: string; value: number }>,
  sortBy: 'name' | 'value'
) {
  console.log('⏳ Đang sort... (expensive operation)');
  const start = performance.now();

  // Tạo copy để không mutate original
  const sorted = [...items].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return a.value - b.value;
  });

  const end = performance.now();
  console.log(`✅ Sort xong trong ${(end - start).toFixed(2)}ms`);

  return sorted;
}

// ============ PHẦN 3: Dashboard Component ============

interface DashboardProps {
  itemCount?: number;
}

export function Dashboard({ itemCount = 1000 }: DashboardProps) {
  // State cho theme (không liên quan đến list)
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // State cho sort
  const [sortBy, setSortBy] = useState<'name' | 'value'>('name');
  
  // State cho items (giữ nguyên trong ví dụ này)
  const [items] = useState(() => generateItems(itemCount));

  // State để demo - bấm nút này sẽ trigger re-render
  const [counter, setCounter] = useState(0);

  /**
   * ❌ TRƯỚC: Sort lại MỖI KHI component render
   * Kể cả khi chỉ đổi theme!
   */
  // const sortedItems = expensiveSortAlgorithm(items, sortBy);

  /**
   * ✅ SAU: Dùng useMemo để cache kết quả
   * 
   * useMemo takes:
   * 1. Computation function
   * 2. Dependency array - only recalculates when dependencies change
   * 
   * In this case: only re-sort when items or sortBy changes
   * Theme change? Counter? -> No re-sorting!
   */
  const sortedItems = useMemo(() => {
    return expensiveSortAlgorithm(items, sortBy);
  }, [items, sortBy]); // <- Dependencies

  // Handler to delete item
  const handleDelete = (id: number) => {
    console.log(`Delete item ${id}`);
    // In practice: dispatch action or update state
  };

  // Only display first 100 items to avoid performance issues
  const displayItems = sortedItems.slice(0, 100);

  return (
    <div className={`dashboard ${theme}`}>
      {/* Header with controls */}
      <div className="dashboard-header">
        <h2>📊 Dashboard with {itemCount.toLocaleString()} items</h2>
        
        <div className="controls">
          {/* Theme Toggle - should NOT trigger re-sort */}
          <button 
            onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
            className="theme-btn"
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>

          {/* Sort buttons - SHOULD trigger re-sort */}
          <button 
            onClick={() => setSortBy('name')}
            className={sortBy === 'name' ? 'active' : ''}
          >
            Sort by Name
          </button>
          <button 
            onClick={() => setSortBy('value')}
            className={sortBy === 'value' ? 'active' : ''}
          >
            Sort by Value
          </button>

          {/* Counter to test re-render */}
          <button onClick={() => setCounter(c => c + 1)}>
            Counter: {counter}
          </button>
        </div>
      </div>

      {/* Info box */}
      <div className="info-box">
        <p>
          👀 <strong>Open Console (F12)</strong> to monitor:
        </p>
        <ul>
          <li>Click "Theme" or "Counter" → <strong>should NOT</strong> see "Sorting..."</li>
          <li>Click "Sort by..." → <strong>should</strong> see "Sorting..."</li>
          <li>With proper React.memo → ListItem only logs when props actually change</li>
        </ul>
      </div>

      {/* List hiển thị */}
      <div className="items-list">
        <p className="showing-info">
          Hiển thị {displayItems.length} / {items.length} items 
          (sorted by {sortBy})
        </p>
        
        {displayItems.map(item => (
          <ListItem
            key={item.id}
            id={item.id}
            name={item.name}
            value={item.value}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

// ============ CSS Styles ============
export const dashboardStyles = `
  .dashboard {
    padding: 20px;
    min-height: 100vh;
    transition: all 0.3s ease;
  }

  .dashboard.light {
    background: #f5f5f5;
    color: #333;
  }

  .dashboard.dark {
    background: #1a1a2e;
    color: #eee;
  }

  .dashboard-header {
    margin-bottom: 20px;
  }

  .controls {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 10px;
  }

  .controls button {
    padding: 8px 16px;
    border: 1px solid #ddd;
    border-radius: 5px;
    cursor: pointer;
    background: white;
    transition: all 0.2s;
  }

  .dashboard.dark .controls button {
    background: #16213e;
    color: white;
    border-color: #0f3460;
  }

  .controls button:hover {
    background: #e3f2fd;
  }

  .controls button.active {
    background: #1976d2;
    color: white;
    border-color: #1976d2;
  }

  .theme-btn {
    background: #ff9800 !important;
    color: white !important;
    border-color: #ff9800 !important;
  }

  .info-box {
    background: #e8f5e9;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    border-left: 4px solid #4caf50;
    color: #333333;
  }

  .info-box p {
    color: #333333;
    margin: 0;
  }

  .dashboard.dark .info-box {
    background: #1b4332;
    color: #d8f3dc;
  }

  .dashboard.dark .info-box p {
    color: #d8f3dc;
  }

  .info-box ul {
    margin: 10px 0 0 0;
    padding-left: 20px;
    color: #333333;
  }

  .info-box li {
    color: #333333;
  }

  .dashboard.dark .info-box ul,
  .dashboard.dark .info-box li {
    color: #d8f3dc;
  }

  .items-list {
    background: white;
    border-radius: 10px;
    padding: 15px;
    max-height: 500px;
    overflow-y: auto;
  }

  .dashboard.dark .items-list {
    background: #16213e;
  }

  .showing-info {
    color: #555555;
    margin-bottom: 15px;
    font-size: 14px;
  }

  .dashboard.dark .showing-info {
    color: #aaaaaa;
  }

  .list-item {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    border-bottom: 1px solid #eee;
    gap: 15px;
  }

  .dashboard.dark .list-item {
    border-bottom-color: #0f3460;
  }

  .list-item:hover {
    background: #f5f5f5;
  }

  .dashboard.dark .list-item:hover {
    background: #0f3460;
  }

  .item-name {
    flex: 1;
    font-weight: 500;
  }

  .item-value {
    color: #1976d2;
    font-family: monospace;
    min-width: 100px;
  }

  .delete-btn {
    padding: 5px 10px;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 16px;
    opacity: 0.5;
    transition: opacity 0.2s;
  }

  .delete-btn:hover {
    opacity: 1;
  }
`;

export default Dashboard;
