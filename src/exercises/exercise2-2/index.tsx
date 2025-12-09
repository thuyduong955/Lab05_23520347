/**
 * Exercise 2.2 Demo Page
 */

import { OptimizedDashboard, optimizedDashboardStyles } from './OptimizedDashboard';

const pageStyles = `
  .exercise-2-2-page {
    padding: 0;
  }

  .exercise-2-2-header {
    padding: 20px;
    background: #e8f5e9;
    margin-bottom: 0;
  }

  .exercise-2-2-header h1 {
    color: #2e7d32;
    margin: 0 0 15px 0;
  }

  .exercise-2-2-info {
    background: #ffffff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }

  .exercise-2-2-info h3 {
    color: #1976d2;
    margin-top: 0;
    margin-bottom: 15px;
  }

  .exercise-2-2-info ul {
    color: #333333;
    margin: 10px 0;
    padding-left: 25px;
  }

  .exercise-2-2-info li {
    color: #333333;
    margin: 8px 0;
  }

  .exercise-2-2-code {
    background: #263238;
    color: #aed581;
    padding: 15px;
    border-radius: 8px;
    overflow-x: auto;
    font-family: 'Fira Code', 'Consolas', monospace;
    font-size: 13px;
    line-height: 1.5;
    margin: 15px 0;
  }

  .exercise-2-2-warning {
    background: #fff3e0;
    padding: 15px;
    border-radius: 8px;
    border-left: 4px solid #ff9800;
    margin-top: 15px;
  }

  .exercise-2-2-warning h3 {
    color: #e65100;
    margin: 0 0 10px 0;
  }

  .exercise-2-2-warning li {
    color: #5d4037;
  }
`;

export function Exercise2_2Demo() {
  return (
    <div className="exercise-2-2-page">
      <style>{optimizedDashboardStyles}</style>
      <style>{pageStyles}</style>
      
      <div className="exercise-2-2-header">
        <h1>🎯 Exercise 2.2: Stabilization (useCallback)</h1>
        
        <div className="exercise-2-2-info">
          <h3>📚 useCallback Concepts:</h3>
          
          <pre className="exercise-2-2-code">
{`// ❌ BEFORE: New function every render
const handleDelete = (id) => {
  setItems(prev => prev.filter(item => item.id !== id));
};
// -> Breaks React.memo of child!

// ✅ AFTER: useCallback keeps stable reference
const handleDelete = useCallback((id) => {
  setItems(prev => prev.filter(item => item.id !== id));
}, []); // <- Empty dependencies because using functional update`}
          </pre>

          <h3>🔑 When to use useCallback?</h3>
          <ul>
            <li>When passing function to child component with React.memo</li>
            <li>When function is a dependency of useEffect</li>
            <li>When function is used in event listener</li>
          </ul>

          <div className="exercise-2-2-warning">
            <h3>⚠️ Note:</h3>
            <ul>
              <li>Don't overuse! useCallback has overhead</li>
              <li>Only use when really necessary</li>
              <li>Dependency array must be accurate</li>
            </ul>
          </div>
        </div>
      </div>

      <OptimizedDashboard itemCount={100} />
    </div>
  );
}

export default Exercise2_2Demo;
