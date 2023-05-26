// (c) Delta Software 2023, rights reserved.

import { ILinks } from "../../types";

interface Props {
  links: ILinks[];
}

export default function LinkDelivery({ links }: Props): JSX.Element {
  if (links.length === 0) return <h1>No hay links</h1>;

  return (
    <div className="">
      {links.map((link, index) => {
        return (
          <div key={index} className="flex flex-col" role="link">
            <div className="pt-2">
              <a href={link.link} target="_blank" rel="noopener noreferrer">
                <li className="cursor-pointer transition-all ease-in-out hover:scale-105 hover:text-gnp-blue-400">
                  {" "}
                  {link.name}
                </li>
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
