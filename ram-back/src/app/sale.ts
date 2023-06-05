// (c) Delta Software 2023, rights reserved.

import { getDataSource } from "../arch/db-client";
import { SellEnt } from "../entities/sell.entity";

export enum SaleError {
  POLICY_NUM_DUPLICATED = "POLICY_NUM_DUPLICATED",
  SALE_ERROR = "DEFAULT_ERROR",
  NOT_FOUND = "NOT_FOUND",
  UNHANDLED = "UNHANDLED",
}

/**
 * This function creates a new sale record in a data source and returns the sale object or an error if
 * the policy number is duplicated or there is a sale error.
 * @param params - The function `createSale` takes in an object `params` with the following
 * properties: policyNumber of type string, assuranceTypeId of type string, userId of type string,
 * paidDate of type Date, yearlyFee of type string, contractingClient of type string, status(Optional) of
 * type string, periodicity of type string, evidenceUrl(Optional) of type string, id(Optional) of type
 * string, paidFee of type string, insuredCostumer of type string, emissionDate of type Date.
 * @returns a Promise that resolves to an object with a "sale" property that contains a SellEnt object,
 * and optionally an "error" property with a SaleError value and a "reason" property with an Error
 * object.
 */
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

/**
 * This function updates a sale record in a database and returns the updated sale or an error if the
 * sale is not found or an unhandled error occurs.
 * @param params - The `params` object is a set of optional parameters used to update a sale record in
 * a database. It includes the following properties: id of type string, policyNumber(Optional) of type
 * string, assuranceType(Optional) of type string, userId of type string, paidDate(Optional) of type
 * Date, yearlyFee of type string, contractingClient(Optional) of type string, status(Optional) of
 * type string, periodicity(Optional) of type string, evidenceUrl(Optional) of type string,
 * paidFee(Optional) of type string, insuredCostumer(Optional) of type string, emissionDate(Optional)
 * of type Date.
 * @returns a Promise that resolves to an object containing the updated sale object and optionally an
 * error and/or an error reason.
 */
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
