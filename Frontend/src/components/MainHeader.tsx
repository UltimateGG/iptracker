import { Button } from 'flowbite-react';
import { useAuth } from '../contexts/AuthContext';

const MainHeader = () => {
  const { logout } = useAuth();

  return (
    <>
      <Button color="red" onClick={logout}>
        Logout
      </Button>
    </>
  );
};

export default MainHeader;
