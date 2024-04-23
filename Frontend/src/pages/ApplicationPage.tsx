import { Server, UserRole } from '../utils/types';
import { Button, Spinner, Table } from 'flowbite-react';
import { useMemo, useState } from 'react';
import EditServerModal from './EditServerModal';
import { useAppContext } from '../contexts/AppContext';
import { queryClient } from '../main';
import { useNavigate, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { FaEdit, FaPlus } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const ApplicationPage = () => {
  const [editingServer, setEditingServer] = useState<Server | undefined>(undefined);
  const [creatingServer, setCreatingServer] = useState<boolean>(false);

  const { user } = useAuth();
  const { applications } = useAppContext();
  const { id } = useParams();
  const nav = useNavigate();

  const application = useMemo(() => {
    return applications?.filter(a => a.id === Number(id))[0];
  }, [applications, id]);

  if (!application && applications)
    return (
      <div className="p-4 md:mx-48">
        <h5 className="text-lg">Invalid Application ID</h5>
        <Button onClick={() => nav('/')}>Back</Button>
      </div>
    );

  return (
    <div className="p-4 md:mx-48">
      {user?.role !== UserRole.ADMIN && (
        <div className="flex items-center justify-between px-1">
          <Button className="mb-4 ml-auto h-min" size="sm" onClick={() => setCreatingServer(true)}>
            <FaPlus className="mr-1" size={20} />
            New Server
          </Button>
        </div>
      )}

      {!applications || !application ? (
        <Spinner className="w-full flex items-center" size="lg" />
      ) : (
        <div className="overflow-x-auto pb-16 px-1 pt-1">
          <p className="text-xl font-bold mb-4">{application.description}</p>
          <Table>
            <Table.Head>
              <Table.HeadCell>Src IP</Table.HeadCell>
              <Table.HeadCell>Src Hostname</Table.HeadCell>
              <Table.HeadCell>Dest IP</Table.HeadCell>
              <Table.HeadCell>Dest Hostname</Table.HeadCell>
              <Table.HeadCell>Dest Port</Table.HeadCell>
              <Table.HeadCell>Enabled</Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Menu</span>
              </Table.HeadCell>
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

      <EditServerModal
        server={editingServer}
        creating={creatingServer}
        appId={application?.id || 0}
        onClose={refresh => {
          if (refresh) {
            queryClient.refetchQueries('applications');
          }

          setEditingServer(undefined);
          setCreatingServer(false);
        }}
      />
    </div>
  );
};

export default ApplicationPage;
