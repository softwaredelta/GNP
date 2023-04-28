// (c) Delta Software 2023, rights reserved.

import { Avatar, Dropdown, Navbar } from "flowbite-react";

import LogoRAM from "../../../assets/imgs/Ram_LogoInv.png";
import { Link } from "react-router-dom";

interface Props {
  onLogout: () => void;
}

function NavBar({ onLogout }: Props) {
  return (
    <Navbar
      className="shadow-md border border-black "
      fluid={true}
      style={{
        backgroundColor: "#e9e9e9",
        border: "1px solid #0000",
      }}
    >
      <Navbar.Brand href="#Home">
        <img src={LogoRAM} className="h-20 ml-2" alt="Grupo Asesores Logo" />
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
            <span className="block text-sm">Bonnie Green</span>
            <span className="block truncate text-sm font-medium">
              name@flowbite.com
            </span>
          </Dropdown.Header>
          <Dropdown.Item>Ver Perfil</Dropdown.Item>
          <Dropdown.Item>Ayuda</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={onLogout}>Salir</Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link
          as={Link}
          to="/"
          className="text-lg ml-2 active:bg-amber-500"
          active={true}
        >
          Home
        </Navbar.Link>
        <Navbar.Link
          as={Link}
          to="/groups"
          className="text-lg  mx-8 text-gray-900 "
        >
          Grupos
        </Navbar.Link>

        <div className="text-lg mx-8 text-gray-900">
          <Dropdown label="Ventas" size="xl" inline={true}>
            <Link to="/·">
              <Dropdown.Item>Datos Generales</Dropdown.Item>
            </Link>
            <Link to="/new-sale">
              <Dropdown.Item>Agregar Venta</Dropdown.Item>
            </Link>
            <Link to="/sales-history">
              <Dropdown.Item>Mis ventas</Dropdown.Item>
            </Link>
          </Dropdown>
        </div>

        <Navbar.Link
          as={Link}
          to="/prospectos"
          className="text-lg mx-8 text-gray-900"
        >
          Prospectos
        </Navbar.Link>
        <div className="text-lg mx-8 text-gray-900">
          <Dropdown label="Metas" size="xl" inline={true}>
            <Link to="/·">
              <Dropdown.Item>Mis metas</Dropdown.Item>
            </Link>
            <Link to="/·">
              <Dropdown.Item>Agregar Metas</Dropdown.Item>
            </Link>
          </Dropdown>
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;
