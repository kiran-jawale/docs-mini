import React from "react";
import ReactDOM from "react-dom/client";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import { DomProvider } from "./contexts/DomContext.jsx";
import "./index.css";

// Layouts
import Layout from "./pages/layout/Layout.jsx";
import AuthLayout from "./pages/AuthLayout.jsx";

// Pages (Imports based on structure)
import Home from "./pages/home/Home.jsx";
import Auth from "./pages/auth/Auth.jsx";
import Docs from "./pages/docs/Docs.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Settings from "./pages/settings/Settings.jsx";
import About from "./pages/about/About.jsx";
import Contact from "./pages/contact/Contact.jsx";
import Terms from "./pages/terms/Terms.jsx";
import Privacy from "./pages/privacy/Privacy.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/* Public Routes */}
      <Route path="" element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="contact" element={<Contact />} />
      <Route path="terms-and-conditions" element={<Terms />} />
      <Route path="privacy-policy" element={<Privacy />} />

      {/* Auth Route (Only for non-logged in users) */}
      <Route element={<AuthLayout authenticationRequired={false} />}>
        <Route path="auth" element={<Auth />} />
      </Route>

      {/* Protected Routes (Logged in users only) */}
      <Route element={<AuthLayout authenticationRequired={true} />}>
        <Route path="docs" element={<Docs />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <DomProvider>
          <RouterProvider router={router} />
        </DomProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);