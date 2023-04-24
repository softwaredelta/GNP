// (c) Delta Software 2023, rights reserved.

import { getDataSource } from "../arch/db-client";
import { SellEnt } from "../entities/sell.entity";
import { v4 } from "uuid";
import { UserEnt } from "../entities/user.entity";
import { DeepPartial } from "typeorm";
import { AssuranceTypeEnt } from "../entities/assurance-type.entity";

export enum SellError {
  POLICY_NUM_DUPLICATED = "POLICY_NUM_DUPLICATED",
  SALE_ERROR = "DEFAULT_ERROR",
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
  user?: DeepPartial<UserEnt>;
  evidenceUrl?: string;
}): Promise<{ sale: SellEnt; error?: SellError }> {
  const ds = await getDataSource();
  const id = params.id || v4();

  // Static values not handled yet in frontend
  const status = "sin revisar";
  const periodicity = "mensual";
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
      user: user,
      status,
      periodicity,
      evidenceUrl: "https://www.google.com",
    })
    .then((sale) => {
      return { sale };
    })
    .catch(() => {
      return { sale: {} as SellEnt, error: SellError.SALE_ERROR };
    });
}
