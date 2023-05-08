// (c) Delta Software 2023, rights reserved.

import { AiFillFileText } from "react-icons/ai";
import { FaCloudUploadAlt } from "react-icons/fa";

export interface DropZoneProps {
  file: File | null;
  setFile: (file: File) => void;
}

function DropZone({ file, setFile }: DropZoneProps): JSX.Element {
  return (
    <div className=" flex h-full w-full flex-col items-center justify-center rounded-lg bg-white shadow-md">
      <label
        htmlFor="dropzone-file"
        className="dark:hover:bg-bray-800 flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      >
        {!file ? (
          <>
            <div className="relative mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gnp-orange-400">
              <FaCloudUploadAlt size={40} className="text-white" />
            </div>
            <div className="mt-2 text-xl text-gray-500">Subir archivo</div>
          </>
        ) : (
          <>
            <div className="relative mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gnp-orange-400">
              <AiFillFileText size={40} className="fill-white" />
            </div>
            <div className="mt-2 text-xl text-gray-500"> {file.name}</div>
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
