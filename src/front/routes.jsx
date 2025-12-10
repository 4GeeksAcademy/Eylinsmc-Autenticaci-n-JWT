import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Signup } from "./pages/Signup";
import { Login } from "./pages/Login";
import { Private } from "./pages/Private";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<Layout />}
      errorElement={<h1>Ups, página no encontrada</h1>}
    >

      <Route index element={<Home />} />

      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />

      <Route
        path="private"
        element={
          <ProtectedRoute>
            <Private />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<h1>Ups, página no encontrada</h1>} />
    </Route>
  )
);
