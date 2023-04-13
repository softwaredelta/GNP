// (c) Delta Software 2023, rights reserved.

export interface ICardProps {
  children: React.ReactNode;
  image?: string;
  icon?: React.ReactNode;
  color?: string;
}

export default function Card({
  children,
  image,
  icon,
  color,
}: ICardProps): JSX.Element {
  return (
    <div className="bg-gnp-white rounded-lg shadow-lg w-full grid grid-rows-2 grid-cols-1 overflow-hidden">
      <div className="w-full relative">
        <img src={image} className=" w-full object-cover" />
        <div
          className={`absolute top-0 left-0 w-full h-full bg-gnp-${color} bg-opacity-30`}
        ></div>
        <div
          className={`absolute bottom-0 left-0 right-0 mx-auto translate-y-7 w-14 h-14 flex items-center  rounded-full bg-gnp-${color} bg-opacity-80 justify-center`}
        >
          {icon}
        </div>
      </div>
      <div className="bg-gnp-white p-4 w-full">{children}</div>
    </div>
  );
}
