// (c) Delta Software 2023, rights reserved.

import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import { apiBase$ } from "./api/api-base";

export function useOpenFile() {
  const apiBase = useRecoilValue(apiBase$);

  return useCallback(
    (filePath: string): void => {
      const url = new URL(apiBase + "/files");
      url.searchParams.append("fileUrl", filePath);
      window.open(url.toString(), "_blank");
    },
    [apiBase],
  );
}

export function useUrlFile() {
  const apiBase = useRecoilValue(apiBase$);

  return useCallback(
    (filePath: string): string => {
      const url = new URL(apiBase + "/files");
      url.searchParams.append("fileUrl", filePath);
      return url.toString();
    },
    [apiBase],
  );
}
