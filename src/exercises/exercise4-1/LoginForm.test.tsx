/**
 * Exercise 4.1: Integration Testing - LoginForm Tests
 * 
 * React Testing Library Philosophy:
 * "The more your tests resemble the way your software is used,
 *  the more confidence they can give you."
 * 
 * Key Principles:
 * 1. Test user behavior, NOT implementation details
 * 2. Query by role, label, or text - như user thấy
 * 3. Sử dụng userEvent thay vì fireEvent
 * 4. waitFor và findBy cho async operations
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  /**
   * Test 1: Render đúng UI
   * Kiểm tra các elements có xuất hiện không
   */
  it('renders login form with all fields', () => {
    // ARRANGE: Render component
    render(<LoginForm />);

    // ASSERT: Kiểm tra các elements tồn tại
    // Dùng getByRole - tìm theo accessibility role
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    
    // Password input có role khác
    expect(screen.getByLabelText(/mật khẩu/i)).toBeInTheDocument();
    
    // Button
    expect(screen.getByRole('button', { name: /đăng nhập/i })).toBeInTheDocument();
  });

  /**
   * Test 2: Validation - Email trống
   */
  it('shows error when email is empty', async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<LoginForm />);

    // ACT: Click submit mà không nhập gì
    await user.click(screen.getByRole('button', { name: /đăng nhập/i }));

    // ASSERT: Error message xuất hiện
    expect(screen.getByText(/email là bắt buộc/i)).toBeInTheDocument();
  });

  /**
   * Test 3: Validation - Password quá ngắn
   */
  it('shows error when password is too short', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    // Nhập email hợp lệ
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'test@example.com');
    
    // Nhập password ngắn
    await user.type(screen.getByLabelText(/mật khẩu/i), '123');
    
    // Submit
    await user.click(screen.getByRole('button', { name: /đăng nhập/i }));

    // Assert
    expect(screen.getByText(/mật khẩu phải có ít nhất 6 ký tự/i)).toBeInTheDocument();
  });

  /**
   * Test 4: Submit thành công
   * Đây là INTEGRATION TEST - test toàn bộ flow
   */
  it('shows success message on successful login', async () => {
    // ARRANGE: Setup user và mock API
    const user = userEvent.setup();
    
    // Mock login function
    const mockLogin = vi.fn().mockResolvedValue({
      success: true,
      message: 'Welcome back, test@example.com!',
    });

    render(<LoginForm onLogin={mockLogin} />);

    // ACT: Nhập form và submit
    // userEvent.type simulates real typing (keydown, keypress, input, keyup)
    await user.type(
      screen.getByRole('textbox', { name: /email/i }),
      'test@example.com'
    );
    
    await user.type(
      screen.getByLabelText(/mật khẩu/i),
      'password123'
    );
    
    await user.click(screen.getByRole('button', { name: /đăng nhập/i }));

    // ASSERT: Check success message
    // findByText returns Promise - waits for element to appear
    const successMessage = await screen.findByText(/welcome back/i);
    expect(successMessage).toBeInTheDocument();

    // Verify API được gọi đúng
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(mockLogin).toHaveBeenCalledTimes(1);
  });

  /**
   * Test 5: Hiển thị loading state
   */
  it('shows loading state while submitting', async () => {
    const user = userEvent.setup();
    
    // Mock API chậm
    const slowMockLogin = vi.fn().mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ success: true, message: 'OK' }), 1000))
    );

    render(<LoginForm onLogin={slowMockLogin} />);

    // Fill form
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'test@example.com');
    await user.type(screen.getByLabelText(/mật khẩu/i), 'password123');
    
    // Submit
    await user.click(screen.getByRole('button', { name: /đăng nhập/i }));

    // Button should show loading
    expect(screen.getByRole('button', { name: /đang đăng nhập/i })).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  /**
   * Test 6: Hiển thị error khi API fail
   */
  it('shows error message when login fails', async () => {
    const user = userEvent.setup();
    
    // Mock API error
    const failingMockLogin = vi.fn().mockRejectedValue(
      new Error('Invalid credentials')
    );

    render(<LoginForm onLogin={failingMockLogin} />);

    // Fill and submit
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'wrong@example.com');
    await user.type(screen.getByLabelText(/mật khẩu/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /đăng nhập/i }));

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  /**
   * ANTI-PATTERN CHECK:
   * ❌ Không test internal state
   * ❌ Không test implementation details
   * ✅ Chỉ test những gì user thấy và tương tác
   */
});

/**
 * Summary - Các phương pháp query của RTL:
 * 
 * 1. getBy*: Throw error nếu không tìm thấy (sync)
 *    - getByRole, getByLabelText, getByText, getByPlaceholderText
 * 
 * 2. queryBy*: Return null nếu không tìm thấy (sync)
 *    - Dùng khi muốn assert element KHÔNG tồn tại
 * 
 * 3. findBy*: Return Promise, wait for element (async)
 *    - Dùng cho elements xuất hiện sau async operation
 * 
 * Priority Order (theo RTL recommendations):
 * 1. Accessible by everyone: getByRole, getByLabelText, getByPlaceholderText
 * 2. Semantic: getByText, getByDisplayValue
 * 3. Test IDs: getByTestId (last resort)
 */
