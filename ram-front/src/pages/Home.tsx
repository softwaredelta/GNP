// (c) Delta Software 2023, rights reserved.

import { useAuthentication } from "../lib/api/api-auth";

export function Home() {
  const { logout } = useAuthentication();

  return (
    <div>
      <h1>Home</h1>
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
      </ul>
    </div>
  );
}
