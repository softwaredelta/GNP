// (c) Delta Software 2023, rights reserved.

import { useAuthentication } from "../lib/api/api-auth";
import Wrapper from "../containers/Wrapper";
import CardNewSale from "../components/sales/CardNewSale";

export default function NewSale() {
  const { logout } = useAuthentication();

  return (
    <Wrapper>
        <div className="flex flex-col justify-center items-center pt-8">
        <CardNewSale/>
        </div>
    </Wrapper>
  );
}

{/* <h1>Home</h1>
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
</ul> */}
