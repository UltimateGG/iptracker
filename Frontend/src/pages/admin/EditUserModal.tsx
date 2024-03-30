import { APIError, User, UserRole } from '../../utils/types';
import { Button, Checkbox, Label, Modal, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { TrashBin } from 'flowbite-react-icons/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useDebounce } from '../../utils/useDebounce';
import { dateToString } from '../../utils/utils';
import DeleteUserModal from './DeleteUserModal';
import { createUser, updateUser, usernameAvailable } from '../../utils/api';
import { useMutation } from 'react-query';
import { useNotifications } from '../../contexts/NotificationContext';
import clsx from 'clsx';

interface EditUserModalProps {
  user?: User;
  creating?: boolean;
  onClose: (refresh: boolean) => void;
}

const EditUserModal = ({ user, creating, onClose }: EditUserModalProps) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({});
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const { user: loggedInUser } = useAuth();
  const { notifySuccess, notifyError } = useNotifications();

  useEffect(() => {
    setNewUser(user || {});
    setUsernameError(null);
    setPasswordError(null);
  }, [user, creating]);

  const validateUsername = async (submitting: boolean = false) => {
    if (!creating && !user) return true; // Prevent flickering error messages on initial load
    if ((!creating || submitting) && !newUser.username) return setUsernameError('Username is required');
    if (newUser.username && newUser.username.length < 3) return setUsernameError('Username must be at least 3 characters long');

    // Don't check on submit again, submit will check it for us, saves a request
    const allowed = newUser.username === user?.username || submitting ? true : await usernameAvailable(newUser.username || '');

    setUsernameError(allowed ? null : 'Username is already taken');
    return allowed;
  };

  const validatePassword = (submitting: boolean = false) => {
    if (!creating && !newUser.password) delete newUser.password; // incase its blank str

    if (submitting && creating && !newUser.password) return setPasswordError('Password is required');
    if (newUser.password && newUser.password.length < 6) return setPasswordError('Password must be at least 6 characters long');

    setPasswordError(null);
    return true;
  };

  const validateUsernameDebounced = useDebounce(validateUsername, 400);

  useEffect(() => {
    validateUsernameDebounced();
    validatePassword();
  }, [newUser]);

  const { mutate: save, isLoading } = useMutation<unknown, APIError>(
    async () => {
      if (usernameError || passwordError || !validateUsername(true) || !validatePassword(true)) throw new Error('Invalid input');

      if (creating) return await createUser({ ...newUser, role: newUser.role || UserRole.USER });

      if (!user) return;
      await updateUser(user.id, newUser);
    },
    {
      onSuccess: () => {
        notifySuccess('User ' + (creating ? 'created' : 'updated') + ' successfully');
        onClose(true);
      },
      onError: err => {
        notifyError('Failed to save user: ' + err.message, 10);
      }
    }
  );

  return (
    <>
      <Modal show={!!user || creating} onClose={isLoading ? undefined : () => onClose(false)}>
        <Modal.Header>{creating ? 'Create' : 'Edit'} User</Modal.Header>

        <Modal.Body>
          <div className="flex flex-col gap-2">
            <div>
              <Label htmlFor="username">
                Username
                <small className="text-red-500 text-sm"> *</small>
              </Label>
              <TextInput
                id="username"
                value={newUser.username || ''}
                onChange={e => setNewUser(u => ({ ...u, username: e.target.value.trim() }))}
                maxLength={32}
                helperText={usernameError}
                color={usernameError ? 'failure' : undefined}
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="password">
                {creating ? '' : 'New '}Password
                {creating ? <small className="text-red-500 text-sm"> *</small> : <small className="text-gray-500"> optional</small>}
              </Label>
              <TextInput
                id="password"
                type="password"
                value={newUser.password || ''}
                onChange={e => setNewUser(u => ({ ...u, password: e.target.value.trim() }))}
                maxLength={32}
                helperText={passwordError}
                color={passwordError ? 'failure' : undefined}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center gap-2 mt-4">
              <Checkbox
                id="admin"
                checked={newUser.role === UserRole.ADMIN}
                onChange={e => setNewUser(u => ({ ...u, role: e.target.checked ? UserRole.ADMIN : UserRole.USER }))}
                disabled={isLoading}
              />
              <Label htmlFor="admin" className="flex">
                Admin
              </Label>
            </div>

            <div className={clsx('flex mt-2 justify-between gap-2 dark:text-white', creating && 'hidden')}>
              <div>
                <p className="font-medium text-sm">Created</p>
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
                    By <span className="font-medium">{user?.modifiedBy}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="w-full flex justify-between mt-6">
            <Button
              color="failure"
              className={creating ? 'invisible' : undefined}
              onClick={() => setDeleteModalOpen(true)}
              size="sm"
              disabled={user?.id === loggedInUser?.id || isLoading}
              title={user?.id === loggedInUser?.id ? 'You cannot delete yourself' : undefined}
            >
              <TrashBin />
              Delete user
            </Button>

            <div className="flex gap-2">
              <Button color="light" onClick={() => onClose(false)} size="sm" disabled={isLoading}>
                Cancel
              </Button>
              <Button color="dark" onClick={() => save()} size="sm" disabled={!!usernameError || !!passwordError || isLoading} isProcessing={isLoading}>
                {creating ? 'Create' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <DeleteUserModal
        user={user}
        open={deleteModalOpen}
        onClose={deleted => {
          setDeleteModalOpen(false);
          if (deleted) onClose(true);
        }}
      />
    </>
  );
};

export default EditUserModal;
