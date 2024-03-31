import { Button, Spinner } from 'flowbite-react';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../utils/types';
import { HiPlus } from 'react-icons/hi';
import CreateApplicationModal from './admin/CreateApplicationModal';
import { useState } from 'react';
import { deleteApplication } from '../utils/api';

const HomePage = () => {
  const [createApplicationModalOpen, setCreateApplicationModalOpen] = useState(false);

  const { user } = useAuth();
  const { applications } = useAppContext();

  return (
    <div className="p-4">
      {user && (
        <>
          <div className="flex justify-between w-full">
            <h2 className="text-2xl font-medium">Welcome back, {user.username}!</h2>

            {user.role === UserRole.ADMIN && (
              <Button size="sm" className="h-min" onClick={() => setCreateApplicationModalOpen(true)}>
                <HiPlus size={20} className="mr-2" />
                New Application
              </Button>
            )}
          </div>

          <p>Your Applications</p>
          {!applications ? (
            <Spinner />
          ) : (
            <ul>
              {applications.map(app => (
                <li key={app.id} className="flex gap-2">
                  {app.description}
                  <p onClick={() => deleteApplication(app.id)}>X</p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {createApplicationModalOpen && <CreateApplicationModal onClose={() => setCreateApplicationModalOpen(false)} />}
    </div>
  );
};

export default HomePage;
