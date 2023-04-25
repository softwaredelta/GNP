import React, { ChangeEvent } from 'react';

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
    <div className="my-4">
      <label className="block font-medium text-lg mb-2">Selecciona un archivo:</label>
      <input type="file" onChange={handleFileChange} className="border rounded py-2 px-3" />
    </div>
  );
};

export default FileUpload;