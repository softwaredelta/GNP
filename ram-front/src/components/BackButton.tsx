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
      className="relative flex items-center text-gnp-orange-500 transition-transform duration-300 hover:scale-110"
      onClick={handleGoBack}
    >
      <IoArrowBackCircle size={30} className="mr-1" />
      <span className="absolute left-full top-1/2 -translate-y-1/2 transform text-sm font-bold opacity-100 transition-opacity duration-300">
        Regresar
      </span>
    </button>
  );
}
