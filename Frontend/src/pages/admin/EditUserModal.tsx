import { useMutation } from 'react-query';
import { deleteUser } from '../../utils/api';
import { User, APIError, UserRole } from '../../utils/types';
import { Button, Checkbox, Label, Modal, Spinner, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { ExclamationCircle, TrashBin } from 'flowbite-react-icons/outline';
import clsx from 'clsx';
import { useAuth } from '../../contexts/AuthContext';

interface EditUserModalProps {
  user?: User;
  onClose: () => void;
}

const EditUserModal = ({ user, onClose }: EditUserModalProps) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newUser, setNewUser] = useState<User | undefined>(user);

  const { user: loggedInUser } = useAuth();
  const { notifySuccess } = useNotifications();

  useEffect(() => {
    setNewUser(user ? { ...user } : undefined);
  }, [user]);

  const deleteUserMutation = useMutation<void, APIError>({
    mutationFn: async () => {
      if (!user) return;
      await deleteUser(user.id);
    },
    onSuccess: async () => {
      setDeleteModalOpen(false);
      notifySuccess('User deleted successfully!');
      onClose();
    }
  });

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    deleteUserMutation.reset();
  };

  const dateToString = (date?: string) => {
    return date ? new Date(date).toLocaleString(undefined, { weekday: 'short', day: '2-digit', month: 'short', hour: 'numeric', minute: 'numeric' }) : 'Never';
  };

  const setRole = (role: UserRole) => {
    setNewUser(u => {
      if (!u) return u;
      return { ...u, role };
    });
  };

  const setUsername = (username: string) => {
    setNewUser(u => {
      if (!u) return u;
      return { ...u, username };
    });
  };

  return (
    <>
      <Modal show={!!user} onClose={onClose}>
        <Modal.Header>Edit User</Modal.Header>

        <Modal.Body>
          <div className="flex flex-col gap-2">
            <div>
              <Label htmlFor="username">Username</Label>
              <TextInput id="username" value={newUser?.username || ''} onChange={e => setUsername(e.target.value)} maxLength={24} />
            </div>

            <div className="flex items-center gap-2 mt-4">
              <Checkbox id="admin" checked={newUser?.role === UserRole.ADMIN || false} onChange={e => setRole(e.target.checked ? UserRole.ADMIN : UserRole.USER)} />
              <Label htmlFor="admin" className="flex">
                Admin
              </Label>
            </div>

            <div className="flex mt-2 justify-between gap-2">
              <div>
                <p className="font-medium text-sm">Created At</p>
                <p>{dateToString(user?.createdAt)}</p>
                <p className="text-sm">
                  By <span className="font-medium">{user?.createdBy}</span>
                </p>
              </div>

              <div>
                <p className="font-medium text-sm">Last Modified</p>
                <p>{dateToString(user?.modifiedAt)}</p>

                {user?.modifiedBy && (
                  <p className="text-sm">
                    By <span className="font-medium">{user?.modifiedAt}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="w-full flex justify-between mt-6">
            <Button color="failure" onClick={() => setDeleteModalOpen(true)} size="sm" disabled={user?.id === loggedInUser?.id}>
              <TrashBin />
              Delete user
            </Button>

            <div className="flex gap-2">
              <Button color="gray" onClick={onClose} size="sm">
                Cancel
              </Button>
              <Button color="dark" onClick={onClose} size="sm">
                Save Changes
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={deleteModalOpen} size="md" onClose={closeDeleteModal} popup dismissible={!deleteUserMutation.isLoading}>
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
                  Are you sure you want to delete the user &quot;<strong>{user?.username}</strong>&quot;?
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
    </>
  );
};

export default EditUserModal;
