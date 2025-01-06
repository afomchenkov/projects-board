import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import NotFoundPage from "../pages/NotFoundPage";
import PageLoader from "../components/PageLoader";

const HomePage = lazy(() => import("../pages/HomePage"));
const BoardPage = lazy(() => import("../pages/BoardPage"));

type WithSuspenseType = (props: {
  component: React.JSX.Element;
}) => React.JSX.Element;

const WithSuspense: WithSuspenseType = ({ component = null }) => {
  return <Suspense fallback={<PageLoader />}>{component}</Suspense>;
};

export const router = createBrowserRouter(
  [
    {
      element: <App />,
      loader: () => <PageLoader />,
      children: [
        {
          path: "/",
          index: true,
          element: <WithSuspense component={<HomePage />} />,
        },
        {
          path: "/board",
          index: true,
          element: <WithSuspense component={<BoardPage />} />,
        },
        {
          path: "*",
          element: <NotFoundPage />,
        },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true, // Enables relative paths in nested routes
      v7_fetcherPersist: true, // Retains fetcher state during navigation
      v7_normalizeFormMethod: true, // Normalizes form methods (e.g., POST or GET)
      v7_partialHydration: false, // Supports partial hydration for server-side rendering
      v7_skipActionErrorRevalidation: true, // Prevents revalidation when action errors occur
      v7_startTransition: true,
    },
  }
);
