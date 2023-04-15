// (c) Delta Software 2023, rights reserved.

import { useRecoilValue } from "recoil";
import { authenticate$ } from "../lib/auth/auth";

export function Login() {
  const authenticate = useRecoilValue(authenticate$);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        authenticate({
          username: e.currentTarget.username.value,
          password: e.currentTarget.password.value,
        });
      }}
    >
      <label htmlFor="username">Username</label>
      <input type="text" id="username" />
      <label htmlFor="password">Password</label>
      <input type="password" id="password" />
      <button type="submit">Login</button>
    </form>
  );
}
