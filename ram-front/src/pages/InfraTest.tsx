// (c) Delta Software 2023, rights reserved.

import { useRecoilValue } from "recoil";
import { apiHealth$ } from "../lib/api/api-health";
import { apiTime$ } from "../lib/api/api-time";
import { apiObjects$ } from "../lib/api/api-objects";

function ReloadButton({ update }: { update: () => void }) {
  return (
    <button onClick={update} className="rounded-md bg-sky-500">
      Reload
    </button>
  );
}

export function InfraTest() {
  const { health, update: updateHealth } = useRecoilValue(apiHealth$);
  const { now: time, update: updateTime } = useRecoilValue(apiTime$);
  const { objects, update: updateObjects } = useRecoilValue(apiObjects$);

  return (
    <table>
      <thead>
        <tr>
          <th>Component</th>
          <th>Status</th>
          <th>Reload</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Backend</td>
          <td>{health}</td>
          <td>
            <ReloadButton update={updateHealth} />
          </td>
        </tr>
        <tr>
          <td>DB</td>
          <td>{time ? "OK" : "ERROR"}</td>
          <td>
            <ReloadButton update={updateTime} />
          </td>
        </tr>
        <tr>
          <td>S3</td>
          <td>{objects ? "OK" : "ERROR"}</td>
          <td>
            <ReloadButton update={updateObjects} />
          </td>
        </tr>
      </tbody>
    </table>
  );
}
