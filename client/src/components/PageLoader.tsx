import React from "react";
import { BarLoader } from "react-spinners";
import "./PageLoader.scss";

const PageLoader = () => {
  return (
    <div className="app-page-loader">
      <BarLoader color="#0f62fe" />
    </div>
  );
};

export default PageLoader;
