import { Button, Checkbox, Label, Modal, Spinner, TextInput } from 'flowbite-react';
import { useMemo, useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { HiSearch } from 'react-icons/hi';
import { APIError, User, UserRole } from '../../utils/types';
import { useMutation } from 'react-query';
import { createApplication } from '../../utils/api';
import { useNotifications } from '../../contexts/NotificationContext';
import clsx from 'clsx';
import { queryClient } from '../../main';

interface CreateApplicationModalProps {
  onClose: () => void;
}

const CreateApplicationModal = ({ onClose }: CreateApplicationModalProps) => {
  const [description, setDescription] = useState('');
  const [search, setSearch] = useState('');
  const [allowedUsers, setAllowedUsers] = useState<number[]>([]);

  const { notifySuccess, notifyError } = useNotifications();
  const { users, loadingUsers } = useAppContext();

  const sortedUsers = useMemo(
    () =>
      users
        .sort((a, b) => a.username.localeCompare(b.username))
        .sort(a => (allowedUsers.includes(a.id) ? -1 : 1))
        .filter(u => u.username.toLowerCase().includes(search.toLowerCase())),
    [users, allowedUsers, search]
  );

  const onChangeAppAccess = (e: React.ChangeEvent<HTMLInputElement>, user: User) => {
    if (e.target.checked) {
      setAllowedUsers([...allowedUsers, user.id]);
    } else {
      setAllowedUsers(allowedUsers.filter(id => id !== user.id));
    }
  };

  const { mutate: create, isLoading } = useMutation<void, APIError>(
    async () => {
      await createApplication(description, allowedUsers);
      await queryClient.refetchQueries('applications');
      notifySuccess('Application created successfully');
      onClose();
    },
    { onError: e => notifyError('Failed to create application: ' + e.message, 10) }
  );

  return (
    <Modal show onClose={isLoading ? undefined : onClose}>
      <Modal.Header className="flex items-center">Create Application</Modal.Header>

      <Modal.Body>
        <Label htmlFor="desc">Description</Label>
        <TextInput id="desc" helperText="3 letter application description" maxLength={3} value={description} onChange={e => setDescription(e.target.value)} />

        <div className="mt-2">
          <Label>Assigned Users</Label>
          {loadingUsers ? (
            <Spinner />
          ) : (
            <div className="border border-gray-300 rounded-lg p-2">
              <TextInput icon={HiSearch} placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="mb-2" disabled={isLoading} />

              <div className="flex flex-col gap-1 max-h-[150px] overflow-y-auto">
                {sortedUsers.map(u => (
                  <div key={u.id} className={clsx('flex items-center gap-2 mx-1', u.role === UserRole.ADMIN && 'opacity-70')}>
                    <Checkbox
                      id={'user-' + u.id}
                      checked={allowedUsers.some(id => id === u.id) || u.role === UserRole.ADMIN}
                      onChange={e => onChangeAppAccess(e, u)}
                      disabled={u.role === UserRole.ADMIN || isLoading}
                    />
                    <Label htmlFor={'user-' + u.id} className="text-md">
                      {u.username} {u.role === UserRole.ADMIN && <small className="text-gray-500">Admin</small>}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button color="light" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button color="dark" onClick={() => create()} disabled={isLoading} isProcessing={isLoading}>
            Create
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CreateApplicationModal;
