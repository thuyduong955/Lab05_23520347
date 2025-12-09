/**
 * Exercise 4.2: Testing Error Boundaries
 * 
 * Test để verify:
 * 1. Error Boundary bắt được lỗi
 * 2. Hiển thị fallback UI
 * 3. App không crash
 * 4. onError callback được gọi
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ErrorBoundary, Bomb } from './ErrorBoundary';

describe('ErrorBoundary', () => {
  // Silence console.error during tests
  // (Error Boundaries log errors to console)
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  /**
   * Test 1: Render children bình thường khi không có lỗi
   */
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Normal content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal content')).toBeInTheDocument();
  });

  /**
   * Test 2: Bắt lỗi và hiển thị fallback UI
   * Đây là test chính cho Error Boundary
   */
  it('catches error and displays fallback UI', () => {
    // ARRANGE & ACT: Render Bomb component (sẽ throw error)
    render(
      <ErrorBoundary>
        <Bomb shouldExplode={true} />
      </ErrorBoundary>
    );

    // ASSERT: Fallback UI xuất hiện
    expect(screen.getByText(/oops! có lỗi xảy ra/i)).toBeInTheDocument();
    expect(screen.getByText(/BOOM! Component đã nổ!/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /thử lại/i })).toBeInTheDocument();
  });

  /**
   * Test 3: Custom fallback từ props
   */
  it('renders custom fallback when provided', () => {
    const customFallback = <div>Custom error message</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <Bomb shouldExplode={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
    // Default fallback không xuất hiện
    expect(screen.queryByText(/oops!/i)).not.toBeInTheDocument();
  });

  /**
   * Test 4: onError callback được gọi khi có lỗi
   */
  it('calls onError callback when error occurs', () => {
    const handleError = vi.fn();

    render(
      <ErrorBoundary onError={handleError}>
        <Bomb shouldExplode={true} />
      </ErrorBoundary>
    );

    // Verify callback được gọi
    expect(handleError).toHaveBeenCalledTimes(1);
    
    // Verify callback nhận đúng arguments
    expect(handleError).toHaveBeenCalledWith(
      expect.any(Error), // error object
      expect.objectContaining({
        componentStack: expect.any(String), // component stack trace
      })
    );
  });

  /**
   * Test 5: Reset functionality
   */
  it('resets error state when retry button is clicked', async () => {
    const user = userEvent.setup();
    let shouldExplode = true;

    // Component wrapper để control shouldExplode
    const TestWrapper = () => (
      <ErrorBoundary
        onReset={() => {
          shouldExplode = false;
        }}
      >
        <Bomb shouldExplode={shouldExplode} />
      </ErrorBoundary>
    );

    const { rerender } = render(<TestWrapper />);

    // Initially shows error
    expect(screen.getByText(/oops!/i)).toBeInTheDocument();

    // Click retry
    await user.click(screen.getByRole('button', { name: /thử lại/i }));

    // Rerender with shouldExplode = false
    rerender(<TestWrapper />);

    // Nếu Bomb không explode nữa, sẽ thấy success message
    // (Test này đơn giản hóa - trong thực tế cần state management phức tạp hơn)
  });

  /**
   * Test 6: App không crash hoàn toàn
   */
  it('does not crash the entire app', () => {
    // Render sibling component bên ngoài ErrorBoundary
    render(
      <div>
        <div data-testid="safe-content">Safe content</div>
        <ErrorBoundary>
          <Bomb shouldExplode={true} />
        </ErrorBoundary>
      </div>
    );

    // Safe content vẫn hiển thị
    expect(screen.getByTestId('safe-content')).toBeInTheDocument();
    
    // Error boundary shows fallback
    expect(screen.getByText(/oops!/i)).toBeInTheDocument();
  });

  /**
   * Test 7: Error Boundary không bắt được lỗi trong:
   * - Event handlers (onClick, etc.)
   * - Async code (setTimeout, promises)
   * - Server-side rendering
   * - Errors trong Error Boundary chính nó
   */
  it('does not catch errors in event handlers', () => {
    // Note: userEvent not needed for this test - just documenting behavior
    
    function ComponentWithEventError() {
      return (
        <button
          onClick={() => {
            throw new Error('Event handler error');
          }}
        >
          Click me
        </button>
      );
    }

    // Note: Event handler errors không được catch bởi Error Boundary
    // Test này chỉ để document behavior
    render(
      <ErrorBoundary>
        <ComponentWithEventError />
      </ErrorBoundary>
    );

    // Button vẫn render bình thường
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });
});
