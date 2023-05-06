// (c) Delta Software 2023, rights reserved.

export default function SkeletonDiv(): JSX.Element {
  return (
    <div role="status" className="h-full w-full animate-pulse border">
      <div className="mx-auto mb-2.5 h-full w-full  bg-gray-300 dark:bg-gray-700"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
