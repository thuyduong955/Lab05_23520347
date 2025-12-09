/**
 * Exercise 4.1 Demo Page
 */

import { LoginForm, loginFormStyles } from './LoginForm';

const styles = `
  ${loginFormStyles}

  .exercise-4-1 {
    padding: 20px;
    max-width: 900px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }

  .exercise-4-1 h2 {
    color: #1976d2;
    margin-top: 0;
  }

  .explanation-panel {
    background: #ffffff;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }

  .explanation-panel h2 {
    margin-top: 0;
    color: #1976d2;
  }

  .explanation-panel h3 {
    color: #333333;
    margin-top: 20px;
  }

  .explanation-panel p {
    color: #333333;
  }

  .explanation-panel ul {
    color: #333333;
    padding-left: 25px;
  }

  .explanation-panel li {
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
    font-size: 12px;
    line-height: 1.5;
  }

  .test-file-info {
    background: #e8f5e9;
    padding: 15px;
    border-radius: 8px;
    border-left: 4px solid #4caf50;
    margin-top: 15px;
    color: #333333;
  }

  .test-file-info code {
    background: #c8e6c9;
    color: #2e7d32;
    padding: 2px 6px;
    border-radius: 4px;
    display: block;
    margin: 5px 0;
  }

  .test-file-info p {
    color: #333333;
    margin: 10px 0 0 0;
  }

  .query-priority {
    background: #fff3e0;
    padding: 15px;
    border-radius: 8px;
    margin-top: 15px;
  }

  .query-priority h4 {
    margin-top: 0;
    color: #e65100;
  }

  .query-priority ol {
    margin: 0;
    padding-left: 20px;
    color: #5d4037;
  }

  .query-priority li {
    color: #5d4037;
  }

  .query-priority code {
    background: #ffecb3;
    color: #e65100;
    padding: 2px 6px;
    border-radius: 4px;
  }

  @media (max-width: 800px) {
    .exercise-4-1 {
      grid-template-columns: 1fr;
    }
  }
`;

export function Exercise4_1Demo() {
  return (
    <div>
      <style>{styles}</style>
      
      <h1 style={{ textAlign: 'center', padding: '20px', color: '#1976d2' }}>
        🎯 Exercise 4.1: Integration Testing a Form
      </h1>

      <div className="exercise-4-1">
        {/* Left: Form Demo */}
        <div>
          <h2>🔐 Demo LoginForm</h2>
          <LoginForm />
          
          <div className="test-file-info">
            <strong>📁 Test file:</strong>
            <code>src/exercises/exercise4-1/LoginForm.test.tsx</code>
            <p>Run tests with: <code>npm test</code></p>
          </div>
        </div>

        {/* Right: Explanation */}
        <div className="explanation-panel">
          <h2>📚 React Testing Library</h2>
          
          <p>
            <strong>Philosophy:</strong> "Test the way users use your app"
          </p>

          <h3>🔑 Key Concepts:</h3>
          <ul>
            <li><strong>render()</strong>: Render component into virtual DOM</li>
            <li><strong>screen</strong>: Query elements in DOM</li>
            <li><strong>userEvent</strong>: Simulate user interactions</li>
            <li><strong>waitFor/findBy</strong>: Handle async operations</li>
          </ul>

          <div className="code-block">
{`// Basic test example
it('shows success on login', async () => {
  // ARRANGE
  const user = userEvent.setup();
  render(<LoginForm />);

  // ACT - Interact like a real user
  await user.type(
    screen.getByLabelText(/email/i),
    'test@example.com'
  );
  await user.click(
    screen.getByRole('button', { name: /login/i })
  );

  // ASSERT - Check the result
  expect(
    await screen.findByText(/welcome/i)
  ).toBeInTheDocument();
});`}
          </div>

          <div className="query-priority">
            <h4>📋 Query Priority (RTL recommendations):</h4>
            <ol>
              <li><code>getByRole</code> - Best for accessibility</li>
              <li><code>getByLabelText</code> - For form inputs</li>
              <li><code>getByText</code> - For text content</li>
              <li><code>getByTestId</code> - Last resort</li>
            </ol>
          </div>

          <h3>❌ Anti-Patterns:</h3>
          <ul>
            <li>Don't test internal state</li>
            <li>Don't test implementation details</li>
            <li>Don't use enzyme's shallow rendering</li>
            <li>Don't query by class names</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Exercise4_1Demo;
