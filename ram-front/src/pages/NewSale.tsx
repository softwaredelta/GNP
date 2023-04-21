// (c) Delta Software 2023, rights reserved.

// import { useAuthentication } from "../lib/api/api-auth";
import Wrapper from "../containers/Wrapper";
import CardNewSale from "../components/sales/CardNewSale";
import { allAssuranceTypes$ } from "../lib/api/api-assurance-type";
import { useRecoilValue } from "recoil";

export default function NewSale() {
  // const { logout } = useAuthentication();
  const assuranceTypes = useRecoilValue(allAssuranceTypes$);
  return (
    <Wrapper>
      <div className="flex flex-col justify-center items-center pt-8">
        <CardNewSale assuranceTypes={assuranceTypes.assuranceTypes} />
        {/* <button onClick={() => console.log(Object.values(assurance_types[0]))}>click</button> */}
        {/* <button onClick={() => console.log(assurance_types.assuranceTypes[0])}>
          click
        </button> */}
      </div>
    </Wrapper>
  );
}

{
  /* <h1>Home</h1>
<ul>
  <li>
    <a
      href="/infra"
      className="underline text-red-500 hover:text-red-800"
    >
      infra test
    </a>
  </li>
  <li>
    <a
      href="/components"
      className="underline text-red-500 hover:text-red-800"
    >
      components
    </a>
  </li>
  <li>
    <button
      onClick={() => {
        logout();
      }}
    >
      Logout
    </button>
  </li>
</ul> */
}
