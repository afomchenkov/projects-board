import React from "react";
import "./BaseLayout.scss";

type BaseLayoutType = (props: {
  title: React.JSX.Element;
  children?: React.JSX.Element;
}) => React.JSX.Element;

const BaseLayout: BaseLayoutType = ({ title, children }) => {
  return (
    <div className="app-base-layout">
      <div className="app-base-layout__title">{title}</div>
      <div className="app-base-layout__body">{children}</div>
    </div>
  );
};

export default BaseLayout;
