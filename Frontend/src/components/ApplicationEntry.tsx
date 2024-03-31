import { Application } from '../utils/types';
import { useState } from 'react';
import { FaRegWindowMaximize } from 'react-icons/fa';

interface ApplicationEntryProps {
  app: Application;
}

const ApplicationEntry = ({ app }: ApplicationEntryProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col border border-gray-200 dark:border-gray-700 rounded-lg p-2 shadow-wide border-l-8 border-l-cyan dark:border-l-cyan max-w-sm">
      <div className="flex items-center gap-2">
        {/* <FaRegWindowMaximize size={24} /> */}
        <p className="text-lg font-medium">{app.description}</p>
      </div>
      {!expanded && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {app.servers.length} server{app.servers.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* <p onClick={() => deleteApplication(app.id)}>X</p> */}
    </div>
  );
};

export default ApplicationEntry;
