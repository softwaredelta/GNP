// (c) Delta Software 2023, rights reserved.
export interface DeliveryCardProps {
  children: React.ReactNode;
  nameDelivery: string;
  image: string;
  color: "blue" | "orange";
}

export default function DeliveryManagementCard({
  children,
  nameDelivery,
  image,
  color,
}: DeliveryCardProps): JSX.Element {
  const colorOptions = {
    blue: "bg-gnp-blue-500",
    orange: "bg-gnp-orange-500",
  };
  return (
    <div className="grid w-full grid-cols-2  overflow-hidden rounded-b-lg bg-gnp-white shadow-lg transition-all ease-in-out hover:scale-110">
      <div className="grid grid-cols-3 ">
        <div className="relative">
          <img className="h-20 w-full object-cover" src={image} />
          <div
            className={`absolute top-0 left-0 h-full w-full ${colorOptions[color]} bg-opacity-50`}
          ></div>
        </div>
        <div className="col-span-2 flex items-center justify-center text-center font-semibold">
          {nameDelivery}
        </div>
      </div>
      {children}
    </div>
  );
}
