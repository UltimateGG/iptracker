import { Modal, Spinner, Button } from 'flowbite-react';
import clsx from 'clsx';
import { APIError, User } from '../../utils/types';
import { useMutation } from 'react-query';
import { deleteUser } from '../../utils/api';
import { useNotifications } from '../../contexts/NotificationContext';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

interface DeleteUserModalProps {
  user?: User;
  open: boolean;
  onClose: (deleted: boolean) => void;
}

const DeleteUserModal = ({ user, open, onClose: _onClose }: DeleteUserModalProps) => {
  const { notifySuccess } = useNotifications();

  const { mutate, isLoading, error, reset } = useMutation<void, APIError>({
    mutationFn: async () => {
      if (!user) return;
      await deleteUser(user.id);
    },
    onSuccess: async () => {
      notifySuccess('User deleted successfully!');
      onClose(true);
    }
  });

  const onClose = (deleted: boolean = false) => {
    _onClose(deleted);
    reset();
  };

  return (
    <Modal show={open} size="md" onClose={onClose} popup dismissible={!isLoading}>
      <Modal.Header className={clsx(isLoading && 'invisible')} />

      <Modal.Body>
        <div className="text-center">
          <div className="mx-auto mb-4 h-14 w-14">
            {isLoading ? (
              <Spinner className="w-full flex items-center" color="failure" size="xl" />
            ) : (
              <HiOutlineExclamationCircle className={clsx('h-14 w-14', error ? 'text-red-500' : 'text-gray-400 dark:text-gray-200')} />
            )}
          </div>
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            {isLoading ? (
              'Deleting user...'
            ) : error ? (
              <>Failed to delete user: {error.message}</>
            ) : (
              <>
                Are you sure you want to delete the user &quot;<strong>{user?.username}</strong>&quot;?
              </>
            )}
          </h3>

          {!isLoading && (
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => mutate()}>
                {error ? 'Retry' : 'Yes, delete'}
              </Button>
              <Button color="light" onClick={() => onClose()}>
                {error ? 'Cancel' : 'No, cancel'}
              </Button>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteUserModal;
