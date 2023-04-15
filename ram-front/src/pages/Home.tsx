// (c) Delta Software 2023, rights reserved.

import { useRecoilValue } from "recoil";
import { isAuthenticated$, logout$ } from "../lib/auth/auth";

export function Home() {
  const isAuthenticated = useRecoilValue(isAuthenticated$);
  const logout = useRecoilValue(logout$);

  if (!isAuthenticated) {
    throw new Error("Not authenticated");
  }

  return (
    <div>
      <h1>Home</h1>
      <a href="/infra" className="underline text-red-500 hover:text-red-800">
        infra test
      </a>
      <button onClick={() => logout()}>Log out</button>
    </div>
  );
}
