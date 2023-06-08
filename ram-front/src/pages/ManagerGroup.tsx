// (c) Delta Software 2023, rights reserved.
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=1287058613
// * M1_S05
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=819425274
// * M1_S08

import { FiEdit } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { ManagerListGroupDeliveries } from "../components/deliverables/ListManagerDeliveries";
import Wrapper from "../containers/Wrapper";
import useAxios from "../hooks/useAxios";
import { IGroup } from "../types";

export default function GroupDeliveries() {
  const { id } = useParams();

  const { response: group } = useAxios<IGroup>({
    url: `groups/${id}`,
    method: "GET",
  });

  return (
    <div>
      <Wrapper title={group?.name}>
        <>
          <div className="flex items-center justify-end">
            <div className="m-6">
              <Link to={`/group/edit/${group?.id}`}>
                <button className="btn-primary flex-grid flex cursor-pointer pt-1 transition-all ease-in-out hover:scale-110">
                  Editar grupo
                  <FiEdit
                    color="white"
                    size={20}
                    className="ml-3 inline-block"
                  />
                </button>
              </Link>
            </div>
          </div>
          <div className="flex min-h-[26%] w-full justify-center gap-10">
            <div className="w-3/5">
              {group && (
                <ManagerListGroupDeliveries
                  deliveries={group.deliveries ?? []}
                />
              )}
            </div>
          </div>
        </>
      </Wrapper>
    </div>
  );
}
