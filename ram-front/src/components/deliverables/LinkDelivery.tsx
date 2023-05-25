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
          <div key={index} className="flex flex-col">
            <a href={link.link} target="_blank" rel="noopener noreferrer">
              <li> {link.name}</li>
            </a>
          </div>
        );
      })}
    </div>
  );
}
