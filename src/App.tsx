import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Home, Post, NewPost, Login, Register } from "./page";
import { loader as postLoader } from "./page/Post";

import { Provider } from "jotai/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useHydrateAtoms } from "jotai/react/utils";
import { queryClientAtom } from "jotai-tanstack-query";
import { ReactNode } from "react";
import Layout from "./components/Layout";

// eslint-disable-next-line react-refresh/only-export-components
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 1000,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/post/:id",
        element: <Post />,
        loader: postLoader(queryClient),
      },
      {
        path: "/create",
        element: <NewPost />,
      },
    ],
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        <HydrateAtoms>
          <div className="app">
            <div className="layout | wrapper">
              <RouterProvider router={router} />
            </div>
          </div>
        </HydrateAtoms>
      </Provider>
    </QueryClientProvider>
  );
}

const HydrateAtoms = ({ children }: { children: ReactNode }) => {
  useHydrateAtoms([[queryClientAtom, queryClient]]);
  return children;
};

export default App;
