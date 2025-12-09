/**
 * Exercise 3.1 Demo Page
 * Demo Compound Tabs Component
 */

import { Tabs, tabsStyles } from './Tabs';

const styles = `
  ${tabsStyles}

  .exercise-3-1 {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
  }

  .exercise-3-1 h1 {
    color: #1976d2;
    margin-bottom: 20px;
  }

  .demo-section {
    margin: 30px 0;
    padding: 20px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }

  .demo-section h2 {
    margin-top: 0;
    color: #1976d2;
  }

  .demo-section ul {
    color: #333333;
    padding-left: 25px;
  }

  .demo-section li {
    color: #333333;
    margin: 8px 0;
  }

  .demo-section p {
    color: #333333;
  }

  .code-block {
    background: #263238;
    color: #aed581;
    padding: 15px;
    border-radius: 8px;
    overflow-x: auto;
    font-family: 'Fira Code', monospace;
    font-size: 13px;
    line-height: 1.5;
  }

  .tab-content-demo {
    padding: 15px;
  }

  .tab-content-demo h3 {
    margin-top: 0;
    color: #1976d2;
  }

  .tab-content-demo p {
    color: #333333;
  }

  .feature-list {
    list-style: none;
    padding: 0;
  }

  .feature-list li {
    padding: 8px 0;
    border-bottom: 1px solid #eee;
    color: #333333;
  }

  .feature-list li:last-child {
    border-bottom: none;
  }
`;

export function Exercise3_1Demo() {
  return (
    <div className="exercise-3-1">
      <style>{styles}</style>

      <h1>🎯 Exercise 3.1: Compound Tabs Component</h1>

      <div className="demo-section">
        <h2>📚 Compound Components Concepts</h2>
        <ul>
          <li><strong>Context API</strong>: Share state between parent and children</li>
          <li><strong>Flexible API</strong>: Users can add any markup they want</li>
          <li><strong>Encapsulation</strong>: Logic hidden inside, simple API</li>
        </ul>

        <div className="code-block">
{`// How to use Compound Component
<Tabs defaultIndex={0}>
  <Tabs.List>
    <Tabs.Tab index={0}>Tab 1</Tabs.Tab>
    <Tabs.Tab index={1}>Tab 2</Tabs.Tab>
  </Tabs.List>
  
  {/* You can add any markup here! */}
  <div className="custom-divider"></div>
  
  <Tabs.Panel index={0}>Tab 1 Content</Tabs.Panel>
  <Tabs.Panel index={1}>Tab 2 Content</Tabs.Panel>
</Tabs>`}
        </div>
      </div>

      {/* Demo 1: Default Style */}
      <div className="demo-section">
        <h2>🎨 Demo 1: Default Style</h2>
        
        <Tabs defaultIndex={0}>
          <Tabs.List>
            <Tabs.Tab index={0}>⚛️ React</Tabs.Tab>
            <Tabs.Tab index={1}>🔷 TypeScript</Tabs.Tab>
            <Tabs.Tab index={2}>🟣 Redux</Tabs.Tab>
            <Tabs.Tab index={3} disabled>🔒 Disabled</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel index={0}>
            <div className="tab-content-demo">
              <h3>What is React?</h3>
              <p>
                React is a JavaScript library for building user interfaces.
                Developed by Facebook and the community.
              </p>
              <ul className="feature-list">
                <li>✅ Component-based architecture</li>
                <li>✅ Virtual DOM for performance</li>
                <li>✅ One-way data flow</li>
                <li>✅ Rich ecosystem</li>
              </ul>
            </div>
          </Tabs.Panel>

          <Tabs.Panel index={1}>
            <div className="tab-content-demo">
              <h3>What is TypeScript?</h3>
              <p>
                TypeScript is a superset of JavaScript that adds static typing.
                Helps catch errors early and improves developer experience.
              </p>
              <ul className="feature-list">
                <li>✅ Static type checking</li>
                <li>✅ Better IDE support</li>
                <li>✅ OOP features</li>
                <li>✅ Compiles to JavaScript</li>
              </ul>
            </div>
          </Tabs.Panel>

          <Tabs.Panel index={2}>
            <div className="tab-content-demo">
              <h3>What is Redux?</h3>
              <p>
                Redux is a state management library. Often used with React
                but can be used with any framework.
              </p>
              <ul className="feature-list">
                <li>✅ Single source of truth</li>
                <li>✅ Predictable state updates</li>
                <li>✅ Time-travel debugging</li>
                <li>✅ Middleware ecosystem</li>
              </ul>
            </div>
          </Tabs.Panel>
        </Tabs>
      </div>

      {/* Demo 2: Pills Style */}
      <div className="demo-section">
        <h2>💊 Demo 2: Pills Style (with custom className)</h2>
        
        <Tabs defaultIndex={1} className="pills">
          <Tabs.List>
            <Tabs.Tab index={0}>📊 Dashboard</Tabs.Tab>
            <Tabs.Tab index={1}>👤 Profile</Tabs.Tab>
            <Tabs.Tab index={2}>⚙️ Settings</Tabs.Tab>
          </Tabs.List>

          {/* Custom markup between List and Panel */}
          <div style={{ 
            margin: '10px 0', 
            padding: '10px', 
            background: '#fff3e0', 
            borderRadius: '5px',
            textAlign: 'center'
          }}>
            👆 You can add any markup between List and Panel!
          </div>

          <Tabs.Panel index={0}>
            <h3>📊 Dashboard</h3>
            <p>Overview page with charts and statistics.</p>
          </Tabs.Panel>

          <Tabs.Panel index={1}>
            <h3>👤 Profile</h3>
            <p>Personal information and account settings.</p>
          </Tabs.Panel>

          <Tabs.Panel index={2}>
            <h3>⚙️ Settings</h3>
            <p>Application configuration and user preferences.</p>
          </Tabs.Panel>
        </Tabs>
      </div>

      {/* Context Explanation */}
      <div className="demo-section">
        <h2>🔗 How it works with Context</h2>
        <div className="code-block">
{`// 1. Create Context
const TabsContext = createContext<TabsContextType | undefined>(undefined);

// 2. Parent component provides value
function Tabs({ children }) {
  const [activeIndex, setActiveIndex] = useState(0);
  
  return (
    <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>
      {children}
    </TabsContext.Provider>
  );
}

// 3. Child components use context
function Tab({ index, children }) {
  const { activeIndex, setActiveIndex } = useContext(TabsContext);
  return (
    <button 
      onClick={() => setActiveIndex(index)}
      className={activeIndex === index ? 'active' : ''}
    >
      {children}
    </button>
  );
}`}
        </div>
      </div>
    </div>
  );
}

export default Exercise3_1Demo;
