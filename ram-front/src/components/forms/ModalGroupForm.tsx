// (c) Delta Software 2023, rights reserved.
import Modal from "../generics/Modal";

export interface IModalGroupFormProps {
  handlePost: VoidFunction;
  closeModal: VoidFunction;
  isOpenModal: boolean;
}

export default function ModalGroupForm({
  handlePost,
  closeModal,
  isOpenModal,
}: IModalGroupFormProps) {
  return (
    <>
      {
        <Modal closeModal={closeModal}>
          <div className="py-20 w-full mx-auto px-10 md:px-20  overflow-hidden overflow-y-scroll bg-gnp-white rounded-3xl custom-scroll">
            <h1 className="apply my-10 w-full bg-gnp-orange-500 rounded-xl text-white p-4 text-2xl text-center font-semibold">
              Agregar grupo
            </h1>
            <label className="text-xl font-semibold">Nombre del grupo</label>
            <input type="text" className="input-primary" />
          </div>
        </Modal>
      }
    </>
  );
}
