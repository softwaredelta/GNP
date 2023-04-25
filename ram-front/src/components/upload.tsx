// (c) Delta Software 2023, rights reserved.

import React, { ChangeEvent } from "react";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div>
      <label>Selecciona un archivo:</label>
      <input type="file" onChange={handleFileChange} />
    </div>
  );
};

export default FileUpload;
