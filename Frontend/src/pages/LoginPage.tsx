import { useState } from 'react';
import ExampleComponent from '../ExampleComponent';
import ChangePage from '../ChangePage';
import { getUser } from '../api';
import { APIError } from '../types';


const LoginPage = () => {
  const [count, setCount] = useState(0);


  const testBtn = async () => {
    const res = await getUser(1).catch((err: APIError) => err.message);
    console.log(res);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1>IP Whitelist Tracker</h1>

      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>

      <ExampleComponent count={count} />

      <p>
        Edit <code>src/App.tsx</code> and save to test HMR
      </p>

      <button onClick={testBtn} color="blue">Test</button>

      <ChangePage url={'home'} />
    </div>
  );
};

export default LoginPage;
