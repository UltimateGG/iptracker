import { useMutation, useQuery } from 'react-query';
import { getAllUsers, deleteUser as apiDeleteUser } from '../../utils/api';
import { APIError, User, UserRole } from '../../utils/types';
import { Button, Dropdown, Modal, Spinner, Table, Toast } from 'flowbite-react';
import { UserEdit, UserAdd } from 'flowbite-react-icons/solid';
import { DotsVertical, TrashBin, ExclamationCircle } from 'flowbite-react-icons/outline';
import { useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import clsx from 'clsx';
import { useNotifications } from '../../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';

const UsersPage = () => {
  const [deleteModal, setDeleteModal] = useState<User | null>(null);

  const { isLoading, error, data: users, refetch } = useQuery<User[], APIError>('users', getAllUsers);
  const { notifySuccess } = useNotifications();
  const { user } = useAuth();
  const nav = useNavigate();

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

  const deleteUser = async () => {
    if (!deleteModal) return;

    await apiDeleteUser(deleteModal.id);
  };

  const deleteUserMutation = useMutation<void, APIError>({
    mutationFn: deleteUser,
    onSuccess: async () => {
      await refetch().catch(() => null);
      setDeleteModal(null);
      notifySuccess('User deleted successfully!');
    }
  });

  const closeDeleteModal = () => {
    setDeleteModal(null);
    deleteUserMutation.reset();
  };

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
                    <Dropdown label="" renderTrigger={() => <DotsVertical className="text-gray-500 cursor-pointer ml-auto" />}>
                      <Dropdown.Item icon={UserEdit} onClick={() => nav('/users/' + u.id)}>
                        Edit
                      </Dropdown.Item>
                      <Dropdown.Item
                        className={clsx('text-red-500', u.id === user?.id && 'opacity-50 cursor-not-allowed')}
                        icon={TrashBin}
                        onClick={() => (u.id === user?.id ? null : setDeleteModal(u))}
                      >
                        Delete
                      </Dropdown.Item>
                    </Dropdown>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}

      <Modal show={!!deleteModal} size="md" onClose={closeDeleteModal} popup dismissible={!deleteUserMutation.isLoading}>
        <Modal.Header className={clsx(deleteUserMutation.isLoading && 'invisible')} />
        <Modal.Body>
          <div className="text-center">
            <div className="mx-auto mb-4 h-14 w-14">
              {deleteUserMutation.isLoading ? (
                <Spinner className="w-full flex items-center" color="failure" size="xl" />
              ) : (
                <ExclamationCircle className={clsx('h-14 w-14', deleteUserMutation.error ? 'text-red-500' : 'text-gray-400 dark:text-gray-200')} />
              )}
            </div>
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {deleteUserMutation.isLoading ? (
                'Deleting user...'
              ) : deleteUserMutation.error ? (
                <>Failed to delete user: {deleteUserMutation.error.message}</>
              ) : (
                <>
                  Are you sure you want to delete the user &quot;<strong>{deleteModal?.username}</strong>&quot;?
                </>
              )}
            </h3>

            {!deleteUserMutation.isLoading && (
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={() => deleteUserMutation.mutate()}>
                  {deleteUserMutation.error ? 'Retry' : 'Yes, delete'}
                </Button>
                <Button color="gray" onClick={closeDeleteModal}>
                  {deleteUserMutation.error ? 'Cancel' : 'No, cancel'}
                </Button>
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UsersPage;
