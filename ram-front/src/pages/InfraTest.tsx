// (c) Delta Software 2023, rights reserved.

import { Suspense } from "react";
import {
  type RecoilValueReadOnly,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import {
  backendStatus$,
  dbStatus$,
  s3Status$,
  updateInfraStatus$,
} from "../lib/api/api-infra-status";

function StatusRow({
  status,
  name,
}: {
  status: RecoilValueReadOnly<boolean>;
  name: string;
}) {
  const ok = useRecoilValue(status);
  const setter = useSetRecoilState(updateInfraStatus$(name));
  const update = () => setter((x) => x + 1);

  return (
    <tr>
      <td>{name}</td>
      <td>
        <span>{ok ? "OK" : "DEAD"}</span>
      </td>
      <td>
        <button onClick={update}>Update</button>
      </td>
    </tr>
  );
}

function InfraTest() {
  const services = [
    {
      name: "backend",
      status: backendStatus$,
    },
    {
      name: "db",
      status: dbStatus$,
    },
    {
      name: "s3",
      status: s3Status$,
    },
  ];

  return (
    <>
      <h1>Infra Status</h1>
      <table>
        <thead>
          <tr>
            <th>Service</th>
            <th>Status</th>
            <th>Update</th>
          </tr>
        </thead>

        <tbody>
          {services.map(({ name, status }) => (
            <Suspense key={name} fallback={<p>loading {name}...</p>}>
              <StatusRow name={name} status={status} />
            </Suspense>
          ))}
        </tbody>
      </table>
    </>
  );
}

export function InfraPage() {
  return (
    <Suspense fallback={<p>connecting to infraestructure...</p>}>
      <InfraTest />
    </Suspense>
  );
}
