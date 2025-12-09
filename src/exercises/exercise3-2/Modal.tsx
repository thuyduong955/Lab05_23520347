/**
 * Exercise 3.2: The "Trapdoor" Modal (Portals)
 * 
 * Vấn đề: Modal bị cắt (clip) bởi parent có overflow: hidden
 * Giải pháp: React Portal - render component vào DOM node khác
 * 
 * createPortal(child, container):
 * - child: React element cần render
 * - container: DOM node để render vào (thường là document.body)
 * 
 * Đặc biệt: Event vẫn bubble theo React tree, không phải DOM tree!
 */

import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// ============ PHẦN 1: Modal Component với Portal ============

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

/**
 * Modal sử dụng createPortal
 * Render trực tiếp vào document.body, thoát khỏi parent's CSS context
 */
export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  // Xử lý ESC key để đóng modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // Prevent body scroll khi modal mở
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Không render gì nếu modal đóng
  if (!isOpen) return null;

  // Tạo modal element
  const modalElement = (
    <div className="modal-overlay" onClick={onClose}>
      {/* stopPropagation để click trong modal không đóng modal */}
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <h2>{title || 'Modal'}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        
        {/* Body */}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );

  /**
   * ⭐ createPortal - "Cánh cửa bí mật"
   * 
   * Render modalElement vào document.body
   * thay vì render trong parent component!
   * 
   * Điều này giúp modal thoát khỏi:
   * - overflow: hidden của parent
   * - z-index stacking context
   * - CSS transforms
   */
  return createPortal(modalElement, document.body);
}

// ============ PHẦN 2: Demo Component - Card với overflow:hidden ============

interface CardProps {
  children: ReactNode;
  onClick?: () => void;
}

/**
 * Card có overflow: hidden - sẽ clip bất kỳ content nào vượt ra ngoài
 * Nếu không dùng Portal, modal sẽ bị cắt!
 */
function ClippedCard({ children, onClick }: CardProps) {
  return (
    <div 
      className="clipped-card"
      onClick={onClick}
      style={{
        overflow: 'hidden', // Đây là vấn đề!
        position: 'relative',
      }}
    >
      {children}
    </div>
  );
}

// ============ PHẦN 3: Demo Event Bubbling ============

export function PortalDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickLogs, setClickLogs] = useState<string[]>([]);

  // Handler cho parent div - để demo event bubbling
  const handleParentClick = () => {
    const log = `🔔 [${new Date().toLocaleTimeString()}] Parent div clicked!`;
    setClickLogs(prev => [...prev.slice(-4), log]);
    console.log(log);
  };

  // Handler cho modal button
  const handleModalButtonClick = () => {
    const log = `🎯 [${new Date().toLocaleTimeString()}] Button inside Modal clicked!`;
    setClickLogs(prev => [...prev.slice(-4), log]);
    console.log(log);
  };

  return (
    <div>
      {/* 
        Parent div với onClick
        Event từ Modal (Portal) vẫn bubble lên đây!
        Mặc dù Modal render ở document.body
      */}
      <div 
        className="parent-container"
        onClick={handleParentClick}
      >
        <h3>📦 Parent Container (có onClick listener)</h3>
        <p className="note">
          Click vào button trong Modal → Event vẫn bubble lên đây!
        </p>

        {/* Card có overflow:hidden */}
        <ClippedCard>
          <h4>🃏 Card với <code>overflow: hidden</code></h4>
          <p>Modal mở từ đây sẽ bị clip nếu không dùng Portal!</p>
          <button 
            onClick={(e) => {
              e.stopPropagation(); // Ngăn bubble lên parent
              setIsModalOpen(true);
            }}
            className="open-modal-btn"
          >
            🚪 Mở Modal (Portal)
          </button>
        </ClippedCard>

        {/* Event Log */}
        <div className="event-log">
          <h4>📋 Event Log:</h4>
          {clickLogs.length === 0 ? (
            <p className="empty-log">Chưa có event nào...</p>
          ) : (
            <ul>
              {clickLogs.map((log, i) => (
                <li key={i}>{log}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Modal - render qua Portal vào document.body */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="🎉 Modal thành công!"
      >
        <div className="modal-demo-content">
          <p>
            ✅ Modal này được render qua <strong>Portal</strong> vào <code>document.body</code>
          </p>
          <p>
            Nó đã thoát khỏi <code>overflow: hidden</code> của Card!
          </p>
          
          <div className="event-bubble-demo">
            <h4>🔬 Thí nghiệm Event Bubbling:</h4>
            <p>
              Click button dưới đây và xem Event Log ở parent!
            </p>
            <button 
              onClick={handleModalButtonClick}
              className="demo-btn"
            >
              Click để test Event Bubbling
            </button>
            <p className="hint">
              👆 Mặc dù Modal render ở document.body, 
              event vẫn bubble theo React tree!
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ============ CSS Styles ============
export const portalStyles = `
  /* Parent Container */
  .parent-container {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 30px;
    border-radius: 15px;
    color: white;
  }

  .parent-container h3 {
    margin-top: 0;
  }

  .parent-container .note {
    background: rgba(255,255,255,0.2);
    padding: 10px;
    border-radius: 5px;
    font-size: 14px;
  }

  /* Clipped Card */
  .clipped-card {
    background: white;
    color: #333;
    padding: 20px;
    border-radius: 10px;
    margin: 20px 0;
    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
  }

  .clipped-card h4 {
    margin-top: 0;
  }

  .clipped-card code {
    background: #ffebee;
    color: #c62828;
    padding: 2px 6px;
    border-radius: 3px;
  }

  .open-modal-btn {
    padding: 12px 24px;
    background: #1976d2;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .open-modal-btn:hover {
    background: #1565c0;
    transform: translateY(-2px);
  }

  /* Event Log */
  .event-log {
    background: rgba(0,0,0,0.3);
    padding: 15px;
    border-radius: 10px;
    margin-top: 20px;
  }

  .event-log h4 {
    margin: 0 0 10px 0;
  }

  .event-log ul {
    margin: 0;
    padding-left: 20px;
  }

  .event-log li {
    font-family: monospace;
    font-size: 13px;
    padding: 3px 0;
  }

  .empty-log {
    color: rgba(255,255,255,0.5);
    font-style: italic;
    margin: 0;
  }

  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .modal-content {
    background: white;
    border-radius: 15px;
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
    animation: slideIn 0.3s ease;
    box-shadow: 0 20px 50px rgba(0,0,0,0.3);
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-50px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #eee;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 20px;
  }

  .modal-close {
    width: 35px;
    height: 35px;
    border: none;
    background: #f5f5f5;
    border-radius: 50%;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .modal-close:hover {
    background: #ef5350;
    color: white;
  }

  .modal-body {
    padding: 20px;
  }

  .modal-demo-content p {
    line-height: 1.6;
  }

  .modal-demo-content code {
    background: #e3f2fd;
    color: #1976d2;
    padding: 2px 6px;
    border-radius: 3px;
  }

  .event-bubble-demo {
    background: #fff3e0;
    padding: 20px;
    border-radius: 10px;
    margin-top: 20px;
    border: 2px dashed #ff9800;
  }

  .event-bubble-demo h4 {
    margin-top: 0;
    color: #e65100;
  }

  .demo-btn {
    padding: 12px 24px;
    background: #ff9800;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .demo-btn:hover {
    background: #f57c00;
  }

  .hint {
    font-size: 13px;
    color: #666;
    font-style: italic;
    margin-top: 15px;
    margin-bottom: 0;
  }
`;

export default Modal;
