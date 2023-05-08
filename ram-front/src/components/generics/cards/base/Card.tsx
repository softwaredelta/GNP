// (c) Delta Software 2023, rights reserved.

export interface ICardProps {
  children: React.ReactNode;
  image: string;
  icon?: React.ReactNode;
  color: "blue" | "orange";
}

export default function Card({
  children,
  image,
  icon,
  color,
}: ICardProps): JSX.Element {
  const colorOptions = {
    blue: "bg-gnp-blue-500",
    orange: "bg-gnp-orange-500",
  };

  return (
    <div className="grid w-full grid-cols-1 grid-rows-2 overflow-hidden rounded-lg bg-gnp-white shadow-lg transition-all ease-in-out hover:scale-110 active:scale-95">
      <div className="relative w-full">
        <img src={image} className="aspect-video h-full w-full object-cover" />
        <div
          className={`absolute top-0 left-0 h-full w-full ${colorOptions[color]} bg-opacity-30`}
        ></div>
        {icon && (
          <div
            className={`absolute bottom-0 left-0 right-0 mx-auto flex h-14 w-14 translate-y-7 items-center  rounded-full ${colorOptions[color]} justify-center`}
          >
            {icon}
          </div>
        )}
      </div>
      <div className="w-full bg-gnp-white p-4">{children}</div>
    </div>
  );
}
