/**
 * Exercise 4.2: Testing Error Boundaries
 * 
 * Error Boundary: Bắt lỗi JavaScript trong component tree
 * Hiển thị fallback UI thay vì crash toàn app
 * 
 * Lưu ý: Error Boundaries PHẢI là Class Component
 * (React chưa có Hook equivalent cho componentDidCatch)
 */

import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

// ============ PHẦN 1: Error Boundary Class Component ============

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary - Class Component để bắt lỗi
 * 
 * Lifecycle methods:
 * - static getDerivedStateFromError: Update state khi có lỗi
 * - componentDidCatch: Log lỗi (side effects)
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  /**
   * getDerivedStateFromError
   * - Được gọi khi có error trong child
   * - Return state mới để render fallback UI
   * - KHÔNG được có side effects ở đây!
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * componentDidCatch
   * - Được gọi sau getDerivedStateFromError
   * - Nơi để log error, gửi đến monitoring service (Sentry, etc.)
   * - CÓ THỂ có side effects
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error
    console.error('🔴 ErrorBoundary caught an error:', error);
    console.error('📍 Component stack:', errorInfo.componentStack);

    // Gọi callback nếu có
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * Reset error state
   * Cho phép user "Try again"
   */
  handleReset = () => {
    this.setState({ hasError: false, error: null });
    
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    // Nếu có lỗi -> render fallback
    if (this.state.hasError) {
      // Custom fallback từ props
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="error-boundary-fallback">
          <div className="error-icon">💥</div>
          <h2>Oops! Có lỗi xảy ra</h2>
          <p className="error-message">
            {this.state.error?.message || 'Unknown error'}
          </p>
          <button onClick={this.handleReset} className="retry-btn">
            🔄 Thử lại
          </button>
        </div>
      );
    }

    // Không có lỗi -> render children bình thường
    return this.props.children;
  }
}

// ============ PHẦN 2: "Bomb" Component để test ============

interface BombProps {
  shouldExplode?: boolean;
}

/**
 * Bomb Component - Throw error khi shouldExplode = true
 * Dùng để test Error Boundary
 */
export function Bomb({ shouldExplode = true }: BombProps) {
  if (shouldExplode) {
    throw new Error('💣 BOOM! Component đã nổ!');
  }
  
  return (
    <div className="bomb-safe">
      ✅ Component an toàn, không có lỗi!
    </div>
  );
}

// ============ PHẦN 3: Counter Component có thể lỗi ============

interface BuggyCounterProps {
  maxCount?: number;
}

/**
 * BuggyCounter - Counter sẽ throw error khi đếm quá max
 */
export function BuggyCounter({ maxCount = 5 }: BuggyCounterProps) {
  const [count, setCount] = React.useState(0);

  if (count >= maxCount) {
    throw new Error(`Counter vượt quá giới hạn ${maxCount}!`);
  }

  return (
    <div className="buggy-counter">
      <p>Count: {count}</p>
      <p className="hint">
        (Sẽ crash khi count = {maxCount})
      </p>
      <button onClick={() => setCount(c => c + 1)}>
        ➕ Tăng count
      </button>
    </div>
  );
}

// Import React for useState in BuggyCounter
import React from 'react';

// ============ CSS Styles ============
export const errorBoundaryStyles = `
  .error-boundary-fallback {
    padding: 40px;
    text-align: center;
    background: #ffebee;
    border: 2px solid #ef5350;
    border-radius: 15px;
    max-width: 400px;
    margin: 20px auto;
  }

  .error-icon {
    font-size: 60px;
    margin-bottom: 15px;
  }

  .error-boundary-fallback h2 {
    color: #c62828;
    margin-bottom: 10px;
  }

  .error-message {
    background: #fff;
    padding: 10px 15px;
    border-radius: 8px;
    font-family: monospace;
    color: #c62828;
    margin: 15px 0;
  }

  .retry-btn {
    padding: 12px 30px;
    background: #1976d2;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .retry-btn:hover {
    background: #1565c0;
    transform: translateY(-2px);
  }

  .bomb-safe {
    padding: 20px;
    background: #e8f5e9;
    border-radius: 10px;
    text-align: center;
    font-size: 18px;
  }

  .buggy-counter {
    padding: 20px;
    background: #fff3e0;
    border-radius: 10px;
    text-align: center;
  }

  .buggy-counter p {
    font-size: 24px;
    font-weight: bold;
    margin: 0 0 10px 0;
  }

  .buggy-counter .hint {
    font-size: 14px;
    color: #666;
    font-weight: normal;
  }

  .buggy-counter button {
    padding: 10px 20px;
    background: #ff9800;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
  }

  .buggy-counter button:hover {
    background: #f57c00;
  }
`;

export default ErrorBoundary;
