// (c) Delta Software 2023, rights reserved.

import { useUrlFile } from "../lib/files";

interface ImageProps {
  url?: string;
}

export default function ImageURL({ url }: ImageProps): JSX.Element {
  const fileUrl = useUrlFile();

  return (
    <div>
      <div className="aspect-video w-full overflow-hidden rounded-3xl border-4 border-gnp-orange-500 ">
        <img
          className="h-full w-full object-cover"
          src={fileUrl(url as string)}
          role="img"
        />
      </div>
    </div>
  );
}
