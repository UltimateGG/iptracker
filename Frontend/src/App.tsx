import { useState } from 'react';


const App = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        {count >= 1000 ?
          (
            <p>
              trent smells like beef and cheese
            </p>
          ) : (
            <p>
              trent smells like flowers and unicorns
            </p>
          )
        }
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
};

export default App;
