import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import { sappersRoutes } from "./routes";
import MainLayout from "./features/layout";
import { useCookie } from "./hooks/useCookie";
import { useEffect } from "react";
import { setupInterceptors } from "./api";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route element={<MainLayout />}>{sappersRoutes()}</Route>
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Route>
  )
);

function App() {
  const { getAccessToken, setAccessToken } = useCookie();

  useEffect(() => {
    setupInterceptors({ getAccessToken, setAccessToken });
  }, [getAccessToken, setAccessToken]);
  return <RouterProvider router={router} />;
}

export default App;
