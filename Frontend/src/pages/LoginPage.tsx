import { useNavigate } from 'react-router';
import LoginHeader from '../components/LoginHeader';
import { Button } from 'flowbite-react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const nav = useNavigate();
  const { user } = useAuth();

  return (
    <>
      <LoginHeader />

      {user ? JSON.stringify(user) : null}
      <div className="flex align-items-center justify-content-center h-100 w-full">
        <div className="flex align-items-center justify-content-center w-50 min-w-96/3 h-50 min-h-96" style={{ backgroundColor: 'grey' }}>
          <div className="text-center">
            <Button onClick={() => nav('/login')} color="primary">
              Login
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
