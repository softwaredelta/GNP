// (c) Delta Software 2023, rights reserved.
import { In } from "typeorm";
import { getDataSource } from "../arch/db-client";
import { GroupUserStatus } from "../entities/group-user.entity";
import { GroupUserEnt } from "../entities/group-user.entity";
import { GroupEnt } from "../entities/group.entity";

export enum GroupError {
  UNHANDLED = "UNHANDLED",
}

export async function createDelivery(params: {
  name: string;
  imageURL: string;
}): Promise<{ group: GroupEnt; error?: GroupError; errorReason?: Error }> {
  const ds = await getDataSource();

  return ds.manager
    .save(
      ds.manager.create(GroupEnt, {
        name: params.name,
        imageURL: params.imageURL,
      }),
    )
    .then((group) => {
      return { group };
    })
    .catch((e) => ({
      error: GroupError.UNHANDLED,
      errorReason: e,
      group: {} as GroupEnt,
    }));
}
