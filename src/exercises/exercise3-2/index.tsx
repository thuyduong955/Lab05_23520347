/**
 * Exercise 3.2 Demo Page
 */

import { PortalDemo, portalStyles } from './Modal';

const styles = `
  ${portalStyles}

  .exercise-3-2 {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
  }

  .exercise-3-2 h1 {
    color: #1976d2;
    margin-bottom: 20px;
  }

  .exercise-3-2 h2 {
    color: #333333;
    margin-top: 30px;
  }

  .exercise-3-2 > p {
    color: #333333;
  }

  .exercise-3-2 code {
    background: #e3f2fd;
    color: #1565c0;
    padding: 2px 6px;
    border-radius: 4px;
  }

  .explanation {
    background: #e3f2fd;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 30px;
  }

  .explanation h3 {
    margin-top: 0;
    color: #1565c0;
  }

  .explanation ul,
  .explanation ol {
    color: #333333;
    margin: 10px 0;
    padding-left: 25px;
  }

  .explanation li {
    color: #333333;
    margin: 8px 0;
  }

  .code-block {
    background: #263238;
    color: #aed581;
    padding: 15px;
    border-radius: 8px;
    overflow-x: auto;
    font-family: 'Fira Code', monospace;
    font-size: 13px;
    margin-top: 15px;
  }
`;

export function Exercise3_2Demo() {
  return (
    <div className="exercise-3-2">
      <style>{styles}</style>

      <h1>🎯 Exercise 3.2: The "Trapdoor" Modal (Portals)</h1>

      <div className="explanation">
        <h3>📚 React Portal Concepts</h3>
        <ul>
          <li>
            <strong>createPortal(child, container)</strong>: 
            Render child into any container DOM node
          </li>
          <li>
            <strong>Escape CSS context</strong>: 
            overflow, z-index, transform don't affect it
          </li>
          <li>
            <strong>Event bubbling</strong>: 
            Events still bubble through React tree, not DOM tree!
          </li>
        </ul>

        <div className="code-block">
{`// How to use Portal
import { createPortal } from 'react-dom';

function Modal({ children }) {
  // Render children into document.body
  // instead of rendering in parent!
  return createPortal(
    <div className="modal-overlay">
      {children}
    </div>,
    document.body
  );
}`}
        </div>
      </div>

      <h2>🔬 Demo: Card with overflow:hidden</h2>
      <p>
        The card below has <code>overflow: hidden</code>. 
        Without Portal, the Modal would be clipped!
      </p>

      <PortalDemo />

      <div className="explanation" style={{ marginTop: '30px' }}>
        <h3>💡 Key Takeaways:</h3>
        <ol>
          <li>Portal renders DOM node in different location, but behavior is same as normal component</li>
          <li>Event bubbling through React tree allows parent to handle events from Portal</li>
          <li>Useful for: Modals, Tooltips, Dropdowns, Notifications</li>
          <li>Be careful with accessibility (focus management, keyboard navigation)</li>
        </ol>
      </div>
    </div>
  );
}

export default Exercise3_2Demo;
