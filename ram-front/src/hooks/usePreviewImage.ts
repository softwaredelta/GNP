// (c) Delta Software 2023, rights reserved.

import { useRef, useState } from "react";

export default function usePreviewImage() {
  const [image, setImage] = useState<File | null>(null);
  const [urlImage, setUrlImage] = useState<string>("/default.jfif");
  const imgRef = useRef<HTMLImageElement>(null);

  const setPreviewImage = (e: any) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      if (imgRef.current)
        imgRef.current.src = URL.createObjectURL(e.target.files[0]);
    }
    setUrlImage(`/default.jfif`);
  };

  return { image, setPreviewImage, urlImage, imgRef };
}
