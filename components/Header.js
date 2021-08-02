import React from 'react'
import Link from 'next/link'
import {Container, Navbar, Nav } from 'react-bootstrap';

const Header = (props) => {
    return (
      
      <Navbar bg="secondary" variant="dark">
        <Container>
          <Link href="/" passHref>
            <Navbar.Brand>
              <img
                alt=""
                src={"/crowdcoin-icon.png"}
                width={32}
                height={32}
              />
              <p className = "d-inline-block my-0 mx-2 align-middle"> Crowdcoin </p>
            </Navbar.Brand>
          </Link>
          <Nav className="ms-auto">
            <Link href="/campaigns/new" passHref>
              <Nav.Link active>Add Campaign</Nav.Link>
            </Link>
            <Link href="/" passHref>
              <Nav.Link active>Home</Nav.Link>
            </Link>
          </Nav>
        </Container>
      </Navbar>
    )
}

export default Header