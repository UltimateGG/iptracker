import { Modal, Spinner, Button } from 'flowbite-react';
import clsx from 'clsx';
import { APIError, Application } from '../utils/types';
import { useMutation } from 'react-query';
import { deleteApplication } from '../utils/api';
import { useNotifications } from '../contexts/NotificationContext';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { queryClient } from '../main';

interface DeleteApplicationModalProps {
  application?: Application;
  open: boolean;
  onClose: (deleted: boolean) => void;
}

const DeleteApplicationModal = ({application, open, onClose: _onClose}: DeleteApplicationModalProps) => {
  const {notifySuccess} = useNotifications();

  const {mutate, isLoading, error, reset} = useMutation<void, APIError>({
    mutationFn: async() => {
      if(!application) return;
      await deleteApplication(application.id);
      await queryClient.refetchQueries('applications');
    },
    onSuccess: async() => {
      notifySuccess("Application deleted successfully!");
      onClose(true);
    }
  })

  const onClose = (deleted: boolean = false) => {
    _onClose(deleted);
    reset();
  }

  return (
    <Modal show={open} size="md" onClose={onClose} popup dismissible={!isLoading}>
      <Modal.Header className={clsx(isLoading && 'invisible')} />

      <Modal.Body>
        <div className="text_center">
          <div className="mx-auto mb-4 h-14 w-14">
            {isLoading ? (
              <Spinner className="w-full flex items-center" color="failure" size="x1" />
              ):(
              <HiOutlineExclamationCircle className={clsx("h-14 w-14", error ? "text-red-500" : "text-gray-400 dark:text-gray-200")} />  
              )}
          </div>
          <h3 className="mb-5 text-lg fong-normal text-gray-500 dark:text-gray-400">
            {isLoading ? (
              "Deleting application..."
            ) : error ? (
              <>Failed to delete server: {error.message}</>
            ) : (
              <> 
                Are you sure you want to delete the application &quot;<strong>{application?.description}</strong>&quot;?
              </>
            )}
          </h3>

          {!isLoading && (
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => mutate()}>
                {error ? "Retry" : "Yes, delete"}
              </Button>
              <Button color="light" onClick={() => onClose()}>
                {error ? "Cancel" : "No, Cancel"}
              </Button>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteApplicationModal;