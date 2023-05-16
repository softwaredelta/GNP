// (c) Delta Software 2023, rights reserved.

import { useEffect, useState } from "react";
import { type RecoilValue, useRecoilValueLoadable } from "recoil";

export function useLoadable<T>(
  defaultValue: Partial<T>,
  recoilLoadable: RecoilValue<T>,
  pick?: [keyof T],
): [T, "loading" | "hasValue" | "hasError"];
export function useLoadable<T>(
  defaultValue: Partial<T>,
  recoilLoadable: RecoilValue<T>,
  pick?: [keyof T],
): [Partial<T>, "loading" | "hasValue" | "hasError"] {
  const [value, setValue] = useState(defaultValue);
  const recoilValue = useRecoilValueLoadable<T>(recoilLoadable);

  let returnValue: Partial<T> = defaultValue;

  useEffect(() => {
    if (recoilValue.state === "hasValue" && recoilValue.contents !== value) {
      setValue(recoilValue.contents);
    }
  }, [recoilValue.contents, recoilValue.state, value]);

  if (recoilValue.state !== "hasValue" && value) {
    if (pick) {
      returnValue = pick.reduce(
        (res, key) => ({ ...res, [key]: value[key] }),
        {},
      );
    } else {
      returnValue = value;
    }
  }

  if (recoilValue.state === "hasValue") {
    returnValue = recoilValue.contents;
  }

  return [returnValue, recoilValue.state];
}
