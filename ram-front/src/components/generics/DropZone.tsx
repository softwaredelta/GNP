// (c) Delta Software 2023, rights reserved.

import { FaCloudUploadAlt } from "react-icons/fa";

function DropZone({ ref }: { ref: any }) {
  return (
    <div className=" w-full h-full flex flex-col items-center justify-center bg-white rounded-lg shadow-md">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      >
        <div className="flex items-center justify-center relative w-24 h-24 mb-4 rounded-full bg-gnp-orange-400">
          <FaCloudUploadAlt size={40} className="text-white" />
        </div>
        <div className="text-gray-500 text-xl mt-2">Subir archivo</div>
        <input id="dropzone-file" type="file" className="hidden" ref={ref} />
      </label>
    </div>
  );
}

export default DropZone;
