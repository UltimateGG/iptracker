import { useQuery } from 'react-query';
import { getAllUsers } from '../../utils/api';
import { APIError, User, UserRole } from '../../utils/types';
import { Button, Spinner, Table, Toast } from 'flowbite-react';
import { UserEdit, UserAdd } from 'flowbite-react-icons/solid';
import { ExclamationCircle } from 'flowbite-react-icons/outline';
import { useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import EditUserModal from './EditUserModal';

const UsersPage = () => {
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);

  const { isLoading, error, data: users, refetch } = useQuery<User[], APIError>('users', getAllUsers);
  const { notifySuccess } = useNotifications();
  const { user } = useAuth();

  const sortedUsers = useMemo(() => {
    if (!users) return [];

    // self first, then admins, then by user id
    return [...users].sort((a, b) => {
      if (a.id === user?.id) return -1;
      if (a.role === UserRole.ADMIN && b.role !== UserRole.ADMIN) return -1;
      if (a.role !== UserRole.ADMIN && b.role === UserRole.ADMIN) return 1;
      return a.id - b.id;
    });
  }, [users, user]);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        {error && (
          <Toast className="mb-4">
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
              <ExclamationCircle className="h-5 w-5" />
            </div>
            <div className="ml-3 text-sm font-normal">{error?.message}</div>
          </Toast>
        )}

        <Button className="mb-4 ml-auto h-min" size="sm" onClick={() => notifySuccess('test message of success!')}>
          <UserAdd className="mr-1" />
          New User
        </Button>
      </div>

      {isLoading ? (
        <Spinner className="w-full flex items-center" size="lg" />
      ) : (
        <div className="overflow-x-auto pb-16">
          <Table>
            <Table.Head>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Role</Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Menu</span>
              </Table.HeadCell>
            </Table.Head>

            <Table.Body className="divide-y">
              {sortedUsers.map(u => (
                <Table.Row key={u.id} className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-100 transition-colors duration-100">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{u.username}</Table.Cell>
                  <Table.Cell>{UserRole[u.role]}</Table.Cell>
                  <Table.Cell>
                    <p className="flex items-center gap-1 text-cyan cursor-pointer w-min ml-auto" onClick={() => setEditingUser(u)}>
                      <UserEdit />
                      Edit
                    </p>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}

      <EditUserModal
        user={editingUser}
        onClose={() => {
          setEditingUser(undefined);
          refetch();
        }}
      />
    </div>
  );
};

export default UsersPage;
