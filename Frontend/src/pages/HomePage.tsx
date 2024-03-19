import { useState } from 'react';
import ExampleComponent from '../ExampleComponent';
import { getUser } from '../api';
import { APIError } from '../types';


const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
    <h1>IP Whitelist Tracker Home</h1>
    </div>
  );
};

export default HomePage;
