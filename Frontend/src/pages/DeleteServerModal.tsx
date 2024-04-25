import { Modal, Spinner, Button } from 'flowbite-react';
import clsx from 'clsx';
import { APIError, Server } from '../utils/types';
import { useMutation } from 'react-query';
import { deleteServer } from '../utils/api';
import { useNotifications } from '../contexts/NotificationContext';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

interface DeleteServerModalProps {
  server?: Server;
  open: boolean;
  onClose: (deleted: boolean) => void;
}

const DeleteServerModal = ({ server, open, onClose: _onClose }: DeleteServerModalProps) => {
  const { notifySuccess } = useNotifications();

  const { mutate, isLoading, error, reset } = useMutation<void, APIError>({
    mutationFn: async () => {
      if (!server) return;

      await deleteServer(server.id);
    },
    onSuccess: async () => {
      notifySuccess('Server deleted successfully!');
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
                Are you sure you want to delete the server &quot;<strong>{server?.sourceHostname}</strong>&quot;?
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

export default DeleteServerModal;
