import MainHeader from '../components/MainHeader';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../utils/types';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div>
      <MainHeader />

      <div className="flex flex-col items-center justify-center h-full">
        <h1>IP Whitelist Tracker Home</h1>
      </div>

      {user && (
        <div>
          <h2>Welcome back, {user.username}!</h2>
          <p>Your role is: {UserRole[user.role]}</p>

          <p>Your Applications</p>
          {user.apps.map(a => (
            <div key={a.id}>{a.description}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
