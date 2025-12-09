/**
 * Lab 5: React Advanced - Main App
 * 
 * Navigation between exercises
 */

import { useState } from 'react';

// Import các exercises
import Exercise1_1Demo from './exercises/exercise1-1';
import Exercise1_2Demo from './exercises/exercise1-2';
import Exercise2_1Demo from './exercises/exercise2-1';
import Exercise2_2Demo from './exercises/exercise2-2';
import Exercise2_3Demo from './exercises/exercise2-3';
import Exercise3_1Demo from './exercises/exercise3-1';
import Exercise3_2Demo from './exercises/exercise3-2';
import Exercise4_1Demo from './exercises/exercise4-1';
import Exercise4_2Demo from './exercises/exercise4-2';

type ExerciseId = 
  | 'home' 
  | '1.1' | '1.2' 
  | '2.1' | '2.2' | '2.3'
  | '3.1' | '3.2'
  | '4.1' | '4.2';

const exercises = [
  { id: '1.1' as const, title: 'useReducer Fetch', part: 1 },
  { id: '1.2' as const, title: 'Redux Toolkit Cart', part: 1 },
  { id: '2.1' as const, title: 'useMemo & React.memo', part: 2 },
  { id: '2.2' as const, title: 'useCallback', part: 2 },
  { id: '2.3' as const, title: 'Code Splitting', part: 2 },
  { id: '3.1' as const, title: 'Compound Tabs', part: 3 },
  { id: '3.2' as const, title: 'Portal Modal', part: 3 },
  { id: '4.1' as const, title: 'Form Testing', part: 4 },
  { id: '4.2' as const, title: 'Error Boundary', part: 4 },
];

const partTitles: Record<number, string> = {
  1: 'Complex State Management',
  2: 'Performance Engineering',
  3: 'Advanced Design Patterns',
  4: 'Testing Strategies',
};

