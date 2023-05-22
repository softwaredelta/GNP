// (c) Delta Software 2023, rights reserved.

import { IoArrowBackCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export function BackButton() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <button
      className="relative flex items-center justify-center text-gnp-orange-500 transition-transform duration-300 hover:scale-110"
      onClick={handleGoBack}
    >
      <IoArrowBackCircle size={30} className="mr-1" />
      <div className="  transform text-sm font-bold opacity-100 transition-opacity duration-300">
        Regresar
      </div>
    </button>
  );
}
