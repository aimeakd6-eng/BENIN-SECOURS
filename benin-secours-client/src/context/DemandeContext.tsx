import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface DemandeContextType {
  categorieVehicule: "Moto" | "Véhicule" | null;
  setCategorieVehicule: (cat: "Moto" | "Véhicule" | null) => void;
  typePanne: string | null;
  setTypePanne: (type: string | null) => void;
  currentDemandeId: string | null;
  setCurrentDemandeId: (id: string | null) => void;
  userLocation: { latitude: number; longitude: number } | null;
  setUserLocation: (loc: { latitude: number; longitude: number } | null) => void;
  description: string;
  setDescription: (d: string) => void;
  resetDemande: () => void;
}

const DemandeContext = createContext<DemandeContextType>({
  categorieVehicule: null,
  setCategorieVehicule: () => {},
  typePanne: null,
  setTypePanne: () => {},
  currentDemandeId: null,
  setCurrentDemandeId: () => {},
  userLocation: null,
  setUserLocation: () => {},
  description: "",
  setDescription: () => {},
  resetDemande: () => {},
});

export function DemandeProvider({ children }: { children: ReactNode }) {
  const [categorieVehicule, setCategorieVehicule] = useState<"Moto" | "Véhicule" | null>(null);
  const [typePanne, setTypePanne] = useState<string | null>(null);
  const [currentDemandeId, setCurrentDemandeId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [description, setDescription] = useState("");

  const resetDemande = () => {
    setCategorieVehicule(null);
    setTypePanne(null);
    setCurrentDemandeId(null);
    setDescription("");
  };

  return (
    <DemandeContext.Provider
      value={{
        categorieVehicule,
        setCategorieVehicule,
        typePanne,
        setTypePanne,
        currentDemandeId,
        setCurrentDemandeId,
        userLocation,
        setUserLocation,
        description,
        setDescription,
        resetDemande,
      }}
    >
      {children}
    </DemandeContext.Provider>
  );
}

export function useDemande() {
  return useContext(DemandeContext);
}
