// (c) Delta Software 2023, rights reserved.

import { Avatar, Dropdown, Navbar } from "flowbite-react";

import LogoRAM from "../../../assets/imgs/Ram_LogoInv.png";
import { Link, useLocation } from "react-router-dom";
import { useCallback } from "react";
import { Authentication } from "../../../lib/api/api-auth";
import { useUrlFile } from "../../../lib/files";

interface Props {
  onLogout: () => void;
  user?: Authentication | null;
  role?: string;
}

function NavBar({ onLogout, user, role }: Props) {
  const route = useLocation();
  const isActive = useCallback(
    (link: RegExp) => {
      return link.test(route.pathname);
    },
    [route.pathname],
  );
  const fileurl = useUrlFile();

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
              img={fileurl(user?.imageUrl as string)}
            />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">
              {user?.name + " " + user?.lastName}
            </span>
            <span className="block truncate text-sm font-medium">
              {user?.username}
            </span>
          </Dropdown.Header>
          <Link to="/my-profile">
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
              <Link to="/new-sale">
                <Dropdown.Item>Nueva Venta</Dropdown.Item>
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
          </>
        )}

        {role === "manager" ? (
          <>
            <Navbar.Link
              as={Link}
              to="/members"
              className="mx-8 text-lg text-gray-900"
              active={isActive(/^\/members/i)}
            >
              Miembros
            </Navbar.Link>
          </>
        ) : (
          <></>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;
