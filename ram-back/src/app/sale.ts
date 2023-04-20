// (c) Delta Software 2023, rights reserved.

import { getDataSource } from "../arch/db-client";
import { SellEnt } from "../entities/sell.entity";
import { v4 } from "uuid";
import { DeepPartial } from "typeorm";
import { AssuranceTypeEnt } from "../entities/assurance-type.entity";
export enum SellError {
  POLICY_NUM_DUPLICATED = "POLICY_NUM_DUPLICATED",
  SALE_ERROR = "SALE_ERROR",
}
 
export async function createSale(params: {
  policyNumber: string;
  assuranceType: DeepPartial<AssuranceTypeEnt>;
  sellDate: Date;
  amountInCents: string;
  clientName: string;
  id?: string;
  status?: string;
  periodicity?: string;
}): Promise<{ sale: SellEnt; error?: SellError }> {
  const ds = await getDataSource();
  const id = params.id || v4();
  const status = "sin revisar";
  const periodicity = "mensual";
  //   const evidenceUrl = "https://www.google.com";
  //   const user = createUser({ email: "user@user.test", password: "123456", id: "123456" });
  //   const createdAt = new Date();
  //   const updatedAt = new Date();

  return ds.manager
    .save(SellEnt, {
      id,
      policyNumber: params.policyNumber,
      assuranceType: params.assuranceType,
      sellDate: params.sellDate,
      amountInCents: params.amountInCents,
      clientName: params.clientName,
      status,
      periodicity,
    })
    .then((sale) => {
      return { sale };
    })
    .catch((error) => {
      return { sale: {} as SellEnt, error: error.message };
    });
}
