import NavBar from '../components/NavBar';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../utils/types';

const HomePage = () => {
  const { user } = useAuth();

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
            <ul>
              {user.apps.map(a => (
                <li key={a.id}>{a.description}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
