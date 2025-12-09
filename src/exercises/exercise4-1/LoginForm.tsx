/**
 * Exercise 4.1: Integration Testing a Form
 * 
 * LoginForm Component - để test với React Testing Library
 */

import { useState } from 'react';

// ============ Mock API Function ============
/**
 * Giả lập API login
 * - Delay 1 giây để simulate network
 * - Return success nếu email hợp lệ
 * - Return error nếu email = "error@test.com"
 */
export async function loginAPI(email: string, _password: string): Promise<{ success: boolean; message: string }> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate error case
  if (email === 'error@test.com') {
    throw new Error('Invalid credentials');
  }
  
  // Simulate success
  return {
    success: true,
    message: `Welcome back, ${email}!`,
  };
}

// ============ LoginForm Component ============

interface LoginFormProps {
  onLogin?: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
}

export function LoginForm({ onLogin = loginAPI }: LoginFormProps) {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Validation
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Validate email
  const validateEmail = (value: string): boolean => {
    if (!value) {
      setEmailError('Email là bắt buộc');
      return false;
    }
    if (!value.includes('@')) {
      setEmailError('Email không hợp lệ');
      return false;
    }
    setEmailError(null);
    return true;
  };

  // Validate password
  const validatePassword = (value: string): boolean => {
    if (!value) {
      setPasswordError('Mật khẩu là bắt buộc');
      return false;
    }
    if (value.length < 6) {
      setPasswordError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }
    setPasswordError(null);
    return true;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    setSuccessMessage(null);

    // Validate
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    // Submit
    setIsLoading(true);
    
    try {
      const result = await onLogin(email, password);
      setSuccessMessage(result.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>🔐 Đăng nhập</h2>

      {/* Success Message */}
      {successMessage && (
        <div className="alert success" role="alert">
          ✅ {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert error" role="alert">
          ❌ {error}
        </div>
      )}

      {/* Email Field */}
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => validateEmail(email)}
          placeholder="your@email.com"
          disabled={isLoading}
          aria-invalid={!!emailError}
          aria-describedby={emailError ? 'email-error' : undefined}
        />
        {emailError && (
          <span id="email-error" className="field-error">
            {emailError}
          </span>
        )}
      </div>

      {/* Password Field */}
      <div className="form-group">
        <label htmlFor="password">Mật khẩu</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => validatePassword(password)}
          placeholder="••••••"
          disabled={isLoading}
          aria-invalid={!!passwordError}
          aria-describedby={passwordError ? 'password-error' : undefined}
        />
        {passwordError && (
          <span id="password-error" className="field-error">
            {passwordError}
          </span>
        )}
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        className="submit-btn"
        disabled={isLoading}
      >
        {isLoading ? '⏳ Đang đăng nhập...' : '🚀 Đăng nhập'}
      </button>
    </form>
  );
}

// ============ CSS Styles ============
export const loginFormStyles = `
  .login-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 30px;
    background: white;
    border-radius: 15px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  }

  .login-form h2 {
    text-align: center;
    margin-bottom: 25px;
    color: #333;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #333;
  }

  .form-group input {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.2s;
    box-sizing: border-box;
  }

  .form-group input:focus {
    outline: none;
    border-color: #1976d2;
    box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
  }

  .form-group input[aria-invalid="true"] {
    border-color: #ef5350;
  }

  .form-group input:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }

  .field-error {
    display: block;
    color: #ef5350;
    font-size: 13px;
    margin-top: 5px;
  }

  .alert {
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-weight: 500;
  }

  .alert.success {
    background: #e8f5e9;
    color: #2e7d32;
    border: 1px solid #a5d6a7;
  }

  .alert.error {
    background: #ffebee;
    color: #c62828;
    border: 1px solid #ef9a9a;
  }

  .submit-btn {
    width: 100%;
    padding: 15px;
    background: #1976d2;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .submit-btn:hover:not(:disabled) {
    background: #1565c0;
    transform: translateY(-2px);
  }

  .submit-btn:disabled {
    background: #bdbdbd;
    cursor: not-allowed;
    transform: none;
  }
`;

export default LoginForm;
