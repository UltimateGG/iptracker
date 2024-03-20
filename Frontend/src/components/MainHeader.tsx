import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


const MainHeader = () => {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand>Commerce IP Tracker</Navbar.Brand>
        <Nav className="ms-auto">
          <Nav.Link href="/home">Home</Nav.Link>
          {/* for testing purposes */}
          <Nav.Link href="/login">Login</Nav.Link>
          {/* add more links as more pages are added */}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default MainHeader;
