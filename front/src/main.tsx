import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import "./index.css";
import Login from "./pages/no-auth/login";
import SignUp from "./pages/no-auth/signup";
import HomePage from "./pages/auth/home";
import SecurePage from "./components/auth/SecurePage";
import NoAuthPage from "./components/auth/NoAuthPage";
import PageLayout from "./components/ui/layout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: Infinity, //
      retry: 5,
      gcTime: 1000 * 60 * 5,
    },
  },
});
const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <NoAuthPage>
        <Login />
      </NoAuthPage>
    ),
  },
  {
    path: "/signup",
    element: (
      <NoAuthPage>
        <SignUp />
      </NoAuthPage>
    ),
  },
  {
    path: "/",
    element: (
      <QueryClientProvider client={queryClient}>
        <SecurePage>
          <PageLayout>
            <HomePage />
          </PageLayout>
        </SecurePage>
      </QueryClientProvider>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/login" />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <div className="bg-[#f1f5f9] text-[#595959] font-roboto font-medium">
    <RouterProvider router={router} />
  </div>
);
