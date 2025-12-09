/**
 * Loading Spinner Component
 * Hiển thị khi đang lazy load module
 */

export function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Đang tải module...</p>
    </div>
  );
}

export default LoadingSpinner;
