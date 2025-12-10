import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Private } from "./pages/Private";
import { ResetPassword } from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="reset-password" element={<ResetPassword />} />
      <Route
        path="private"
        element={
          <ProtectedRoute>
            <Private />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<h1>Not found</h1>} />
    </Route>
  )
);
