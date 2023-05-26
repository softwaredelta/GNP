// (c) Delta Software 2023, rights reserved.

import DropZone from "../components/generics/DropZone";
import ProgressBar from "../components/generics/ProgressBar";
import Card from "../components/generics/cards/base/Card";
import DeliveryCard from "../components/generics/cards/base/DeliveryCard";
import CardInfoAssurence from "../components/generics/cards/info/CardInfoAssurence";
import CardInfoGroup from "../components/generics/cards/info/CardInfoGroup";
import CardInfoTopFive from "../components/generics/cards/info/CardInfoTopFive";
import RowProspect from "../components/prospects/RowProspect";

import { BsHouses } from "react-icons/bs";
import { IoPawSharp } from "react-icons/io5";
import { RiPencilFill } from "react-icons/ri";
import ModalDeliveryForm from "../components/forms/ModalDeliveryFormCreate";
import ModalGroupForm from "../components/forms/ModalGroupForm";
import Modal from "../components/generics/Modal";
import ManagerDelivery from "../components/generics/cards/info/ManagerDelivery";
import SkeletonCard from "../components/generics/skeleton/SkeletonCard";
import SkeletonDiv from "../components/generics/skeleton/SkeletonDiv";
import SkeletonText from "../components/generics/skeleton/SkeletonText";
import SearchAgentTable from "../components/tables/SearchAgentTable";
import SearchDeliveryTable from "../components/tables/SearchDeliveryTable";
import useAlert from "../hooks/useAlert";
import useAxios from "../hooks/useAxios";
import useModal from "../hooks/useModal";
import ProspectListHistory from "../components/prospects/ProspectListHistory";

