/**
 * AdminPanel - Component "nặng"
 * 
 * Giả lập một trang Admin phức tạp với nhiều thư viện charts
 * Trong thực tế: có thể include chart.js, recharts, d3, etc.
 */

import { useState } from 'react';

// Giả lập "heavy" import
console.log('📦 AdminPanel module loaded!');

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState('overview');

  // Giả lập data
  const stats = {
    users: 12453,
    orders: 3421,
    revenue: 1234567890,
    growth: 23.5,
  };

  return (
    <div className="admin-panel">
      <h1>⚙️ Admin Panel</h1>
      
      <p className="load-info">
        ✅ Module này đã được load thành công!<br/>
        (Kiểm tra Network tab để thấy chunk riêng)
      </p>

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </button>
        <button 
          className={activeTab === 'settings' ? 'active' : ''}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Settings
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <span className="stat-value">{stats.users.toLocaleString()}</span>
            <span className="stat-label">Total Users</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <span className="stat-value">{stats.orders.toLocaleString()}</span>
            <span className="stat-label">Orders</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <span className="stat-value">{stats.revenue.toLocaleString('vi-VN')}đ</span>
            <span className="stat-label">Revenue</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <span className="stat-value">+{stats.growth}%</span>
            <span className="stat-label">Growth</span>
          </div>
        </div>
      </div>

      {/* Fake Chart */}
      <div className="fake-chart">
        <h3>📊 Revenue Chart (Giả lập)</h3>
        <div className="chart-bars">
          {[65, 45, 80, 55, 90, 75, 85].map((height, i) => (
            <div 
              key={i} 
              className="chart-bar"
              style={{ height: `${height}%` }}
            >
              <span className="bar-label">{['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
