// (c) Delta Software 2023, rights reserved.

import { Link } from "react-router-dom";
import { useAuthentication } from "../lib/api/api-auth";
import Wrapper from "../containers/Wrapper";

export default function Home() {
  const { logout, auth } = useAuthentication();

  return (
    <Wrapper>
      <div>
        <h1>Home</h1>

        <h2>user info</h2>
        <ul>
          <li>username: {auth?.username}</li>
          <li>roles: {auth?.roles.join(", ")}</li>
        </ul>

        <ul>
          <li>
            <Link
              to="/infra"
              className="text-red-500 underline hover:text-red-800"
            >
              infra test
            </Link>
          </li>
          <li>
            <Link
              to="/components"
              className="text-red-500 underline hover:text-red-800"
            >
              components
            </Link>
          </li>
          <li>
            <Link
              to="/groups"
              className="text-red-500 underline hover:text-red-800"
            >
              manager groups view
            </Link>
          </li>
          <li>
            <Link
              to="/groups"
              className="text-red-500 underline hover:text-red-800"
            >
              my groups
            </Link>
          </li>
          <li>
            <Link
              to="/new-sale"
              className="text-red-500 underline hover:text-red-800"
            >
              register new sale
            </Link>
          </li>
          <li>
            <Link
              to="/sales-history"
              className="text-red-500 underline hover:text-red-800"
            >
              all sales
            </Link>
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
        </ul>
      </div>
    </Wrapper>
  );
}
