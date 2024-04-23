import { APIError, Server } from '../utils/types';
import { Button, Checkbox, Label, Modal, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { dateToString } from '../utils/utils';
import { createServer, updateServer } from '../utils/api';
import { useMutation } from 'react-query';
import { useNotifications } from '../contexts/NotificationContext';
import clsx from 'clsx';
import { HiOutlineTrash } from 'react-icons/hi';

interface EditServerModalProps {
  server?: Server;
  creating?: boolean;
  onClose: (refresh: boolean) => void;
  appId: number;
}

const EditServerModal = ({ server, creating, onClose, appId }: EditServerModalProps) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newServer, setNewServer] = useState<Partial<Server>>({});

  const { notifySuccess, notifyError } = useNotifications();

  useEffect(() => {
    setNewServer(server || {});
  }, [server, creating]);

  const { mutate: save, isLoading } = useMutation<unknown, APIError>(
    async () => {
      if (creating) {
        await createServer({ ...newServer, appInfoId: appId });
      } else if (server) await updateServer(server.id, newServer);
    },
    {
      onSuccess: () => {
        notifySuccess('Server ' + (creating ? 'created' : 'updated') + ' successfully');
        onClose(true);
      },
      onError: err => {
        if (err.message === 'Invalid input') return; // Handled by validation form
        notifyError('Failed to save server: ' + err.message, 10);
      }
    }
  );

  return (
    <>
      <Modal show={!!server || creating} onClose={isLoading ? undefined : () => onClose(false)}>
        <Modal.Header className="flex items-center">{creating ? 'Create' : 'Edit'} Server</Modal.Header>

        <Modal.Body>
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="source-ip">
                Source IP
                <small className="text-red-500 text-sm"> *</small>
              </Label>
              <TextInput
                id="source-ip"
                value={newServer.sourceIpAddress || ''}
                onChange={e => setNewServer(s => ({ ...s, sourceIpAddress: e.target.value.trim() }))}
                maxLength={15}
                //helperText={usernameError}
                //color={usernameError ? 'failure' : undefined}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="sourceHostName">
                Source Host Name
                <small className="text-red-500 text-sm"> *</small>
              </Label>
              <TextInput
                id="sourceHostName"
                value={newServer.sourceHostname || ''}
                onChange={e => setNewServer(s => ({ ...s, sourceHostname: e.target.value.trim() }))}
                maxLength={100}
                //helperText={usernameError}
                //color={usernameError ? 'failure' : undefined}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="destinationIp">
                Destination IP Address
                <small className="text-red-500 text-sm"> *</small>
              </Label>
              <TextInput
                id="destinationIp"
                value={newServer.destinationIpAddress || ''}
                onChange={e => setNewServer(s => ({ ...s, destinationIpAddress: e.target.value.trim() }))}
                maxLength={15}
                //helperText={usernameError}
                //color={usernameError ? 'failure' : undefined}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="destinationHostName">
                Destination Host Name
                <small className="text-red-500 text-sm"> *</small>
              </Label>
              <TextInput
                id="destinationHostName"
                value={newServer.destinationHostname || ''}
                onChange={e => setNewServer(s => ({ ...s, destinationHostname: e.target.value.trim() }))}
                maxLength={100}
                //helperText={usernameError}
                //color={usernameError ? 'failure' : undefined}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="destinationPort">
                Destination Port
                <small className="text-red-500 text-sm"> *</small>
              </Label>
              <TextInput
                id="destinationPort"
                value={newServer.destinationPort || ''}
                onChange={e => setNewServer(s => ({ ...s, destinationPort: Number(e.target.value.trim()) }))}
                maxLength={10}
                //helperText={usernameError}
                //color={usernameError ? 'failure' : undefined}
                disabled={isLoading}
              />
            </div>
            <div>
              <Checkbox id="disabled" checked={!newServer.enabled} onChange={e => setNewServer(s => ({ ...s, enabled: !e.target.checked }))} />
              <Label className="ml-2" htmlFor="disabled">
                Disabled
              </Label>
            </div>

            <div className={clsx('flex mt-2 justify-between gap-2 dark:text-white', creating && 'hidden')}>
              <div>
                <p className="font-medium text-sm">Created</p>
                <p>{dateToString(server?.createdAt)}</p>
                <p className="text-sm">
                  By <span className="font-medium">{server?.createdBy}</span>
                </p>
              </div>

              <div>
                <p className="font-medium text-sm">Last Modified</p>
                <p>{dateToString(server?.modifiedAt)}</p>

                {server?.modifiedBy && (
                  <p className="text-sm">
                    By <span className="font-medium">{server?.modifiedBy}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="w-full flex justify-between mt-6 flex-col xs:flex-row">
            <Button color="failure" className={clsx('mb-4 xs:mb-0', creating && 'invisible')} onClick={() => setDeleteModalOpen(true)} size="sm" disabled={isLoading}>
              <HiOutlineTrash className="mr-2" size={20} />
              Delete Server
            </Button>

            <div className="flex gap-2 ml-auto">
              <Button color="light" onClick={() => onClose(false)} size="sm" disabled={isLoading}>
                Cancel
              </Button>
              <Button color="dark" onClick={() => save()} size="sm" disabled={isLoading} isProcessing={isLoading}>
                {creating ? 'Create' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* <DeleteUserModal
        user={user}
        open={deleteModalOpen}
        onClose={deleted => {
          setDeleteModalOpen(false);
          if (deleted) onClose(true);
        }}
      /> */}
    </>
  );
};

export default EditServerModal;
