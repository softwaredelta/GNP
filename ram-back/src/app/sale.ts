// (c) Delta Software 2023, rights reserved.

import { getDataSource } from "../arch/db-client";
import { SellEnt } from "../entities/sell.entity";
import { v4 } from "uuid";
import { UserEnt } from "../entities/user.entity";
import { DeepPartial } from "typeorm";
import { AssuranceTypeEnt } from "../entities/assurance-type.entity";
export enum SaleError {
  POLICY_NUM_DUPLICATED = "POLICY_NUM_DUPLICATED",
  SALE_ERROR = "DEFAULT_ERROR",
}
export async function createSale(params: {
  policyNumber: string;
  assuranceType: DeepPartial<AssuranceTypeEnt>;
  sellDate: Date;
  amountInCents: string;
  clientName: string;
  periodicity: string;
  id?: string;
  status?: string;
  user?: DeepPartial<UserEnt>;
  evidenceUrl?: string;
}): Promise<{ sale: SellEnt; error?: SaleError }> {
  const ds = await getDataSource();
  const id = params.id || v4();
  // Static values not handled yet in frontend
  const status = "sin revisar";
  const user = {
    email: "test@delta.tec.mx",
    password: "test-password",
    id: "test-user",
  };

  return ds.manager
    .save(SellEnt, {
      id,
      policyNumber: params.policyNumber,
      assuranceType: params.assuranceType,
      sellDate: params.sellDate,
      amountInCents: params.amountInCents,
      clientName: params.clientName,
      periodicity: params.periodicity,
      user: user,
      status,
      evidenceUrl: "https://www.google.com",
    })
    .then((sale) => {
      return { sale };
    })
    .catch(() => {
      return { sale: {} as SellEnt, error: SaleError.SALE_ERROR };
    });
}
