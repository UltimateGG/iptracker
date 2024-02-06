import { useState } from 'react';
import SmellButton from './smell';


const App = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1>IP Whitelist Tracker</h1>

      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>

      <SmellButton count={count} />

      <p>
        Edit <code>src/App.tsx</code> and save to test HMR
      </p>
    </div>
  );
};

export default App;