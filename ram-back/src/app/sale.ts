// (c) Delta Software 2023, rights reserved.

import { getDataSource } from "../arch/db-client";
import { SellEnt } from "../entities/sell.entity";
import { v4 } from "uuid";

export enum SaleError {
  POLICY_NUM_DUPLICATED = "POLICY_NUM_DUPLICATED",
  SALE_ERROR = "DEFAULT_ERROR",
}

export async function createSale(params: {
  policyNumber: string;
  assuranceTypeId: string;
  userId: string;
  sellDate: Date;
  amountInCents: string;
  clientName: string;
  status?: string;
  periodicity?: string;
  evidenceUrl?: string;
  id?: string;
}): Promise<{ sale: SellEnt; error?: SaleError }> {
  const ds = await getDataSource();
  const id = params.id || v4();

  // Static values not handled yet in frontend
  const status = "sin revisar";
  const periodicity = "mensual";

  return ds.manager
    .save(SellEnt, {
      id,
      policyNumber: params.policyNumber,
      assuranceType: {
        id: params.assuranceTypeId,
      },
      sellDate: params.sellDate,
      amountInCents: params.amountInCents,
      clientName: params.clientName,
      user: {
        id: params.userId,
      },
      status,
      periodicity,
      evidenceUrl: "https://www.google.com",
    })
    .then((sale) => {
      return { sale };
    })
    .catch((e) => {
      if (e.code === "23505") {
        return { sale: {} as SellEnt, error: SaleError.POLICY_NUM_DUPLICATED };
      }

      return { sale: {} as SellEnt, error: SaleError.SALE_ERROR };
    });
}
