import { useState } from 'react';
import { Spinner } from 'flowbite-react';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import React from 'react';
import { Server } from '../utils/types';

const HomePage = () => {
  const { user } = useAuth();
  const { applications } = useAppContext();

  const rowColors = ['#f0f0f0', '#e0e0e0'];
  const headerStyle = {
    backgroundColor: '#00824d',
    color: 'white'
  };

  // State to manage which row is expanded
  const [expandedRow, setExpandedRow] = useState(null);

  // Function to sort servers by ID
  const sortServersById = (servers: Array<Server>) => {
    return servers.slice().sort((a, b) => a.id - b.id);
  };

  return (
    <div className="format m-4">
      {user && (
        <div>
          <h2>Welcome back, {user.username}!</h2>

          <p>Your Applications</p>
          {!applications ? (
            <Spinner />
          ) : (
            <table>
              <thead>
                <tr>
                  <th style={headerStyle}>ID</th>
                  <th style={headerStyle}>Description</th>
                  <th style={headerStyle}>Servers</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, index) => (
                  <React.Fragment key={app.id}>
                    <tr
                      style={{ backgroundColor: rowColors[index % rowColors.length] }}
                      onClick={() => setExpandedRow(expandedRow === app.id ? null : app.id)}
                    >
                      <td>{app.id}</td>
                      <td>{app.description}</td>
                      <td>{app.servers.length}</td>
                    </tr>
                    {expandedRow === app.id && (
                      <tr>
                        <td colSpan={3}>
                          {/* Nested table for server information */}
                          <table>
                            <thead>
                              <tr>
                                <th style={headerStyle}>Source IP Address</th>
                                <th style={headerStyle}>Source Hostname</th>
                                <th style={headerStyle}>Destination Hostname</th>
                                <th style={headerStyle}>Destination IP Address</th>
                                <th style={headerStyle}>Destination Port</th>
                                <th style={headerStyle}>Is Enabled</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sortServersById(app.servers).map((server) => (
                                <tr key={server.id}>
                                  <td>{server.sourceIpAddress}</td>
                                  <td>{server.sourceHostname}</td>
                                  <td>{server.destinationHostname}</td>
                                  <td>{server.destinationIpAddress}</td>
                                  <td>{server.destinationPort}</td>
                                  <td>{server.isEnabled ? 'Yes' : 'No'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
