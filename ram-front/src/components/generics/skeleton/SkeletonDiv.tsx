// (c) Delta Software 2023, rights reserved.

export default function SkeletonDiv(): JSX.Element {
  return (
    <div role="status" className="animate-pulse h-full w-full border">
      <div className="bg-gray-300 w-full h-full dark:bg-gray-700  mb-2.5 mx-auto"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
