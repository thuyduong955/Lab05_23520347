/**
 * Exercise 1.1 Demo Page
 * Demo page for UserProfile component
 */

import { useState } from 'react';
import { UserProfile, userProfileStyles } from './UserProfile';

const exerciseStyles = `
  .exercise-demo {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
  }

  .exercise-demo h1 {
    color: #1976d2;
    margin-bottom: 20px;
  }

  .exercise-demo .controls {
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    margin: 20px 0;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }

  .exercise-demo .controls h3 {
    margin-top: 0;
    color: #333;
  }

  .exercise-demo .button-group {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .exercise-demo .button-group button {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    background: #1976d2;
    color: white;
    transition: all 0.2s;
  }

  .exercise-demo .button-group button:hover {
    background: #1565c0;
    transform: translateY(-2px);
  }

  .exercise-demo .button-group .error-btn {
    background: #ef5350;
  }

  .exercise-demo .button-group .error-btn:hover {
    background: #c62828;
  }

  .exercise-demo .demo-area {
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    margin: 20px 0;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }

  .exercise-demo .demo-area h3 {
    margin-top: 0;
    color: #333;
  }

  .exercise-demo .code-explanation {
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    margin: 20px 0;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }

  .exercise-demo .code-explanation h3 {
    margin-top: 0;
    color: #333;
  }

  .exercise-demo .code-explanation pre {
    background: #263238;
    color: #aed581;
    padding: 15px;
    border-radius: 8px;
    overflow-x: auto;
    font-size: 13px;
  }
`;

export function Exercise1_1Demo() {
  const [userId, setUserId] = useState(1);

  return (
    <div className="exercise-demo">
      <style>{userProfileStyles}</style>
      <style>{exerciseStyles}</style>
      
      <h1>🎯 Exercise 1.1: The Fetch Machine (useReducer)</h1>
      
      <div className="explanation">
        <h3>📚 Key Concepts:</h3>
        <ul>
          <li><strong>useReducer</strong> helps manage complex state better than useState</li>
          <li><strong>Finite State Machine</strong>: Component can only be in one of these states: idle, loading, resolved, rejected</li>
          <li><strong>Action</strong>: Describes what happened (FETCH_INIT, FETCH_SUCCESS, FETCH_FAILURE)</li>
          <li><strong>Reducer</strong>: Function that determines new state based on action</li>
        </ul>
      </div>

      <div className="controls">
        <h3>🎮 Try it out:</h3>
        <div className="button-group">
          <button onClick={() => setUserId(1)}>User 1</button>
          <button onClick={() => setUserId(2)}>User 2</button>
          <button onClick={() => setUserId(3)}>User 3</button>
          <button onClick={() => setUserId(999)} className="error-btn">
            User 999 (Error)
          </button>
        </div>
        <p className="hint">
          👆 Click the buttons to see the component fetch different data.
          User 999 will cause an error to test the FETCH_FAILURE case
        </p>
      </div>

      <div className="demo-area">
        <h3>📱 Component:</h3>
        <UserProfile userId={userId} />
      </div>

      <div className="code-explanation">
        <h3>💡 Why use useReducer?</h3>
        <pre>{`
// ❌ Old way with useState - can cause "impossible states"
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
// Bug: loading=true AND error=true at the same time is impossible!

// ✅ New way with useReducer - state is always valid
const [state, dispatch] = useReducer(reducer, initialState);
// status can only be: 'idle' | 'loading' | 'resolved' | 'rejected'
// "Impossible states" never happen!
        `}</pre>
      </div>
    </div>
  );
}

export default Exercise1_1Demo;
