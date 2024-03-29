import { Spinner } from 'flowbite-react';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { user } = useAuth();
  const { applications } = useAppContext();

  return (
    <div className="format m-4">
      {user && (
        <div>
          <h2>Welcome back, {user.username}!</h2>

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
  );
};

export default HomePage;
