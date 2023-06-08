// (c) Delta Software 2023, rights reserved.
import { IStatus } from "../../types";
import Modal from "../generics/Modal";
import { useState } from "react";

export interface IModalModifyStatusProspectProps {
  prospectName: string;
  prospectId: string;
  statusId: string;
  statusComment: string;
  closeModal: VoidFunction;
  isOpenModal: boolean;
  listStatus?: IStatus[];
  handleEdit: (
    prospectId: string,
    statusId: string,
    statusComment: string,
  ) => void;
}

export default function ModalModifyStatusProspect({
  prospectId,
  prospectName,
  statusId,
  statusComment,
  closeModal,
  isOpenModal,
  listStatus = [],
  handleEdit,
}: IModalModifyStatusProspectProps) {
  const [newStatus, setStatus] = useState<string>(statusId);
  const [comment, setComment] = useState<string>(statusComment);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  };

  return (
    <>
      {isOpenModal && (
        <Modal
          withModal={false}
          closeModal={() => {
            closeModal();
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-3/5 rounded-3xl bg-gnp-white p-10"
          >
            <h1 className="apply w-full rounded-xl bg-gnp-orange-500 p-4 text-center text-2xl font-semibold text-white">
              {prospectName}
            </h1>
            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center space-y-3">
                <label className="text-xl font-semibold">Estado</label>
                <select
                  className="input-primary w-10/12"
                  value={newStatus}
                  onChange={handleStatusChange}
                >
                  {listStatus.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.statusName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col items-center justify-center space-y-3">
                <label className="text-xl font-semibold">Comentario</label>
                <div className="h-40 w-10/12">
                  <textarea
                    onChange={(e) => setComment(e.target.value)}
                    className="text-area-primary resize-none"
                  />
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-center space-x-4">
              <button
                className="btn-border"
                onClick={() => {
                  closeModal();
                }}
              >
                Cancelar
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  handleEdit(prospectId, newStatus, comment);
                  closeModal();
                }}
              >
                Guardar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
