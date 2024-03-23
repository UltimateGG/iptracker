import { useNavigate } from 'react-router';
import { Button, Spinner, TextInput } from 'flowbite-react';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { login } from '../utils/api';
import { useQuery } from 'react-query';
import { APIError } from '../utils/types';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { isLoading, error, refetch } = useQuery<void, APIError>(
    'login',
    async () => {
      await login(username, password);
      window.location.reload();
    },
    { cacheTime: 0, enabled: false, retry: false }
  );

  const nav = useNavigate();
  const { user } = useAuth();

  // Redirect to home if logged in
  useEffect(() => {
    if (user) nav('/');
  }, [user]);

  return (
    <>
      <div className="w-full h-full flex justify-center items-center">
        <div className="flex flex-col gap-2 p-3 rounded bg-gray-200">
          {isLoading && <Spinner />}
          {error && <p className="text-red-500">Error: {error.message}</p>}

          <TextInput placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} disabled={isLoading} />
          <TextInput placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} type="password" disabled={isLoading} />

          <Button onClick={() => refetch()} color="blue" disabled={isLoading}>
            Login
          </Button>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
