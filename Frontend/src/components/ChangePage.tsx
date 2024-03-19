import { Button } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';


interface PageDetails {
  url: string;
}
  
const ChangePage = ({ url }: PageDetails) => {

  const navigate = useNavigate();

  const handleLoginButtonClick = () => {
    navigate(`/${url}`, { replace: true });
  };

  return (
    <>
      <Button onClick={handleLoginButtonClick}>Go to {url.charAt(0).toUpperCase() + url.slice(1)} Page</Button>
    </>
  );
};

export default ChangePage;
