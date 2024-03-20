import LoginHeader from '../components/LoginHeader';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';


const LoginPage = () => {
  return (
    <>
      <LoginHeader />
      <Container fluid className="d-flex align-items-center justify-content-center h-100 w-full">
        <Container className="d-flex align-items-center justify-content-center w-50 min-w-96/3 h-50 min-h-96" style={{backgroundColor: 'grey'}}>
          <Row className="text-center">
            <Button href="/home">Login</Button>
            <Button href="/login">Login</Button>
          </Row>
        </Container>
      </Container>
    </>
  );
};

export default LoginPage;
