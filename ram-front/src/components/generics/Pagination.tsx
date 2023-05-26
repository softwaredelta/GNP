// (c) Delta Software 2023, rights reserved.

export interface IPaginationProps {
  pageCurrent: number;
  lastPage: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  nextPage: () => void;
  previousPage: () => void;
}

export default function Pagination({
  pageCurrent,
  lastPage,
  canPreviousPage,
  canNextPage,
  nextPage,
  previousPage,
}: IPaginationProps) {
  return (
    <div>
      <div className="flex flex-col items-center pt-10">
        <span className="text-sm text-gray-700 dark:text-gray-400">
          Página{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {pageCurrent}
          </span>{" "}
          de{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {lastPage}
          </span>
        </span>
        <div className="xs:mt-0 mt-2 inline-flex">
          {canPreviousPage && (
            <button
              onClick={previousPage}
              disabled={!canPreviousPage}
              className="inline-flex items-center rounded-l bg-gnp-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <svg
                aria-hidden="true"
                className="mr-2 h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              Anterior
            </button>
          )}
          {canNextPage && (
            <button
              onClick={nextPage}
              disabled={!canNextPage}
              className="inline-flex items-center rounded-r border-0 border-l border-gray-700 bg-gnp-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Siguiente
              <svg
                aria-hidden="true"
                className="ml-2 h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
