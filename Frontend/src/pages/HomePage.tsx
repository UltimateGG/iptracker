import { Spinner } from 'flowbite-react';
import NavBar from '../components/NavBar';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../utils/types';

const HomePage = () => {
  const { user } = useAuth();
  const { applications } = useAppContext();

  return (
    <div className="w-full h-full">
      <NavBar />

      <div className="format m-4">
        <h1>IP Whitelist Tracker Home</h1>

        {user && (
          <div>
            <h2>Welcome back, {user.username}!</h2>
            <p>Your role is: {UserRole[user.role]}</p>

            <p>Your Applications</p>
            {!applications ? (
              <Spinner />
            ) : (
              <ul>
                {applications.map(app => (
                  <li key={app.id}>{app.description}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
