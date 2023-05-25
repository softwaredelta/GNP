// (c) Delta Software 2023, rights reserved.

type Props = {
  state: string;
  comment: string;
  date: Date;
};

export function ProspectListHistory({ state, comment, date }: Props) {
  function getColorClass(option: string) {
    switch (option) {
      case "Cliente":
        return "bg-green-500";
      case "Cancelado":
        return "bg-yellow-500";
      case "Llamada":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  }
  return (
    <div className="flex rounded-md bg-white p-4 shadow-md">
      <div className="flex w-1/3 items-center">
        <div className="mr-2">
          <div className={`h-4 w-4 rounded-full ${getColorClass(state)}`}></div>
        </div>
        <p className="font-semibold text-gray-500">{state}</p>
      </div>
      <div className="w-3/3">
        <div className="mb-2">
          <p className="text-center font-semibold text-gray-500">{comment}</p>
        </div>
      </div>
      <div className="w-2/3">
        <div className="mb-2">
          <span className="text-center font-semibold text-gray-500">
            {date.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProspectListHistory;
