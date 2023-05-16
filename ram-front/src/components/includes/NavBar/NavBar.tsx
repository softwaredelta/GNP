// (c) Delta Software 2023, rights reserved.

import { Avatar, Dropdown, Navbar } from "flowbite-react";

import LogoRAM from "../../../assets/imgs/Ram_LogoInv.png";
import { Link, useLocation } from "react-router-dom";
import { useCallback } from "react";

interface Props {
  onLogout: () => void;
  username?: string;
  useremail?: string;
  role?: string;
}

function NavBar({ onLogout, useremail, username, role }: Props) {
  const route = useLocation();
  const isActive = useCallback(
    (link: RegExp) => {
      return link.test(route.pathname);
    },
    [route.pathname],
  );

  return (
    <Navbar
      className="border border-black shadow-md "
      fluid={true}
      style={{
        backgroundColor: "#e9e9e9",
        border: "1px solid #0000",
      }}
    >
      <Navbar.Brand href="#Home">
        <img src={LogoRAM} className="ml-2 h-20" alt="Grupo Asesores Logo" />
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline={true}
          label={
            <Avatar
              size="lg"
              rounded={true}
              alt="User settings"
              img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
            />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">{username}</span>
            <span className="block truncate text-sm font-medium">
              {useremail}
            </span>
          </Dropdown.Header>
          <Link to="/">
            <Dropdown.Item>Ver Perfil</Dropdown.Item>
          </Link>
          <Link to="/help">
            <Dropdown.Item>Ayuda</Dropdown.Item>
          </Link>
          <Dropdown.Divider />
          <Dropdown.Item onClick={onLogout} data-testid="logout-button">
            Salir
          </Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link
          as={Link}
          to="/"
          className="mx-8 text-lg active:bg-amber-500"
          active={isActive(/^\/$/i)}
        >
          Home
        </Navbar.Link>
        <Navbar.Link
          as={Link}
          to="/groups"
          className="mx-8  text-lg text-gray-900 "
          active={isActive(/^\/(group|delivery)/i)}
        >
          Grupos
        </Navbar.Link>
        {role === "manager" ? (
          <Navbar.Link
            as={Link}
            to="/verify-sales"
            className="mx-8  text-lg text-gray-900"
            active={isActive(/^\/verify-sales/i)}
          >
            Ventas
          </Navbar.Link>
        ) : (
          <div className="mx-8 text-lg text-gray-900">
            <Dropdown label="Ventas" size="xl" inline={true}>
              <Link to="/my-sales-metrics">
                <Dropdown.Item>Métricas de Ventas</Dropdown.Item>
              </Link>
              <Link to="/new-sale">
                <Dropdown.Item>Agregar Venta</Dropdown.Item>
              </Link>
              <Link to="/sales-history">
                <Dropdown.Item>Mis ventas</Dropdown.Item>
              </Link>
            </Dropdown>
          </div>
        )}
        {role === "manager" ? (
          <>
            <Navbar.Link
              as={Link}
              to="/prospects"
              className="mx-8 text-lg text-gray-900"
              active={isActive(/^\/prospect/i)}
            >
              Prospectos
            </Navbar.Link>
            <Navbar.Link
              as={Link}
              to="/goals"
              className="mx-8 text-lg text-gray-900"
              active={isActive(/^\/goal/i)}
            >
              Metas
            </Navbar.Link>
          </>
        ) : (
          <>
            <Navbar.Link
              as={Link}
              to="/prospects"
              className="mx-8 text-lg text-gray-900"
              active={isActive(/^\/prospect/i)}
            >
              Prospectos
            </Navbar.Link>
            <div className="mx-8 text-lg text-gray-900">
              <Dropdown label="Metas" size="xl" inline={true}>
                <Link to="/new-goal">
                  <Dropdown.Item>Mis metas</Dropdown.Item>
                </Link>
                <Link to="/goals-history">
                  <Dropdown.Item>Agregar Metas</Dropdown.Item>
                </Link>
              </Dropdown>
            </div>
          </>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;
