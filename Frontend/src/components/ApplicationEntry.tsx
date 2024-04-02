import { Application } from '../utils/types';
import { useState } from 'react';
import { FaRegWindowMaximize } from 'react-icons/fa';

interface ApplicationEntryProps {
  app: Application;
}

const ApplicationEntry = ({ app }: ApplicationEntryProps) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="flex flex-col border border-gray-200 dark:border-gray-700 rounded-lg p-2 shadow-wide border-l-8 border-l-cyan dark:border-l-cyan" onClick={toggleExpanded}>
      <div className="flex items-center gap-2">
        <FaRegWindowMaximize size={24} />
        <p className="text-lg font-medium">{app.description}</p>
      </div>
      {expanded && (
        <div>
          <table>
            <thead>
              <tr>
                <th>Source IP</th>
                <th>Source Hostname</th>
                <th>Destination IP</th>
                <th>Destination Hostname</th>
                <th>Destination Port</th>
                <th>Enabled</th>
              </tr>
            </thead>
            <tbody>
              {app.servers.map((server, index) => (
                <tr key={index}>
                  <td className="text-sm text-gray-500 dark:text-gray-400">{server.sourceIpAddress}</td>
                  <td className="text-sm text-gray-500 dark:text-gray-400">{server.sourceHostname}</td>
                  <td className="text-sm text-gray-500 dark:text-gray-400">{server.destinationIpAddress}</td>
                  <td className="text-sm text-gray-500 dark:text-gray-400">{server.destinationHostname}</td>
                  <td className="text-sm text-gray-500 dark:text-gray-400">{server.destinationPort}</td>
                  <td className="text-sm text-gray-500 dark:text-gray-400">{server.isEnabled}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        // <div>
        //   {app.servers.map((server, index) => (
        //     <>
        //       <p key={index} className="text-sm text-gray-500 dark:text-gray-400">{server.sourceIpAddress}</p>
        //       <p key={index} className="text-sm text-gray-500 dark:text-gray-400">{server.sourceHostname}</p>
        //       <p key={index} className="text-sm text-gray-500 dark:text-gray-400">{server.destinationIpAddress}</p>
        //       <p key={index} className="text-sm text-gray-500 dark:text-gray-400">{server.destinationHostname}</p>
        //       <p key={index} className="text-sm text-gray-500 dark:text-gray-400">{server.destinationPort}</p>
        //       <p key={index} className="text-sm text-gray-500 dark:text-gray-400">{server.isEnabled}</p>
        //     </>
        //   ))}
        // </div>
      )}
      {!expanded && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {app.servers.length} server{app.servers.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
};

export default ApplicationEntry;
