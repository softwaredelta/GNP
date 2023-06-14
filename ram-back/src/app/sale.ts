// (c) Delta Software 2023, rights reserved.

import { getDataSource } from "../arch/db-client";
import { AssuranceTypeEnt } from "../entities/assurance-type.entity";
import { SellEnt } from "../entities/sell.entity";
import { Between, Like } from "typeorm";

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
 * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=924979067
 * M2_S01
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
  const status = params.status || "Sin revisar";
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
      console.log(e);
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
 * Link to functional requirements: https://docs.google.com/spreadsheets/d/1ijuDjWE1UxtgRoeekSNPiPbB5AByjpyzYiSnwvLzQ4Q/edit#gid=877323064
 * M2_S06
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

/**
 * This function retrieves sales data based on various search parameters and returns it as an array of
 * SellEnt objects.
 * @param params - The `getSalesByUserId` function takes in an object `params` with the following
 * properties: userId of type string, policyNumber(Optional) of type string, periodicity(Optional) of
 * type string, assuranceTypeId(Optional) of type string, contractingClient(Optional) of type string,
 * startDate(Optional) of type Date, endDate(Optional) of type Date, status(Optional) of type string.
 * @returns a Promise that resolves to an object with a `sales` property, which is an array of
 * `SellEnt` objects. If an error occurs during the execution of the function, the Promise resolves to
 * an object with an `error` property set to `SaleError.UNHANDLED` and an `errorReason` property set to
 * the caught error.
 */
export async function getSalesByUserId(params: {
  userId: string;
  policyNumber: string;
  periodicity: string;
  assuranceTypeId: string;
  contractingClient: string;
  startDate: Date;
  endDate: Date;
  status: string;
}): Promise<{ sales: SellEnt[]; error?: SaleError; errorReason?: Error }> {
  const {
    userId,
    policyNumber,
    periodicity,
    assuranceTypeId,
    contractingClient,
    startDate,
    endDate,
    status,
  } = params;
  const db = await getDataSource();
  try {
    const sales = await db.manager.find(SellEnt, {
      relations: {
        assuranceType: true,
        user: true,
      },
      select: {
        id: true,
        policyNumber: true,
        paidDate: true,
        yearlyFee: true,
        contractingClient: true,
        periodicity: true,
        emissionDate: true,
        insuredCostumer: true,
        paidFee: true,
        evidenceUrl: true,
        status: true,
        assuranceType: {
          id: true,
          name: true,
        },
        user: {
          id: true,
          name: true,
          lastName: true,
          password: false,
        },
      },
      where: {
        userId: Like(`%${userId}%`),
        policyNumber: Like(`%${policyNumber}%`),
        periodicity: Like(`%${periodicity}%`),
        assuranceTypeId: Like(`%${assuranceTypeId}%`),
        contractingClient: Like(`%${contractingClient}%`),
        paidDate: Between(startDate, endDate),
        status: Like(`%${status}%`),
      },
    });
    return { sales };
  } catch (e) {
    return {
      sales: [] as SellEnt[],
      error: SaleError.UNHANDLED,
      errorReason: e as Error,
    };
  }
}

type Result = {
  key: string;
  totalPaidFee: number;
};

type Query = {
  assuranceTypeId: string;
  resultKey: string;
};

export async function getSalesByMonth(params: {
  userId: string;
  initialDate: Date;
  finalDate: Date;
}): Promise<{ results: Result[]; error?: SaleError; errorReason?: Error }> {
  const startDate = new Date(
    new Date(params.initialDate).getFullYear(),
    new Date(params.initialDate).getMonth(),
    1,
  );
  const endDate = new Date(
    new Date(params.finalDate).getFullYear(),
    new Date(params.finalDate).getMonth() + 1,
    0,
  );
  const db = await getDataSource();

  const queries: Query[] = [];
  const assuranceTypes = await db.manager.find(AssuranceTypeEnt);
  assuranceTypes.forEach((assuranceType) => {
    queries.push({
      assuranceTypeId: assuranceType.id,
      resultKey: assuranceType.name,
    });
  });

  let results: Result[] = [];

  try {
    await db.manager.transaction(async (transactionalEntityManager) => {
      results = await Promise.all(
        queries.map(async (query) => {
          try {
            const result = await transactionalEntityManager
              .createQueryBuilder(SellEnt, "sell")
              .leftJoinAndSelect("sell.assuranceType", "assuranceType")
              .leftJoinAndSelect("sell.user", "user")
              .select("SUM(sell.paidFee)", "totalPaidFee")
              .where("sell.userId = :userId", { userId: params.userId })
              .andWhere("sell.status = :status", { status: "Aceptada" })
              .andWhere("sell.assuranceTypeId = :assuranceTypeId", {
                assuranceTypeId: query.assuranceTypeId,
              })
              .andWhere("sell.paidDate BETWEEN :startDate AND :endDate", {
                startDate,
                endDate,
              })
              .getRawOne();

            return { key: query.resultKey, totalPaidFee: result.totalPaidFee };
          } catch (e) {
            return { key: query.resultKey, totalPaidFee: 0 };
          }
        }),
      );
    });
  } catch (e) {
    return {
      results: [] as Result[],
      error: SaleError.UNHANDLED,
      errorReason: e as Error,
    };
  }

  return { results };
}
