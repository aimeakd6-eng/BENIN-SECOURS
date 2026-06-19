import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/accueil");
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-primary-500 px-6">
      <div className="animate-fade-in flex flex-col items-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-sm">
          <Shield className="h-12 w-12 text-white" />
        </div>
        <h1 className="mt-6 text-3xl font-black tracking-tight text-white">
          BENIN SECOURS
        </h1>
        <div className="mt-3 h-1 w-24 overflow-hidden rounded-full bg-white/20">
          <div className="h-full animate-pulse rounded-full bg-white" />
        </div>
        <p className="mt-6 text-center text-base font-medium text-white/80">
          Votre dépanneur en 15 minutes
        </p>
      </div>
    </div>
  );
}
