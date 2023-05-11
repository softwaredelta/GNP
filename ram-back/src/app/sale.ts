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
  paidDate: Date;
  yearlyFee: string;
  contractingClient: string;
  status?: string;
  periodicity: string;
  evidenceUrl?: string;
  id?: string;
  paidFee: string;
  insuredCostumer: string;
  emissionDate: Date;
}): Promise<{ sale: SellEnt; error?: SaleError; reason?: Error }> {
  const ds = await getDataSource();
  const id = params.id || v4();
  // Static values not handled yet in frontend
  const status = params.status || "sin revisar";
  const evidenceUrl = params.evidenceUrl || "https://picsum.photos/400";

  return ds.manager
    .save(
      SellEnt,
      ds.manager.create(SellEnt, {
        id,
        policyNumber: params.policyNumber,
        assuranceTypeId: params.assuranceTypeId,
        paidDate: params.paidDate,
        yearlyFee: params.yearlyFee,
        contractingClient: params.contractingClient,
        userId: params.userId,
        status,
        periodicity: params.periodicity,
        evidenceUrl: evidenceUrl,
        emissionDate: params.emissionDate,
        insuredCostumer: params.insuredCostumer,
        paidFee: params.paidFee,
      }),
    )
    .then((sale) => {
      return { sale };
    })
    .catch((e) => {
      if (e.code === "23505") {
        return { sale: {} as SellEnt, error: SaleError.POLICY_NUM_DUPLICATED };
      }
      return { sale: {} as SellEnt, error: SaleError.SALE_ERROR, reason: e };
    });
}
