/**
 * Exercise 4.2 Demo Page
 */

import { useState } from 'react';
import { ErrorBoundary, Bomb, BuggyCounter, errorBoundaryStyles } from './ErrorBoundary';

const styles = `
  ${errorBoundaryStyles}

  .exercise-4-2 {
    padding: 20px;
    max-width: 900px;
    margin: 0 auto;
  }

  .exercise-4-2 h1 {
    color: #1976d2;
    margin-bottom: 20px;
  }

  .demo-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    margin-top: 30px;
  }

  .demo-card {
    background: white;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  }

  .demo-card h3 {
    margin-top: 0;
    color: #1976d2;
  }

  .demo-card p {
    color: #333333;
  }

  .explanation {
    background: #e3f2fd;
    padding: 20px;
    border-radius: 10px;
  }

  .explanation h3 {
    color: #1565c0;
    margin-top: 0;
  }

  .explanation p {
    color: #333333;
  }

  .explanation ul {
    color: #333333;
    padding-left: 25px;
  }

  .explanation li {
    color: #333333;
    margin: 8px 0;
  }

  .explanation code {
    background: #bbdefb;
    color: #1565c0;
    padding: 2px 6px;
    border-radius: 4px;
  }

  .code-block {
    background: #263238;
    color: #aed581;
    padding: 15px;
    border-radius: 8px;
    overflow-x: auto;
    font-family: 'Fira Code', monospace;
    font-size: 12px;
    margin-top: 15px;
  }

  .toggle-bomb {
    padding: 10px 20px;
    margin: 10px 0;
    background: #ef5350;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
  }

  .toggle-bomb.safe {
    background: #4caf50;
  }

  @media (max-width: 700px) {
    .demo-grid {
      grid-template-columns: 1fr;
    }
  }
`;

export function Exercise4_2Demo() {
  const [bombArmed, setBombArmed] = useState(false);
  const [counterKey, setCounterKey] = useState(0);

  return (
    <div className="exercise-4-2">
      <style>{styles}</style>

      <h1>🎯 Exercise 4.2: Testing Error Boundaries</h1>

      <div className="explanation">
        <h3>📚 What is Error Boundary?</h3>
        <p>
          Error Boundary is "try/catch" for React components. 
          When an error occurs in the component tree, it catches the error and displays fallback UI 
          instead of crashing the entire app.
        </p>

        <ul>
          <li><strong>getDerivedStateFromError</strong>: Update state to render fallback</li>
          <li><strong>componentDidCatch</strong>: Log errors, send to monitoring service</li>
          <li>⚠️ MUST be a Class Component (no Hook equivalent yet)</li>
        </ul>

        <div className="code-block">
{`// Error Boundary cơ bản
class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}`}
        </div>
      </div>

      <div className="demo-grid">
        {/* Demo 1: Bomb Component */}
        <div className="demo-card">
          <h3>💣 Demo 1: Bomb Component</h3>
          <p>Click button to "arm the bomb" and see Error Boundary in action:</p>
          
          <button 
            className={`toggle-bomb ${!bombArmed ? 'safe' : ''}`}
            onClick={() => setBombArmed(!bombArmed)}
          >
            {bombArmed ? '🔴 Bomb is active!' : '🟢 Arm the bomb'}
          </button>

          <ErrorBoundary
            onReset={() => setBombArmed(false)}
            onError={(error) => console.log('Error caught:', error.message)}
          >
            <Bomb shouldExplode={bombArmed} />
          </ErrorBoundary>
        </div>

        {/* Demo 2: Buggy Counter */}
        <div className="demo-card">
          <h3>🔢 Demo 2: Buggy Counter</h3>
          <p>Counter will crash when it reaches 5:</p>
          
          <ErrorBoundary
            key={counterKey}
            onReset={() => setCounterKey(k => k + 1)}
          >
            <BuggyCounter maxCount={5} />
          </ErrorBoundary>
        </div>
      </div>

      <div className="explanation" style={{ marginTop: '30px' }}>
        <h3>⚠️ Error Boundary CANNOT catch:</h3>
        <ul>
          <li>Errors in event handlers (onClick, onChange, etc.)</li>
          <li>Errors in async code (setTimeout, Promises)</li>
          <li>Server-side rendering errors</li>
          <li>Errors in the Error Boundary itself</li>
        </ul>

        <h3>🧪 Test File:</h3>
        <p>
          <code>src/exercises/exercise4-2/ErrorBoundary.test.tsx</code>
        </p>
        <p>Run tests: <code>npm test</code></p>
      </div>
    </div>
  );
}

export default Exercise4_2Demo;
