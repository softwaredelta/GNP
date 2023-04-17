// (c) Delta Software 2023, rights reserved.

import { useAuthentication } from "../lib/api/api-auth";

export function Login() {
  const { authenticate } = useAuthentication();

  return (
    <div>
      <h1>Login</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          authenticate({
            username: e.currentTarget[0].value,
            password: e.currentTarget[1].value,
          });
        }}
      >
        <label>
          Username
          <input type="text" />
        </label>
        <label>
          Password
          <input type="password" />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
