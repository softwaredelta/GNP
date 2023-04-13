import React from "react";

import { Route, Routes, useNavigate } from "react-router-dom";
import Wrapper from "./Wrapper";

type Props = {};

function Layout({}: Props) {
  return (
    <>
      <Wrapper>
        <Routes></Routes>
      </Wrapper>
    </>
  );
}

export default Layout;
