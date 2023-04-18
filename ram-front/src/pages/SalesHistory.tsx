// (c) Delta Software 2023, rights reserved.

import React from "react";
import { SalesTable } from "../components/SalesHistory/SalesTable";
import { SalesFilters } from "../components/SalesHistory/SalesFilters";
import Wrapper from "../containers/Wrapper";
import { Pagination } from "flowbite-react";
import {useState} from "react";

export const SalesHistory = () => {
  const [indexStart, setIndexStart] = useState(0);
  const [indexEnd, setIndexEnd] = useState(5);
  function onPageChange(){
    // if (newPage < currentPage){
    //   setIndexStart(indexStart - 5);
    //   setIndexEnd(indexEnd - 5);
    // }
    setIndexEnd(indexEnd + 5);
    setIndexStart(indexStart + 5);
  }
  return (
    <Wrapper>
      <div className="flex flex-col mt-8 justify-center items-center">
        <SalesFilters />
        <SalesTable indexStart={indexStart} indexEnd={indexEnd} />
        <div className="flex items-center justify-center text-center">
  <Pagination
  
    currentPage={1}
    layout="table"
    onPageChange={onPageChange}
    totalPages={1000}
  />
</div>
      </div>
    </Wrapper>
  );
};
