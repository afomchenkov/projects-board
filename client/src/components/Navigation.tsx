import React, { memo } from "react";
import { NavLink } from "react-router-dom";
import "./Navigation.scss";

const NavigationLink = ({ path = "", caption = "" }) => {
  return (
    <NavLink
      aria-label={`Navigate ${caption}`}
      role="listitem"
      to={path}
      className={({ isActive }) => {
        const baseClass = "app-navigation__menu-item";
        return isActive ? baseClass + " is-active" : baseClass;
      }}
    >
      {caption}
    </NavLink>
  );
};

const Navigation = () => {
  return (
    <section className="app-navigation">
      <nav
        aria-label="Navigation Menu"
        className="app-navigation__menu"
        role="list"
      >
        <NavigationLink path="/" caption="Home" />
        <NavigationLink path="/board" caption="Board" />
      </nav>
    </section>
  );
};

export default memo(Navigation);
