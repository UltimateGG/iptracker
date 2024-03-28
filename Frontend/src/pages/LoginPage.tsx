import { useNavigate } from 'react-router';
import { Button, Card, Label, TextInput } from 'flowbite-react';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { login } from '../utils/api';
import { useQuery } from 'react-query';
import { APIError } from '../utils/types';
import IndeterminateProgressBar from '../components/IndeterminateProgressBar';

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

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') refetch();
  };

  return (
    <>
      <div className="w-full h-full flex flex-col gap-8 justify-center items-center px-6">
        <img src="commerce-logo.png" className="w-full max-w-md h-auto" />

        <Card className="w-full max-w-md bg-gray-100" theme={{ root: { children: 'flex h-full flex-col justify-center' } }}>
          <div className="flex h-full flex-col justify-center gap-4 w-full p-6">
            <div className="format">
              <h1>Login</h1>
            </div>

            {error && <p className="mb-2 text-red-500">Error: {error.message}</p>}

            <div>
              <Label htmlFor="username" value="Your username" className="mb-2 block" />
              <TextInput id="username" value={username} onChange={e => setUsername(e.target.value)} disabled={isLoading} onKeyDown={onKeyDown} />
            </div>
            <div>
              <Label htmlFor="password" value="Your password" className="mb-2 block" />
              <TextInput id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} disabled={isLoading} onKeyDown={onKeyDown} />
            </div>

            <Button className="w-min ml-auto mt-1" onClick={() => refetch()} disabled={isLoading}>
              Login
            </Button>
          </div>

          {isLoading && <IndeterminateProgressBar barClassName="rounded-b-lg" />}
        </Card>
      </div>
    </>
  );
};

export default LoginPage;
