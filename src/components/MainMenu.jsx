import { Navbar, Nav } from 'rsuite'

const MainMenu = () => {
  return (
    <Navbar appearance="inverse">
      <Nav>
        <Nav.Item eventKey="home">home</Nav.Item>
        <Nav.Item eventKey="config">config</Nav.Item>
        <Nav.Item eventKey="account">account</Nav.Item>
      </Nav>
    </Navbar>
  )
}

export default MainMenu
