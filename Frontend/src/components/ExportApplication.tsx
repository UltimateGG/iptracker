import { Application } from '../utils/types';
import { HiDownload } from 'react-icons/hi';

interface ApplicationEntryProps {
  app: Application;
}

const ExportApplication = ({ app }: ApplicationEntryProps) => {
  const downloadCSV = () => {
    const applicationMeta = 'Application ID,Description,Created At,Created By,Modified At,Modified By\n';
    const applicationInfo = `${app.id},${app.description},${app.createdAt},${app.createdBy},${app.modifiedAt},${app.modifiedBy}\n\n`;
    const applicationData = applicationMeta.concat(applicationInfo);
    const serverMeta = 'Server ID,Source IP,Source Hostname,Destination IP,Destination Hostname,Destination Port,Enabled,Created At,Created By,Modified At,Modified By\n';
    let serverInfo = '';
    for (let i = 0; i < app.servers.length; i++) {
      const server = app.servers[i];
      serverInfo = serverInfo.concat(`${server.id},${server.sourceIpAddress},${server.sourceHostname},${server.destinationIpAddress},${server.destinationHostname},${server.destinationPort},${server.enabled},${server.createdAt},${server.createdBy},${server.modifiedAt},${server.modifiedBy}\n`);
    }
    const serverData = serverMeta.concat(serverInfo);
    const exportData = applicationData.concat(serverData);
    const csvContent = `data:text/csv;charset=utf-8,${exportData}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `application_${app.id}_data` + '.csv');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <HiDownload onClick={downloadCSV} size={20} className="cursor-pointer fill-blue-400 stroke-blue-400"/>
  );
};

export default ExportApplication;
