// (c) Delta Software 2023, rights reserved.

import { getDataSource } from "../arch/db-client";
import { SellEnt } from "../entities/sell.entity";

export enum SaleError {
  POLICY_NUM_DUPLICATED = "POLICY_NUM_DUPLICATED",
  SALE_ERROR = "DEFAULT_ERROR",
  NOT_FOUND = "NOT_FOUND",
  UNHANDLED = "UNHANDLED",
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
  // Static values not handled yet in frontend
  const status = params.status || "sin revisar";
  const evidenceUrl = params.evidenceUrl || "https://picsum.photos/400";

  return ds.manager
    .save(
      SellEnt,
      ds.manager.create(SellEnt, {
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

export async function updateSale(params: {
  id: string;
  policyNumber?: string;
  assuranceTypeId?: string;
  userId?: string;
  paidDate?: Date;
  yearlyFee?: string;
  contractingClient?: string;
  status?: string;
  periodicity?: string;
  evidenceUrl?: string;
  paidFee?: string;
  insuredCostumer?: string;
  emissionDate?: Date;
}): Promise<{ sale: SellEnt; error?: SaleError; errorReason?: Error }> {
  const ds = await getDataSource();

  const existingSale = await ds.manager.findOne(SellEnt, {
    where: { id: params.id },
  });
  if (!existingSale) {
    return {
      error: SaleError.NOT_FOUND,
      sale: {} as SellEnt,
    };
  }
  return ds.manager
    .update(SellEnt, params.id, {
      policyNumber: params.policyNumber,
      assuranceTypeId: params.assuranceTypeId,
      paidDate: params.paidDate,
      yearlyFee: params.yearlyFee,
      contractingClient: params.contractingClient,
      userId: params.userId,
      status: params.status,
      periodicity: params.periodicity,
      evidenceUrl: params.evidenceUrl,
      emissionDate: params.emissionDate,
      insuredCostumer: params.insuredCostumer,
      paidFee: params.paidFee,
    })
    .then(async () => {
      const sale = await ds.manager.findOneOrFail(SellEnt, {
        where: { id: params.id },
      });
      if (sale) return { sale };
      else return { sale: {} as SellEnt, error: SaleError.NOT_FOUND };
    })
    .catch((e) => ({
      error: SaleError.UNHANDLED as SaleError,
      errorReason: e as Error,
      sale: {} as SellEnt,
    }));
}
