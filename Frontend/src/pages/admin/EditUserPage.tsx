import { useParams } from 'react-router-dom';

const EditUserPage = () => {
  const { id } = useParams();

  return <div>USER {id}</div>;
};

export default EditUserPage;
