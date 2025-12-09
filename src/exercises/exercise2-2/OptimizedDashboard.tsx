/**
 * Exercise 2.2: Stabilization (useCallback)
 * 
 * Vấn đề từ Exercise 2.1:
 * - ListItem dùng React.memo nhưng vẫn re-render
 * - Lý do: onDelete là function mới mỗi lần parent render
 * 
 * Giải pháp: useCallback
 * - Giữ reference của function ổn định giữa các lần render
 * - Function chỉ tạo mới khi dependencies thay đổi
 */

import { useState, useMemo, useCallback, memo } from 'react';

// ============ PHẦN 1: ListItem với React.memo ============

interface ListItemProps {
  id: number;
  name: string;
  value: number;
  onDelete: (id: number) => void;
}

/**
 * React.memo: Chỉ re-render khi props thay đổi
 * 
 * Với useCallback ở parent, onDelete reference sẽ ổn định
 * -> ListItem KHÔNG re-render khi theme hoặc counter thay đổi!
 */
const ListItem = memo(function ListItem({ 
  id, 
  name, 
  value, 
  onDelete 
}: ListItemProps) {
  // Log để verify - nên KHÔNG thấy log này khi bấm Theme/Counter
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

function expensiveSortAlgorithm(
  items: Array<{ id: number; name: string; value: number }>,
  sortBy: 'name' | 'value'
) {
  console.log('⏳ Đang sort...');
  const sorted = [...items].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return a.value - b.value;
  });
  return sorted;
}

// ============ PHẦN 3: Dashboard với useCallback ============

interface OptimizedDashboardProps {
  itemCount?: number;
}

export function OptimizedDashboard({ itemCount = 100 }: OptimizedDashboardProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [sortBy, setSortBy] = useState<'name' | 'value'>('name');
  const [items, setItems] = useState(() => generateItems(itemCount));
  const [counter, setCounter] = useState(0);

  // useMemo cho việc sort
  const sortedItems = useMemo(() => {
    return expensiveSortAlgorithm(items, sortBy);
  }, [items, sortBy]);

  /**
   * ❌ TRƯỚC: Function mới mỗi lần render
   * -> React.memo của ListItem bị phá vỡ!
   */
  // const handleDelete = (id: number) => {
  //   setItems(prev => prev.filter(item => item.id !== id));
  // };

  /**
   * ✅ SAU: useCallback giữ reference ổn định
   * 
   * useCallback(fn, deps) === useMemo(() => fn, deps)
   * 
   * Chỉ tạo function mới khi dependencies thay đổi
   * Trong trường hợp này: dependency array rỗng []
   * -> Function KHÔNG BAO GIỜ tạo mới!
   * 
   * Lưu ý: Dùng functional update setItems(prev => ...)
   * để không cần phụ thuộc vào items
   */
  const handleDelete = useCallback((id: number) => {
    console.log(`🗑️ Deleting item ${id}`);
    setItems(prev => prev.filter(item => item.id !== id));
  }, []); // <- Empty dependency array!

  // Callback cho các buttons - cũng nên wrap với useCallback
  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'light' ? 'dark' : 'light');
  }, []);

  const incrementCounter = useCallback(() => {
    setCounter(c => c + 1);
  }, []);

  const displayItems = sortedItems.slice(0, 50);

  return (
    <div className={`dashboard ${theme}`}>
      <div className="dashboard-header">
        <h2>📊 Optimized Dashboard ({items.length} items)</h2>
        
        <div className="controls">
          <button onClick={toggleTheme} className="theme-btn">
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>

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

          <button onClick={incrementCounter}>
            Counter: {counter}
          </button>
        </div>
      </div>

      <div className="info-box success">
        <p>✅ <strong>Đã fix bằng useCallback!</strong></p>
        <ul>
          <li>Bấm "Theme" hoặc "Counter" → <strong>KHÔNG</strong> có ListItem nào re-render!</li>
          <li>Bấm "Sort by..." → ListItem re-render vì data thay đổi</li>
          <li>Bấm "🗑️" xóa item → Chỉ items còn lại re-render</li>
        </ul>
      </div>

      {/* Render count indicator */}
      <div className="render-count">
        <span>Theme: {theme}</span>
        <span>Counter: {counter}</span>
        <span>Items: {items.length}</span>
      </div>

      <div className="items-list">
        <p className="showing-info">
          Hiển thị {displayItems.length} / {items.length} items
        </p>
        
        {displayItems.map(item => (
          <ListItem
            key={item.id}
            id={item.id}
            name={item.name}
            value={item.value}
            onDelete={handleDelete} // <- Reference ổn định nhờ useCallback!
          />
        ))}
      </div>
    </div>
  );
}

// ============ CSS (reuse từ Exercise 2.1) ============
export const optimizedDashboardStyles = `
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
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    border-left: 4px solid;
  }

  .info-box.success {
    background: #e8f5e9;
    border-left-color: #4caf50;
  }

  .dashboard.dark .info-box.success {
    background: #1b4332;
    color: #d8f3dc;
  }

  .render-count {
    display: flex;
    gap: 20px;
    padding: 10px;
    background: #fff3e0;
    border-radius: 5px;
    margin-bottom: 15px;
    font-family: monospace;
  }

  .dashboard.dark .render-count {
    background: #3d2914;
  }

  .items-list {
    background: white;
    border-radius: 10px;
    padding: 15px;
    max-height: 400px;
    overflow-y: auto;
  }

  .dashboard.dark .items-list {
    background: #16213e;
  }

  .showing-info {
    color: #666;
    margin-bottom: 15px;
    font-size: 14px;
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
    background: #ffebee;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.2s;
  }

  .delete-btn:hover {
    background: #ef5350;
  }
`;

export default OptimizedDashboard;
