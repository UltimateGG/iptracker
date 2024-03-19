import ChangePage from '../ChangePage';


const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1>IP Whitelist Tracker Home</h1>
      <ChangePage url={'login'} />
    </div>
  );
};

export default HomePage;