function App() {
  const [currentExercise, setCurrentExercise] = useState<ExerciseId>('home');

  const renderExercise = () => {
    switch (currentExercise) {
      case '1.1': return <Exercise1_1Demo />;
      case '1.2': return <Exercise1_2Demo />;
      case '2.1': return <Exercise2_1Demo />;
      case '2.2': return <Exercise2_2Demo />;
      case '2.3': return <Exercise2_3Demo />;
      case '3.1': return <Exercise3_1Demo />;
      case '3.2': return <Exercise3_2Demo />;
      case '4.1': return <Exercise4_1Demo />;
      case '4.2': return <Exercise4_2Demo />;
      default: return <HomePage onSelect={setCurrentExercise} />;
    }
  };

  return (
    <div className="app">
      <style>{appStyles}</style>
      
      {/* Navigation Header */}
      {currentExercise !== 'home' && (
        <nav className="top-nav">
          <button onClick={() => setCurrentExercise('home')} className="home-btn">
            🏠 Home
          </button>
          <span className="current-exercise">
            Exercise {currentExercise}
          </span>
          <div className="nav-exercises">
            {exercises.map(ex => (
              <button
                key={ex.id}
                onClick={() => setCurrentExercise(ex.id)}
                className={currentExercise === ex.id ? 'active' : ''}
                title={ex.title}
              >
                {ex.id}
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="main-content">
        {renderExercise()}
      </main>
    </div>
  );
}

// Home Page Component
interface HomePageProps {
  onSelect: (id: ExerciseId) => void;
}

function HomePage({ onSelect }: HomePageProps) {
  const groupedExercises = [1, 2, 3, 4].map(part => ({
    part,
    title: partTitles[part],
    exercises: exercises.filter(ex => ex.part === part),
  }));

  return (
    <div className="home-page-content">
      <div className="hero">
        <h1>🎓 Lab 5: React Advanced</h1>
        <p>Practical Exercises for Advanced React Concepts</p>
      </div>

      <div className="exercises-grid">
        {groupedExercises.map(group => (
          <div key={group.part} className="exercise-group">
            <h2>Part {group.part}: {group.title}</h2>
            <div className="exercise-list">
              {group.exercises.map(ex => (
                <button
                  key={ex.id}
                  onClick={() => onSelect(ex.id)}
                  className="exercise-card"
                >
                  <span className="exercise-id">Exercise {ex.id}</span>
                  <span className="exercise-title">{ex.title}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="info-section">
        <h2>📚 Lab Contents</h2>
        <ul>
          <li><strong>Part 1</strong>: useReducer, Redux Toolkit, Selectors</li>
          <li><strong>Part 2</strong>: React.memo, useMemo, useCallback, Code Splitting</li>
          <li><strong>Part 3</strong>: Compound Components, Portals</li>
          <li><strong>Part 4</strong>: React Testing Library, Error Boundaries</li>
        </ul>
      </div>
    </div>
  );
}

// Styles
const appStyles = `
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    background: #f5f5f5;
    color: #333333;
  }

  .app {
    min-height: 100vh;
  }

  /* Top Navigation */
  .top-nav {
    background: #1976d2;
    color: white;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    gap: 20px;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  }

  .home-btn {
    background: rgba(255,255,255,0.2);
    border: none;
    color: white;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
  }

  .home-btn:hover {
    background: rgba(255,255,255,0.3);
  }

  .current-exercise {
    font-weight: bold;
    font-size: 16px;
    color: white;
  }

  .nav-exercises {
    display: flex;
    gap: 5px;
    margin-left: auto;
  }

  .nav-exercises button {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.3);
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.2s;
  }

  .nav-exercises button:hover {
    background: rgba(255,255,255,0.2);
  }

  .nav-exercises button.active {
    background: white;
    color: #1976d2;
    font-weight: 600;
  }

  /* Main Content */
  .main-content {
    min-height: calc(100vh - 50px);
    background: #f5f5f5;
  }

  /* Home Page */
  .home-page-content {
    max-width: 1000px;
    margin: 0 auto;
    padding: 40px 20px;
  }

  .hero {
    text-align: center;
    margin-bottom: 50px;
  }

  .hero h1 {
    font-size: 48px;
    margin: 0 0 10px 0;
    color: #1976d2;
  }

  .hero p {
    font-size: 20px;
    color: #555555;
    margin: 0;
  }

  .exercises-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
    margin-bottom: 50px;
  }

  .exercise-group {
    background: white;
    border-radius: 15px;
    padding: 25px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  }

  .exercise-group h2 {
    margin: 0 0 20px 0;
    font-size: 18px;
    color: #333333;
    padding-bottom: 10px;
    border-bottom: 2px solid #e3f2fd;
  }

  .exercise-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .exercise-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 15px;
    background: #f8f9fa;
    border: 2px solid transparent;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }

  .exercise-card:hover {
    background: #e3f2fd;
    border-color: #1976d2;
    transform: translateX(5px);
  }

  .exercise-id {
    font-weight: bold;
    color: #1976d2;
    font-size: 14px;
  }

  .exercise-title {
    color: #333333;
    font-size: 16px;
    margin-top: 5px;
  }

  .info-section {
    background: #e8f5e9;
    padding: 30px;
    border-radius: 15px;
    border-left: 5px solid #4caf50;
  }

  .info-section h2 {
    margin-top: 0;
    color: #2e7d32;
  }

  .info-section ul {
    margin: 0;
    padding-left: 20px;
    color: #333333;
  }

  .info-section li {
    margin: 10px 0;
    line-height: 1.6;
    color: #333333;
  }

  /* Responsive */
  @media (max-width: 700px) {
    .exercises-grid {
      grid-template-columns: 1fr;
    }

    .hero h1 {
      font-size: 32px;
    }

    .nav-exercises {
      display: none;
    }
  }
`;

export default App;
