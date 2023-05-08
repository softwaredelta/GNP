// (c) Delta Software 2023, rights reserved.

import { ChangeEvent, RefObject, useRef, useState } from "react";

export interface IusePreviewImageReturn {
  image: File | null;
  setPreviewImage: (e: ChangeEvent<HTMLInputElement>) => void;
  imgRef: RefObject<HTMLImageElement>;
  resetImage: () => void;
}

export default function usePreviewImage(): IusePreviewImageReturn {
  const [image, setImage] = useState<File | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const setPreviewImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (!imgRef.current) return;

    if (!e.target.files) {
      imgRef.current.src = `/default.jfif`;
      setImage(null);
      return;
    }

    if (e.target.files[0]) {
      setImage(e.target.files[0]);

      imgRef.current.src = URL.createObjectURL(e.target.files[0]);
    }
  };

  const resetImage = () => {
    setImage(null);
  };

  return { image, setPreviewImage, imgRef, resetImage };
}
