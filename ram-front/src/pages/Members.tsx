// (c) Delta Software 2023, rights reserved.
import TableMembers from "../components/members/TableMembers";
import Wrapper from "../containers/Wrapper";

export default function Members() {
  const members = [
    {
      id: "1",
      name: "Juan",
      lastName: "Perez",
      rol: "Agente",
      state: "Active",
      imageUrl: "https://flowbite.com/docs/images/people/profile-picture-5.jpg",
    },
    {
      id: "2",
      name: "Luis",
      lastName: "Gonzáles",
      rol: "Gerente",
      state: "Active",
      imageUrl: "https://flowbite.com/docs/images/people/profile-picture-5.jpg",
    },
  ];

  return (
    <Wrapper title="Miembros">
      <>
        <div className="w-1/12 overflow-hidden rounded-3xl font-bold">
          <button
            onClick={() => {
              alert("Agregar");
            }}
            className="btn-primary"
          >
            Agregar
          </button>
        </div>

        <TableMembers members={members} />
      </>
    </Wrapper>
  );
}
