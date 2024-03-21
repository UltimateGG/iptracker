import MainHeader from '../components/MainHeader';

const HomePage = () => {
  return (
    <div>
      <MainHeader />

      <div className="flex flex-col items-center justify-center h-full">
        <h1>IP Whitelist Tracker Home</h1>
      </div>
    </div>
  );
};

export default HomePage;
