import { useQuery } from 'react-query';
import MainHeader from '../components/MainHeader';
import { getUser } from '../utils/api';
import { APIError, User } from '../utils/types';

const HomePage = () => {
  const { isLoading, error, data } = useQuery<User, APIError>({
    queryKey: 'user2',
    queryFn: () => getUser(1)
  });

  return (
    <div>
      <MainHeader />

      <div className="flex flex-col items-center justify-center h-full">
        <h1>IP Whitelist Tracker Home</h1>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <div>
          <h2>Welcome back, {data.username}!</h2>
          <p>Your role is: {data.role}</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
