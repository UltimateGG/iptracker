import { User, UserRole } from '../../utils/types';
import { Button, Spinner, Table } from 'flowbite-react';
import { useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import EditUserModal from './EditUserModal';
import { HiUserAdd } from 'react-icons/hi';
import { FaUserEdit } from 'react-icons/fa';
import { useAppContext } from '../../contexts/AppContext';
import { queryClient } from '../../main';

const UsersPage = () => {
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
  const [creatingUser, setCreatingUser] = useState<boolean>(false);

  const { user } = useAuth();
  const { users, loadingUsers } = useAppContext();

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
    <div className="p-4 md:mx-48">
      <div className="flex items-center justify-between px-1">
        <Button className="mb-4 ml-auto h-min" size="sm" onClick={() => setCreatingUser(true)}>
          <HiUserAdd className="mr-1" size={20} />
          New User
        </Button>
      </div>

      {loadingUsers ? (
        <Spinner className="w-full flex items-center" size="lg" />
      ) : (
        <div className="overflow-x-auto pb-16 px-1 pt-1">
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
                      <FaUserEdit size={16} />
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
        creating={creatingUser}
        onClose={refresh => {
          if (refresh) {
            if (editingUser?.id === user?.id) queryClient.refetchQueries('user');
            queryClient.refetchQueries('users');
          }

          setEditingUser(undefined);
          setCreatingUser(false);
        }}
      />
    </div>
  );
};

export default UsersPage;
