/**
 * Exercise 2.1 Demo Page
 */

import { Dashboard, dashboardStyles } from './Dashboard';

const pageStyles = `
  .exercise-2-1-page {
    padding: 0;
  }

  .exercise-2-1-header {
    padding: 20px;
    background: #fff3e0;
    margin-bottom: 0;
  }

  .exercise-2-1-header h1 {
    color: #e65100;
    margin: 0 0 15px 0;
  }

  .exercise-2-1-info {
    background: #ffffff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }

  .exercise-2-1-info h3 {
    color: #1976d2;
    margin-top: 0;
    margin-bottom: 15px;
  }

  .exercise-2-1-info ul,
  .exercise-2-1-info ol {
    color: #333333;
    margin: 10px 0;
    padding-left: 25px;
  }

  .exercise-2-1-info li {
    color: #333333;
    margin: 8px 0;
  }

  .exercise-2-1-info p {
    color: #333333;
    margin: 10px 0;
  }

  .exercise-2-1-info code {
    background: #e3f2fd;
    color: #1565c0;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.9em;
  }

  .exercise-2-1-warning {
    background: #ffecb3;
    color: #5d4037;
    padding: 15px;
    border-radius: 8px;
    border-left: 4px solid #ff9800;
    margin-top: 15px;
  }

  .exercise-2-1-warning h3 {
    color: #e65100;
    margin: 0 0 10px 0;
  }
`;

export function Exercise2_1Demo() {
  return (
    <div className="exercise-2-1-page">
      <style>{dashboardStyles}</style>
      <style>{pageStyles}</style>
      
      <div className="exercise-2-1-header">
        <h1>🎯 Exercise 2.1: The Laggy List (useMemo & React.memo)</h1>
        
        <div className="exercise-2-1-info">
          <h3>📚 Key Concepts:</h3>
          <ul>
            <li><strong>React.memo</strong>: Higher-Order Component that prevents re-render when props don't change</li>
            <li><strong>useMemo</strong>: Caches computation result, only recalculates when dependencies change</li>
            <li><strong>Shallow comparison</strong>: Compares references, not deep compare</li>
          </ul>
          
          <h3>🔬 Experiment:</h3>
          <ol>
            <li>Open DevTools Console (F12)</li>
            <li>Click "Theme" or "Counter" → Should NOT see "Sorting..."</li>
            <li>Click "Sort by Value" → Should see "Sorting..."</li>
            <li>Watch log "ListItem X re-rendered" - with proper React.memo, it will reduce significantly</li>
          </ol>

          <div className="exercise-2-1-warning">
            <h3>⚠️ Note:</h3>
            <p>
              In this example, ListItem still re-renders because <code>onDelete</code> is a new function every render.
              This will be fixed in <strong>Exercise 2.2: useCallback</strong>!
            </p>
          </div>
        </div>
      </div>

      <Dashboard itemCount={1000} />
    </div>
  );
}

export default Exercise2_1Demo;
