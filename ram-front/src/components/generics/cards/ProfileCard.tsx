// (c) Delta Software 2023, rights reserved.

import { Badge } from "flowbite-react";
import { ChangeEvent } from "react";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import usePreviewImage from "../../../hooks/usePreviewImage";
import { IUser } from "../../../types";
import { useUrlFile } from "../../../lib/files";

interface ProfileCardProps {
  user: IUser;
  fileChanged?: (file: File) => void;
  isEdit: boolean;
  isManager?: boolean;
}

export default function ProfileCard({
  user,
  isEdit,
  isManager = true,
  fileChanged,
}: ProfileCardProps) {
  const { setPreviewImage, imgRef } = usePreviewImage();

  const handleIconClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".jpg,.png,.jpeg";
    fileInput.onchange = (e) => {
      setPreviewImage(e as unknown as ChangeEvent<HTMLInputElement>);
      const selectedFile = (e.target as HTMLInputElement)?.files?.[0];
      if (selectedFile && fileChanged) {
        fileChanged(selectedFile);
      }
    };
    fileInput.click();
  };

  const navigate = useNavigate();
  const fileUrl = useUrlFile();

  return (
    <div className="relative pt-2 pr-2">
      <div className="w-full items-center justify-center rounded-3xl bg-slate-100 py-10 shadow-md">
        <div className="flex justify-center">
          <div className="relative inline-block">
            <img
              ref={imgRef}
              className="h-44 w-44 rounded-full object-cover"
              src={
                fileUrl(user.imageUrl as string) ||
                "https://media.istockphoto.com/photos/beautiful-profile-picture-id182773387?k=6&m=182773387&s=612x612&w=0&h=kXCC5JaOAdOUE5iyd9F2YocAk2O3OEmj6scZs2-QtEk="
              }
            />
            {isEdit && fileChanged && (
              <div className="absolute bottom-0 right-1">
                <button
                  className="floating-button-primary hover:bg-orange-500"
                  onClick={() => {
                    navigate(`/profile/${user.id}`);
                  }}
                >
                  {
                    <FiEdit2
                      className="m-2"
                      size={22}
                      onClick={handleIconClick}
                    />
                  }
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="mt-5 flex justify-center">
          <div className="text-center text-3xl font-bold">
            {user.name + " " + user.lastName}
          </div>
        </div>
        <div className="mt-2 flex justify-center">
          <div className="text-xl font-bold text-orange-500">
            {user.rolesString &&
              user.rolesString
                .split("_")
                .map((role) =>
                  role === "manager" || role === "manager,admin"
                    ? "Gerente"
                    : "Agente",
                )
                .join(" ")}
          </div>
        </div>
        <div className="mt-2 flex justify-center">
          <Badge size="md">
            {user.createdAt &&
              `${Math.floor(
                (new Date().getTime() - new Date(user.createdAt).getTime()) /
                  (1000 * 60 * 60 * 24),
              )} days ago`}
          </Badge>
        </div>
      </div>
      {!isEdit && isManager && (
        <div className="absolute top-0 right-0">
          <button
            className="floating-button-primary"
            onClick={() => {
              navigate(`/profile/${user.id}`);
            }}
          >
            {<FiEdit2 className="m-4" size={25} />}
          </button>
        </div>
      )}
    </div>
  );
}
