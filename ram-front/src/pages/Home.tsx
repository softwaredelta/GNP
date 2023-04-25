// (c) Delta Software 2023, rights reserved.

import { Link } from "react-router-dom";
import { useAuthentication } from "../lib/api/api-auth";

export default function Home() {
  const { logout } = useAuthentication();

  return (
    <div>
      <h1>Home</h1>
      <ul>
        <li>
          <Link
            to="/infra"
            className="underline text-red-500 hover:text-red-800"
          >
            infra test
          </Link>
        </li>
        <li>
          <Link
            to="/components"
            className="underline text-red-500 hover:text-red-800"
          >
            components
          </Link>
        </li>
        <li>
          <Link
            to="/managerCourses"
            className="underline text-red-500 hover:text-red-800"
          >
            manager courses
          </Link>
        </li>
        <li>
          <a
            href="/my-groups"
            className="underline text-red-500 hover:text-red-800"
          >
            my groups
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
