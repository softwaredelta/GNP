// (c) Delta Software 2023, rights reserved.

import React from "react";
import { Label, TextInput } from "flowbite-react";
import { Button } from "../button";

export const SalesFilters = () => {
  return (
    <div className="flex">
      <div className="w-1/5 mr-4">
        <div className="mb-2 block ">
          <Label htmlFor="clientName" value="Nombre del cliente" />
        </div>
        <TextInput id="clientName" type="text" placeholder="Kenny Vercamer" />
      </div>
      <div className="w-1/5 mr-4">
        <div className="mb-2 block">
          <Label htmlFor="clientName" value="Póliza" />
        </div>
        <TextInput id="clientName" type="text" placeholder="Kenny Vercamer" />
      </div>
      <div className="w-1/5 mr-4">
        <div className="mb-2 block">
          <Label htmlFor="clientName" value="Tipo de Seguro" />
        </div>
        <TextInput id="clientName" type="text" placeholder="Kenny Vercamer" />
      </div>
      <div className="w-1/5 mr-8">
        <div className="mb-2 block">
          <Label htmlFor="clientName" value="Periodo" />
        </div>
        <TextInput id="clientName" type="text" placeholder="Kenny Vercamer" />
      </div>
      <div className="w-1/5 block my-auto">
        <button className="btn-primary">Filtrar</button>
      </div>
    </div>
  );
};
