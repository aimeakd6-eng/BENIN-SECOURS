import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DemandeProvider } from "./context/DemandeContext";
import "./index.css";

import AccueilScreen from "./screens/AccueilScreen";
import LoginScreen from "./screens/auth/LoginScreen";
import RegisterScreen from "./screens/auth/RegisterScreen";
import SignalerPanneScreen from "./screens/SignalerPanneScreen";
import ListeDepanneursScreen from "./screens/ListeDepanneursScreen";
import DetailDepanneurScreen from "./screens/DetailDepanneurScreen";
import MesDemandesScreen from "./screens/MesDemandesScreen";
import DetailDemandeScreen from "./screens/DetailDemandeScreen";
import NotationScreen from "./screens/NotationScreen";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DemandeProvider>
          <Routes>
            <Route path="/" element={<AccueilScreen />} />
            <Route path="/accueil" element={<AccueilScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/signaler-panne" element={<SignalerPanneScreen />} />
            <Route path="/depanneurs" element={<ListeDepanneursScreen />} />
            <Route path="/depanneur/:id" element={<DetailDepanneurScreen />} />
            <Route path="/mes-demandes" element={<MesDemandesScreen />} />
            <Route path="/demande/:id" element={<DetailDemandeScreen />} />
            <Route path="/notation/:id" element={<NotationScreen />} />
          </Routes>
        </DemandeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
