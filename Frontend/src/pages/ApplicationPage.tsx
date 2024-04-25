import { APIError, Server, UserRole} from '../utils/types';
import { Button, Spinner, Table, TextInput } from 'flowbite-react';
import { useEffect, useMemo, useState } from 'react';
import EditServerModal from './EditServerModal';
import { useAppContext } from '../contexts/AppContext';
import { queryClient } from '../main';
import { useNavigate, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { FaEdit, FaPlus } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useMutation } from 'react-query';
import { updateApplication } from '../utils/api';
import { useNotifications } from '../contexts/NotificationContext';
import "./DeleteApplicationModal"
import DeleteApplicationModal from './DeleteApplicationModal';
import { HiOutlineTrash } from 'react-icons/hi';

const ApplicationPage = () => {
  const [editingServer, setEditingServer] = useState<Server | undefined>(undefined);
  const [creatingServer, setCreatingServer] = useState<boolean>(false);
  const [editingName, setEditingName] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [deleteApplicationModalOpen, setDeleteApplicationModalOpen] = useState(false);

  const { user } = useAuth();
  const { applications } = useAppContext();
  const { id } = useParams();
  const { notifyError } = useNotifications();
  const nav = useNavigate();

  const application = useMemo(() => {
    return applications?.filter(a => a.id === Number(id))[0];
  }, [applications, id]);

  useEffect(() => {
    if (application) setNewName(application.description);
  }, [application]);

  const updateAppMutation = useMutation<unknown, APIError>({
    mutationFn: async () => {
      if (!application) return;
      const res = await updateApplication(application.id, newName);
      await queryClient.invalidateQueries('applications');

      setNewName(res.description);
      setEditingName(false);
    },
    onError: err => {
      notifyError(err.message, 10);
    }
  });

  if (!application && applications)
    return (
      <div className="p-4 md:mx-48">
        <h5 className="text-lg">Invalid Application ID</h5>
        <Button onClick={() => nav('/')}>Back</Button>
      </div>
    );

  return (
    <div className="p-4 md:mx-48">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          {editingName ? (
            <>
              <TextInput value={newName} onChange={e => setNewName(e.target.value)} className="w-24" disabled={updateAppMutation.isLoading} maxLength={3} />

              <Button
                size="sm"
                onClick={() => {
                  setEditingName(false);
                  setNewName(application?.description || '');
                }}
                color="light"
                disabled={updateAppMutation.isLoading}
                outline
              >
                Cancel
              </Button>
              <Button size="sm" onClick={() => updateAppMutation.mutate()} disabled={updateAppMutation.isLoading} isProcessing={updateAppMutation.isLoading}>
                Save
              </Button>
            </>
          ) : (
            <>
              {user?.role === UserRole.ADMIN && <FaEdit className="mt-2 cursor-pointer" color="gray" size={16} onClick={() => setEditingName(true)} />}
              <p className="text-2xl font-bold">{application?.description}</p>
            </>
          )}
        </div>

        {user?.role !== UserRole.ADMIN && (
          <Button className="h-min" size="sm" onClick={() => setCreatingServer(true)}>
            <FaPlus className="mr-1" size={20} />
            New Server
          </Button>
        )}
      </div>

      {!applications || !application ? (
        <Spinner className="w-full flex items-center" size="lg" />
      ) : !application.servers.length ? (
        <div className="p-4 center-x">
          <p className="text-lg">No servers found for this application</p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-16 px-1 pt-1">
          <Table>
            <Table.Head>
              <Table.HeadCell>Src IP</Table.HeadCell>
              <Table.HeadCell>Src Hostname</Table.HeadCell>
              <Table.HeadCell>Dest IP</Table.HeadCell>
              <Table.HeadCell>Dest Hostname</Table.HeadCell>
              <Table.HeadCell>Dest Port</Table.HeadCell>
              <Table.HeadCell>Enabled</Table.HeadCell>
              {user?.role != UserRole.ADMIN && (
                <Table.HeadCell>
                  <span className="sr-only">Menu</span>
                </Table.HeadCell>
              )}
            </Table.Head>
            <Table.Body className="divide-y">
              {application.servers.map(server => (
                <Table.Row key={server.id} className={clsx('bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-100 transition-colors duration-100')}>
                  <Table.Cell>{server.sourceIpAddress}</Table.Cell>
                  <Table.Cell>{server.sourceHostname}</Table.Cell>
                  <Table.Cell>{server.destinationIpAddress}</Table.Cell>
                  <Table.Cell>{server.destinationHostname}</Table.Cell>
                  <Table.Cell>{server.destinationPort}</Table.Cell>
                  <Table.Cell>{server.enabled ? 'Yes' : 'No'}</Table.Cell>
                  {user?.role != UserRole.ADMIN && (
                    <Table.Cell>
                      <p className="flex items-center gap-1 text-cyan cursor-pointer w-min ml-auto" onClick={() => setEditingServer(server)}>
                        <FaEdit size={16} />
                        Edit
                      </p>
                    </Table.Cell>
                  )}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}

      {user?.role == UserRole.ADMIN && (
        <div className="w-full flex justify-between mt-6 flex-col xs:flex-row">
          <Button color="failure" onClick={() => setDeleteApplicationModalOpen(true)} size="sm">
              <HiOutlineTrash className="mr-2" size={20} />
              Delete Application
            </Button>
        </div>
      )}

      <DeleteApplicationModal
        application={application}
        open={deleteApplicationModalOpen}
        onClose={deleted=>{
          setDeleteApplicationModalOpen(false);
          if(deleted) {
            queryClient.refetchQueries("applications");
            nav("/");
          }
        }}
      />

      <EditServerModal
        server={editingServer}
        creating={creatingServer}
        appId={application?.id || 0}
        onClose={refresh => {
          if (refresh) {
            queryClient.invalidateQueries('applications');
          }

          setEditingServer(undefined);
          setCreatingServer(false);
        }}
      />
    </div>
  );
};

export default ApplicationPage;
