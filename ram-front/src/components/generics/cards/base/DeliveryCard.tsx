// (c) Delta Software 2023, rights reserved.
export interface DeliveryCardProps {
  children: React.ReactNode;
  nameDelivery: string;
  image: string;
  color: "blue" | "orange";
  // status: "Sin enviar" | "Enviado" | "Rechazado" | "Aceptado";
}

export default function DeliveryCard({
  children,
  nameDelivery,
  image,
  color,
}: // status,
DeliveryCardProps): JSX.Element {
  const colorOptions = {
    blue: "bg-gnp-blue-500",
    orange: "bg-gnp-orange-500",
  };
  return (
    <div className="w-full grid grid-cols-2  rounded-b-lg overflow-hidden bg-gnp-white shadow-lg">
      <div className="grid grid-cols-3 ">
        <div className="relative">
          <img className="w-full h-20 object-cover" src={image} />
          <div
            className={`absolute top-0 left-0 w-full h-full ${colorOptions[color]} bg-opacity-50`}
          ></div>
        </div>
        <div className="col-span-2 flex items-center text-center justify-center font-semibold">
          {nameDelivery}
        </div>
      </div>
      {children}
    </div>
  );
}
