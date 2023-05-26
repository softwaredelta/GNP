// (c) Delta Software 2023, rights reserved.

import { Badge } from "flowbite-react";
import { ChangeEvent } from "react";
import { BsCameraFill } from "react-icons/bs";
import usePreviewImage from "../../../hooks/usePreviewImage";
import { IUser } from "../../../types";

interface ProfileCardProps {
  user: IUser;
  fileChanged: (file: File) => void;
}

export default function ProfileCard({ user, fileChanged }: ProfileCardProps) {
  const { setPreviewImage, imgRef } = usePreviewImage();

  const handleIconClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".jpg,.png,.jpeg";
    fileInput.onchange = (e) => {
      setPreviewImage(e as unknown as ChangeEvent<HTMLInputElement>);
      const selectedFile = (e.target as HTMLInputElement)?.files?.[0];
      if (selectedFile) {
        fileChanged(selectedFile);
      }
    };
    fileInput.click();
  };

  return (
    <div className="h-full w-full items-center justify-center rounded-3xl bg-slate-100 shadow-md">
      <div className="flex justify-center">
        <div className="relative inline-block">
          <img
            ref={imgRef}
            className="mt-10 h-44 w-44 rounded-full object-cover"
            src={
              user.imageUrl ||
              "https://media.istockphoto.com/photos/beautiful-profile-picture-id182773387?k=6&m=182773387&s=612x612&w=0&h=kXCC5JaOAdOUE5iyd9F2YocAk2O3OEmj6scZs2-QtEk="
            }
          />
          <BsCameraFill
            size={30}
            className="absolute bottom-0.5 right-0.5 mr-2 hover:scale-110 hover:text-orange-500"
            onClick={handleIconClick}
          />
        </div>
      </div>
      <div className="mt-5 flex justify-center">
        <div className="text-3xl font-bold">
          {user.name + " " + user.lastName}
        </div>
      </div>
      <div className="flex justify-center">
        <div className="text-xl font-bold text-orange-500">
          {user.role || "Gerente"}
        </div>
      </div>
      <div className="flex justify-center">
        <Badge size="md">3 days ago</Badge>
      </div>
    </div>
  );
}
