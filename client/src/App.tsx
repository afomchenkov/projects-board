import React from "react";
import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import Navigation from "./components/Navigation";
import { useConsole } from "./hooks/useConsole";
import { AppProvider } from "./state/appProvider";
import "./App.scss";

const FallbackComponent = () => {
  return <div>Something went wrong</div>;
};

const App = () => {
  const { consoleError } = useConsole();

  return (
    <AppProvider>
      <header className="app-layout__header" role="menu">
        <Navigation />
      </header>
      <ErrorBoundary
        FallbackComponent={FallbackComponent}
        onError={consoleError}
      >
        <main className="app-layout__main" role="main">
          <Outlet />
        </main>
      </ErrorBoundary>
      <footer className="app-layout__footer"></footer>
    </AppProvider>
  );
};

export default App;
