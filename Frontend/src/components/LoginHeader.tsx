import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


const LoginHeader = () => {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand>Commerce IP Tracker</Navbar.Brand>
        <Nav className="ms-auto">
          <Nav.Link href="/home">Login</Nav.Link>
          <Nav.Link href="/home">Sign Up</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default LoginHeader;
