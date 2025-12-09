/**
 * Exercise 3.1: The Compound Tabs Component
 * 
 * Compound Components Pattern:
 * - Giống như <select> và <option> trong HTML
 * - Các component con chia sẻ state qua Context
 * - API linh hoạt cho người dùng component
 * 
 * Cấu trúc:
 * <Tabs>
 *   <Tabs.List>
 *     <Tabs.Tab index={0}>Tab 1</Tabs.Tab>
 *   </Tabs.List>
 *   <Tabs.Panel index={0}>Content 1</Tabs.Panel>
 * </Tabs>
 */

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// ============ BƯỚC 1: Tạo Context ============

/**
 * TabsContext chứa:
 * - activeIndex: index của tab đang active
 * - setActiveIndex: function để đổi tab
 */
interface TabsContextType {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

// Tạo context với giá trị mặc định là undefined
// (sẽ check và throw error nếu dùng bên ngoài Tabs)
const TabsContext = createContext<TabsContextType | undefined>(undefined);

/**
 * Custom hook để sử dụng TabsContext
 * Throws error nếu dùng bên ngoài <Tabs>
 */
function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error(
      '❌ Tabs compound components phải được dùng bên trong <Tabs>!'
    );
  }
  return context;
}

// ============ BƯỚC 2: Parent Component - Tabs ============

interface TabsProps {
  children: ReactNode;
  defaultIndex?: number;
  className?: string;
}

/**
 * Tabs - Parent component, giữ state và cung cấp Context
 */
function Tabs({ children, defaultIndex = 0, className = '' }: TabsProps) {
  // State cho active tab index
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  // Giá trị context
  const value: TabsContextType = {
    activeIndex,
    setActiveIndex,
  };

  return (
    // Provider bọc tất cả children
    <TabsContext.Provider value={value}>
      <div className={`tabs-container ${className}`}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

// ============ BƯỚC 3: Tabs.List - Container cho các Tab buttons ============

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

function TabsList({ children, className = '' }: TabsListProps) {
  return (
    <div className={`tabs-list ${className}`} role="tablist">
      {children}
    </div>
  );
}

// ============ BƯỚC 4: Tabs.Tab - Từng tab button ============

interface TabProps {
  children: ReactNode;
  index: number;
  className?: string;
  disabled?: boolean;
}

function Tab({ children, index, className = '', disabled = false }: TabProps) {
  // Sử dụng context để biết tab nào đang active
  const { activeIndex, setActiveIndex } = useTabsContext();
  
  const isActive = activeIndex === index;

  const handleClick = () => {
    if (!disabled) {
      setActiveIndex(index);
    }
  };

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled}
      className={`tab-button ${isActive ? 'active' : ''} ${disabled ? 'disabled' : ''} ${className}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// ============ BƯỚC 5: Tabs.Panel - Nội dung của từng tab ============

interface TabPanelProps {
  children: ReactNode;
  index: number;
  className?: string;
}

function TabPanel({ children, index, className = '' }: TabPanelProps) {
  // Chỉ render nếu tab này đang active
  const { activeIndex } = useTabsContext();
  
  if (activeIndex !== index) {
    return null; // Không render nếu không active
  }

  return (
    <div 
      role="tabpanel"
      className={`tab-panel ${className}`}
    >
      {children}
    </div>
  );
}

// ============ BƯỚC 6: Gắn sub-components vào Tabs ============

/**
 * Pattern: Gắn sub-components như properties của parent
 * Cho phép: <Tabs.List>, <Tabs.Tab>, <Tabs.Panel>
 */
Tabs.List = TabsList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;

// ============ CSS Styles ============
export const tabsStyles = `
  .tabs-container {
    width: 100%;
  }

  .tabs-list {
    display: flex;
    gap: 5px;
    border-bottom: 2px solid #e0e0e0;
    padding-bottom: 0;
  }

  .tab-button {
    padding: 12px 24px;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: #666;
    position: relative;
    transition: all 0.2s ease;
    border-radius: 8px 8px 0 0;
  }

  .tab-button:hover:not(.disabled) {
    background: #f5f5f5;
    color: #333;
  }

  .tab-button.active {
    color: #1976d2;
    background: #e3f2fd;
  }

  .tab-button.active::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: #1976d2;
  }

  .tab-button.disabled {
    color: #bbb;
    cursor: not-allowed;
  }

  .tab-panel {
    padding: 20px;
    background: #fafafa;
    border-radius: 0 0 8px 8px;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Variant: Pills style */
  .tabs-container.pills .tabs-list {
    border-bottom: none;
    gap: 10px;
    padding: 5px;
    background: #f5f5f5;
    border-radius: 10px;
  }

  .tabs-container.pills .tab-button {
    border-radius: 8px;
  }

  .tabs-container.pills .tab-button.active {
    background: white;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }

  .tabs-container.pills .tab-button.active::after {
    display: none;
  }

  .tabs-container.pills .tab-panel {
    background: transparent;
    padding: 20px 0;
  }
`;

export { Tabs };
export default Tabs;
