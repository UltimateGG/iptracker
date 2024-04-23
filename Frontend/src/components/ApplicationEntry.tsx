import { Button, Table } from 'flowbite-react';
import { Application } from '../utils/types';
import { useState } from 'react';
import { FaRegWindowMaximize } from 'react-icons/fa';
import { HiArrowRight, HiChevronDown, HiChevronUp } from 'react-icons/hi';
import ExportApplication from './ExportApplication';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

interface ApplicationEntryProps {
  app: Application;
}

const ApplicationEntry = ({ app }: ApplicationEntryProps) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const nav = useNavigate();

  return (
    <div
      className={clsx('flex flex-col border border-gray-200 dark:border-gray-700 rounded-lg shadow-wide border-l-8 border-l-cyan dark:border-l-cyan', !expanded && 'cursor-pointer')}
      onClick={expanded ? undefined : toggleExpanded}
    >
      <div className={clsx('flex justify-between items-center gap-2 p-2 cursor-pointer', expanded ? 'border-b bg-gray-50' : 'pb-0')} onClick={toggleExpanded}>
        <div className="flex items-center gap-2">
          <FaRegWindowMaximize size={24} />
          <p className="text-lg font-medium">{app.description}</p>
        </div>

        {expanded ? <HiChevronUp size={20} /> : <HiChevronDown size={20} />}
      </div>

      <div className="p-1">
        {expanded ? (
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium my-2 ml-1">
                Servers
              </h3>
              <ExportApplication app={app} />
            </div>

            <div className="overflow-x-auto pb-2 px-1">
              <Table>
                <Table.Head>
                  <Table.HeadCell>Src IP</Table.HeadCell>
                  <Table.HeadCell>Src Hostname</Table.HeadCell>
                  <Table.HeadCell>Dest IP</Table.HeadCell>
                  <Table.HeadCell>Dest Hostname</Table.HeadCell>
                  <Table.HeadCell>Dest Port</Table.HeadCell>
                  <Table.HeadCell>Enabled</Table.HeadCell>
                </Table.Head>

                <Table.Body className="divide-y">
                  {app.servers.map(server => (
                    <Table.Row key={server.id} className={clsx('bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-100 transition-colors duration-100')}>
                      <Table.Cell>{server.sourceIpAddress}</Table.Cell>
                      <Table.Cell>{server.sourceHostname}</Table.Cell>
                      <Table.Cell>{server.destinationIpAddress}</Table.Cell>
                      <Table.Cell>{server.destinationHostname}</Table.Cell>
                      <Table.Cell>{server.destinationPort}</Table.Cell>
                      <Table.Cell>{server.enabled ? 'Yes' : 'No'}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>

            <Button onClick={() => nav('/application/' + app.id)} className="w-min h-min mt-4 m-2 ml-auto">
              Edit
              <HiArrowRight className="ml-2" size={16} />
            </Button>
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {app.servers.length} server{app.servers.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  );
};

export default ApplicationEntry;
