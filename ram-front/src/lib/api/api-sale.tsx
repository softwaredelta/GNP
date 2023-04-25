import useAxios from "../../hooks/useAxios";

export type SaleData = {
    policyNumber: string;
    sellDate: Date | null;
    assuranceType: {
      id: string;
    };
    amountInCents: string;
    clientName: string;
    periodicity: string;
  };
  
  type CreateSaleResponse = {
    data: {
      group: {
        id: string;
        name: string;
      };
    };
  };
  
  type UseCreateSaleProps = {
    saleData: SaleData;
  };
  
  export function CreateNewSale({ saleData }: UseCreateSaleProps) {
    const { response, error, callback } = useAxios<CreateSaleResponse>({
      url: "sales/create",
      method: "POST",
      body: saleData,
    });
  
    return { response, error, callback };
  }