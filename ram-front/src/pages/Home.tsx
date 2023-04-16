// (c) Delta Software 2023, rights reserved.

import { useAuthentication } from "../lib/api/api-auth";

export function Home() {
  const { logout } = useAuthentication();

  return (
    <div>
      <h1>Home</h1>
      <a href="/infra" className="underline text-red-500 hover:text-red-800">
        infra test
      </a>
      <button
        onClick={() => {
          logout();
        }}
      >
        Logout
      </button>
    </div>
  );
}
