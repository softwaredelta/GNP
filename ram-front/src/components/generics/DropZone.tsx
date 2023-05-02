// (c) Delta Software 2023, rights reserved.

import { AiFillFileText } from "react-icons/ai";
import { FaCloudUploadAlt } from "react-icons/fa";

export interface DropZoneProps {
  file: File | null;
  setFile: (file: File) => void;
}

function DropZone({ file, setFile }: DropZoneProps): JSX.Element {
  return (
    <div className=" w-full h-full flex flex-col items-center justify-center bg-white rounded-lg shadow-md">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      >
        {!file ? (
          <>
            <div className="flex items-center justify-center relative w-24 h-24 mb-4 rounded-full bg-gnp-orange-400">
              <FaCloudUploadAlt size={40} className="text-white" />
            </div>
            <div className="text-gray-500 text-xl mt-2">Subir archivo</div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center relative w-24 h-24 mb-4 rounded-full bg-gnp-orange-400">
              <AiFillFileText size={40} className="fill-white" />
            </div>
            <div className="text-gray-500 text-xl mt-2"> {file.name}</div>
          </>
        )}
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          onChange={(e) => {
            e.preventDefault();
            if (e.target.files) {
              const newFile = e.target.files[0];
              setFile(newFile);
            }
          }}
        />
      </label>
    </div>
  );
}

export default DropZone;