export default function Examples() {
  const listDeliveries = [
    {
      id: "1",
      deliveryName: "Entregable 1",
      description: "Nel",
      imageUrl: "https://www.kayum.mx/wp-content/uploads/2019/09/logo-GNP.jpeg",
    },
    {
      id: "2",
      deliveryName: "Entregable 2",
      description: "Nel",
      imageUrl: "https://www.kayum.mx/wp-content/uploads/2019/09/logo-GNP.jpeg",
    },
  ];

  const listAgents = [
    {
      id: "1",
      email: "user-tets@tec.mx",
      imageUrl:
        "https://www.icegif.com/wp-content/uploads/2023/01/icegif-1544.gif",
      name: "Juan",
      lastName: "Velasco",
    },
    {
      email: "user-tets@tec.mx",
      imageUrl:
        "https://www.icegif.com/wp-content/uploads/2023/01/icegif-1544.gif",
      id: "2",
      name: "Juan",
      lastName: "Pedro",
    },
    {
      email: "user-tets@tec.mx",
      imageUrl:
        "https://www.icegif.com/wp-content/uploads/2023/01/icegif-1544.gif",
      id: "3",
      name: "Pedro",
      lastName: "Pascal",
    },
  ];

  const { isOpen, toggleModal } = useModal();
  const { isOpen: isOpenGroupForm, toggleModal: toggleModalGroupForm } =
    useModal();

  const { isOpen: isOpenDeliveryForm, toggleModal: toggleModalDeliveryForm } =
    useModal();
  const { showAlert } = useAlert();
  const { response: me } = useAxios<{ email: string; id: string }>({
    url: "user/me",
    method: "GET",
  });

  const { response, error, loading, callback } = useAxios<{
    data: {
      group: {
        id: string;
        name: string;
      };
    };
  }>({
    url: "groups/create",
    method: "POST",
    body: { name: "Grupo novinos" },
  });
  console.log({ response });
  console.log({ me });

  if (loading) <div>loading..</div>;

  if (error) return <div>error:{JSON.stringify(error)}</div>;

  return (
    <div className="grid min-h-[50vh] w-full place-items-center gap-10 py-20 md:grid-cols-3">
      <div className="w-40">
        <button className="btn-primary" onClick={callback}>
          post
        </button>
      </div>
      <div className="w-40">Hola {me && me.email}</div>
      <div className=" w-7/12 py-10">
        <ProgressBar
          progress={30}
          textLabel="Ya tienen título las progress bar"
          color="orange"
        />

        <ProgressBar progress={80} color="blue" />
      </div>
      <div className="w-40">
        <button className="btn-primary">Botón primario</button>
      </div>
      <div className="w-40">
        <button className="btn-secondary">Botón secundario</button>
      </div>
      <div className="w-40">
        <input type="text" className="input-primary" />
      </div>
      <div className="w-40">
        <button className="btn-disabled">Hola amigos</button>
      </div>
      <div className="col-start-1 w-8/12 py-10">
        <Card
          image="https://imgs.search.brave.com/muR0HGm76B6gbdiwyaBULBApAqvAdlWv2aHFAsQYVUw/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJhY2Nlc3Mu/Y29tL2Z1bGwvNTA4/OTUyOC5qcGc"
          color="orange"
          icon={<BsHouses color="white" size={30} />}
        >
          <CardInfoAssurence
            assuranceName="Seguro de hogar"
            color="orange"
            total={2000000}
          />
        </Card>
      </div>
      <div className=" w-8/12 py-10">
        <Card
          image="https://animals.sandiegozoo.org/sites/default/files/2020-08/black-footed.jpg"
          color="blue"
          icon={<IoPawSharp color="white" size={30} />}
        >
          <CardInfoTopFive
            assuranceName="Seguro de mascotas"
            color="blue"
            top={[
              {
                name: "Alfonso Cuarón",
                amount: 20000,
              },
              {
                name: "Alfonso Cuarón",
                amount: 20000,
              },
              {
                name: "Alfonso Cuarón",
                amount: 20000,
              },
              {
                name: "Alfonso Cuarón",
                amount: 20000,
              },
              {
                name: "Alfonso Cuarón",
                amount: 20000,
              },
            ]}
          />
        </Card>
      </div>

      <div className="grid w-full grid-cols-2 gap-10 p-12">
        <button className="floating-button-primary">
          {<RiPencilFill size={50} />}
        </button>
        <button className="floating-button-secondary">
          {<RiPencilFill size={50} />}
        </button>
      </div>
      <div className="md:col-span-3 ">
        <DeliveryCard
          // deliveryID="test-delivery"
          // onFileSubmit={() => {}}
          color="blue"
          nameDelivery="Nombre de la entrega"
          image="https://i.blogs.es/799a0e/ydray-mew_27_articuno_45l_hyperx_environment_front/1366_2000.jpeg"
        >
          <ManagerDelivery membersNumber={30}></ManagerDelivery>
        </DeliveryCard>
      </div>
      <div className="w-10/12">
        <DropZone file={null} setFile={() => {}} />
      </div>
      <div className="w-7/12">
        <button
          className="cursor-pointer transition-all ease-in-out hover:scale-105 active:scale-95"
          onClick={() => alert("Redireccionando al grupo ...")}
        >
          <Card
            color="blue"
            image="https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg"
          >
            <CardInfoGroup
              color="blue"
              nameGroup="Los novinos chidos"
              progress={50}
            />
          </Card>
        </button>
      </div>
      <div>
        <button className="btn-secondary" onClick={toggleModal}>
          {" "}
          Abrir modal
        </button>
        {isOpen && (
          <Modal closeModal={toggleModal}>
            <div>
              <h1 className="text-center text-2xl font-bold">Hola mundo</h1>
              <p className="text-center">hola oli</p>
              <div>
                <h3 className="py-5 text-center font-bold">Miren un gatito:</h3>
              </div>
              <img
                src="https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg"
                alt="un gatito"
              />
            </div>
          </Modal>
        )}
      </div>
      <div className="w-11/12">
        <SkeletonCard />
      </div>
      <div>
        <SkeletonText />
      </div>
      <div className="h-32 w-32 overflow-hidden  rounded-full">
        <SkeletonDiv />
      </div>
      <div className="w-11/12">
        <button
          className="btn-primary"
          onClick={() =>
            showAlert(
              {
                type: "error",
                description: "Alerta buena",
                message: "Prueba de alerta",
              },
              5,
            )
          }
        >
          Abrir alerta
        </button>
      </div>
      <div className="w-11/12">
        <button className="btn-primary" onClick={toggleModalGroupForm}>
          Abrir modal Grupo
        </button>
        <ModalGroupForm
          isOpenModal={isOpenGroupForm}
          closeModal={toggleModalGroupForm}
          handlePost={(image, name) => {
            alert(`Nombre: ${name} Imagen: ${image}`);
          }}
          isEditModal={false}
        />
      </div>
      <div className="w-11/12">
        <button className="btn-primary" onClick={toggleModalDeliveryForm}>
          Abrir modal Entregable
        </button>
        <ModalDeliveryForm
          isOpenModal={isOpenDeliveryForm}
          closeModal={toggleModalDeliveryForm}
        />
      </div>
      <div className="col-span-3 ">
        <SearchAgentTable
          groupId={""}
          onReloadAgents={() => {}}
          agents={listAgents}
        ></SearchAgentTable>
      </div>
      <div className="col-span-3 ">
        <SearchDeliveryTable
          deliveries={listDeliveries}
          onReloadDeliveries={() => {}}
        ></SearchDeliveryTable>
      </div>
      {}
      <div className="col-span-3 w-10/12">
        <RowProspect
          id="id-4"
          name="Yasodhara"
          firstSurname="Díaz"
          secondSurname="Arellano"
          prospectStatus={[
            {
              status: {
                id: "1",
                date: new Date("2021-08-01"),
                statusName: "Nuevo prospecto",
                comments: "Soy un comentario",
              },
              statusComment:
                "Hola soy una persona de RAM y me gustaría hacer un comentario",
            },
          ]}
        />
      </div>
      <div className="col-span-3 w-10/12">
        <ProspectListHistory
          state={"Cliente"}
          comment={"Hola"}
          date={new Date()}
        />
      </div>
    </div>
  );
}
