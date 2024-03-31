import { APIError, Application, User, UserRole } from '../../utils/types';
import { Button, Checkbox, Label, Modal, Spinner, TextInput } from 'flowbite-react';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useDebounce } from '../../utils/useDebounce';
import { dateToString } from '../../utils/utils';
import DeleteUserModal from './DeleteUserModal';
import { createUser, getUsersApps, setUsersApps, updateUser, usernameAvailable } from '../../utils/api';
import { useMutation, useQuery } from 'react-query';
import { useNotifications } from '../../contexts/NotificationContext';
import clsx from 'clsx';
import { HiOutlineTrash, HiSearch } from 'react-icons/hi';
import { useAppContext } from '../../contexts/AppContext';

interface EditUserModalProps {
  user?: User;
  creating?: boolean;
  onClose: (refresh: boolean) => void;
}

const EditUserModal = ({ user, creating, onClose }: EditUserModalProps) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({});
  const [userApplications, setUserApplications] = useState<Application[]>([]);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const { user: loggedInUser } = useAuth();
  const { notifySuccess, notifyError } = useNotifications();
  const { applications } = useAppContext();

  const sortedApplications = useMemo(() => {
    if (!applications) return [];
    if (!search) return applications.sort((a, b) => a.description.localeCompare(b.description)).sort(a => (userApplications.some(app => app.id === a.id) ? -1 : 1));

    return applications.filter(app => app.description.toLowerCase().includes(search.toLowerCase()));
  }, [userApplications, applications, search]);

  // Load what applications this user has
  const { isLoading: loadingUserApps, data: origUserApps } = useQuery<Application[], APIError>(
    ['user-apps', user?.id],
    async () => {
      if (!user) return [];
      return await getUsersApps(user.id);
    },
    {
      enabled: !!user,
      onSuccess: data => setUserApplications(data),
      onError: err => {
        notifyError('Failed to load user applications: ' + err.message, 10);
      }
    }
  );

  useEffect(() => {
    setNewUser(user || {});
    setUsernameError(null);
    setPasswordError(null);
    setUserApplications([]);
    setSearch('');
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

      const userAppsChanged =
        origUserApps
          ?.map(a => a.id)
          .sort()
          .join() !==
        userApplications
          .map(a => a.id)
          .sort()
          .join();
      let userId = user?.id;

      if (creating) {
        const res = await createUser({ ...newUser, role: newUser.role || UserRole.USER });
        userId = res.id;
      } else if (user) await updateUser(user.id, newUser);

      if (userAppsChanged && userId !== undefined)
        await setUsersApps(
          userId,
          userApplications.map(a => a.id)
        );
    },
    {
      onSuccess: () => {
        notifySuccess('User ' + (creating ? 'created' : 'updated') + ' successfully');
        onClose(true);
      },
      onError: err => {
        if (err.message === 'Invalid input') return; // Handled by validation form
        notifyError('Failed to save user: ' + err.message, 10);
      }
    }
  );

  const onChangeAppAccess = (e: React.ChangeEvent<HTMLInputElement>, app: Application) => {
    setUserApplications(u => (e.target.checked ? [...u, app] : u.filter(a => a.id !== app.id)));
  };

  return (
    <>
      <Modal show={!!user || creating} onClose={isLoading ? undefined : () => onClose(false)}>
        <Modal.Header className="flex items-center">{creating ? 'Create' : 'Edit'} User</Modal.Header>

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
                onChange={e => {
                  setNewUser(u => ({ ...u, role: e.target.checked ? UserRole.ADMIN : UserRole.USER }));
                  if (!e.target.checked) setUserApplications([]); // Clear apps if not admin to prevent UI desync
                }}
                disabled={isLoading}
              />
              <Label htmlFor="admin" className="flex">
                Admin
              </Label>
            </div>

            <Label className="mt-2">Assigned Applications</Label>
            {loadingUserApps || !sortedApplications ? (
              <Spinner />
            ) : newUser.role === UserRole.ADMIN ? (
              <p className="text-gray-500">Admins have access to view all applications</p>
            ) : (
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-2">
                <TextInput icon={HiSearch} placeholder="Search applications..." value={search} onChange={e => setSearch(e.target.value)} className="mb-2" disabled={isLoading} />

                <div className="flex flex-col gap-1 max-h-[150px] overflow-y-auto">
                  {!sortedApplications.length ? (
                    <p className="text-gray-500">No applications found</p>
                  ) : (
                    sortedApplications.map(app => (
                      <div key={app.id} className="flex items-center gap-2 mx-1">
                        <Checkbox id={'app-' + app.id} checked={userApplications.some(u => u.id === app.id)} onChange={e => onChangeAppAccess(e, app)} disabled={isLoading} />
                        <Label htmlFor={'app-' + app.id} className="text-md">
                          {app.description}{' '}
                          <small className="text-gray-500">
                            {app.servers.length} server{app.servers.length === 1 ? '' : 's'}
                          </small>
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

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

          <div className="w-full flex justify-between mt-6 flex-col xs:flex-row">
            <Button
              color="failure"
              className={clsx('mb-4 xs:mb-0', creating && 'invisible')}
              onClick={() => setDeleteModalOpen(true)}
              size="sm"
              disabled={user?.id === loggedInUser?.id || isLoading}
              title={user?.id === loggedInUser?.id ? 'You cannot delete yourself' : undefined}
            >
              <HiOutlineTrash className="mr-2" size={20} />
              Delete user
            </Button>

            <div className="flex gap-2 ml-auto">
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
