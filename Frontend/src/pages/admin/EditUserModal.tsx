import { useMutation } from 'react-query';
import { deleteUser } from '../../utils/api';
import { User, APIError, UserRole } from '../../utils/types';
import { Button, Checkbox, Label, Modal, Spinner } from 'flowbite-react';
import { useState } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { ExclamationCircle, TrashBin } from 'flowbite-react-icons/outline';
import clsx from 'clsx';

interface EditUserModalProps {
  user?: User;
  onClose: () => void;
}

const EditUserModal = ({ user, onClose }: EditUserModalProps) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { notifySuccess } = useNotifications();

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

  return (
    <>
      <Modal show={!!user} onClose={onClose}>
        <Modal.Header>
          <p>Edit {user?.username}</p>
        </Modal.Header>

        <Modal.Body>
          <div className="flex items-center gap-2">
            <Checkbox id="admin" checked={user?.role === UserRole.ADMIN} />
            <Label htmlFor="admin" className="flex">
              Admin
            </Label>
          </div>
          <Button color="failure" onClick={() => setDeleteModalOpen(true)}>
            <TrashBin />
            Delete user
          </Button>
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
