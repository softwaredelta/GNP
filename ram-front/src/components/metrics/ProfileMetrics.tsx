// (c) Delta Software 2023, rights reserved.
// * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=718703983
// * M3_S05
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import useAxios from "../../hooks/useAxios";
import { ILink, IUser } from "../../types";
import ProfileForm from "../forms/ProfileForm";
import ProfileCard from "../generics/cards/ProfileCard";
import LinkList from "../generics/lists/LinkList";

interface ProfileMetricsProps {
  user: IUser;
}
export default function ProfileMetrics({ user }: ProfileMetricsProps) {
  const navigate = useNavigate();

  return (
    <>
      <div className="mx-1 mt-1 mb-1 grid grid-flow-col grid-rows-6 gap-8">
        <div className="col row-span-6">
          <div className="lg:max-w-xs">
            <ProfileCard user={user} isEdit={true} />
          </div>
        </div>
        <div className="col-span-2 row-span-6">
          <div className="col row-span-3">
            <dl className="max-w-md divide-y divide-gray-200 text-gray-900 dark:divide-gray-700 dark:text-white">
              <div className="flex flex-col py-1">
                <dt className="mb-1 text-gray-500 dark:text-gray-400 md:text-lg">
                  Email
                </dt>
                <dd className="text-lg font-semibold">{user.email}</dd>
              </div>
              <div className="flex flex-col pt-1">
                <dt className="mb-1 text-gray-500 dark:text-gray-400 md:text-lg">
                  Clave de Agente
                </dt>
                <dd className="text-lg font-semibold">
                  {user.CUA || "No tiene ligada una clave"}
                </dd>
              </div>
              <div className="flex flex-col pt-1">
                <dt className="mb-1 text-gray-500 dark:text-gray-400 md:text-lg">
                  Teléfono
                </dt>
                <dd className="text-lg font-semibold">{user.mobile}</dd>
              </div>
              <div className="flex flex-col pt-1">
                <dt className="mb-1 text-gray-500 dark:text-gray-400 md:text-lg">
                  PP200
                </dt>
                <dd className="text-lg font-semibold">
                  {user.urlPP200 ? (
                    <div
                      className="flex cursor-pointer items-center text-[#157013]  hover:text-[#2d572c]"
                      onClick={() => {
                        window.open(user.urlPP200, "_blank");
                      }}
                    ></div>
                  ) : (
                    "No disponible"
                  )}
                </dd>
              </div>
            </dl>
          </div>

          <button
            className="btn-primary mt-6"
            onClick={() => navigate(`/view-profile/${user.id}`)}
          >
            Ver más información
          </button>
        </div>
      </div>
    </>
  );
}
