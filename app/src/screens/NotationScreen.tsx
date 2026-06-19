import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Star, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { creerAvis } from "@/services/supabase_service";
import EtoilesWidget from "@/components/EtoilesWidget";

export default function NotationScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();

  const [competence, setCompetence] = useState(0);
  const [ponctualite, setPonctualite] = useState(0);
  const [tarif, setTarif] = useState(0);
  const [commentaire, setCommentaire] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const noteGlobale = competence > 0 && ponctualite > 0 && tarif > 0
    ? Math.round((competence + ponctualite + tarif) / 3)
    : 0;

  const handleSubmit = async () => {
    if (!profile || !id) return;
    if (competence === 0 || ponctualite === 0 || tarif === 0) {
      alert("Veuillez noter tous les critères");
      return;
    }
    setLoading(true);
    const success = await creerAvis({
      intervention_id: id,
      client_id: profile.id,
      prestataire_id: "",
      note_globale: noteGlobale,
      note_competence: competence,
      note_ponctualite: ponctualite,
      note_tarif: tarif,
      commentaire: commentaire || undefined,
    });
    if (success) setSubmitted(true);
    else alert("Erreur lors de l'envoi de l'avis");
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="flex h-screen flex-col items-center justify-center px-6" style={{ backgroundColor: "var(--color-bg)" }}>
        <div className="flex flex-col items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-gray-900">Merci pour votre avis !</h2>
          <p className="mt-2 text-center text-sm text-gray-500">Votre évaluation a été enregistrée et aidera les autres utilisateurs.</p>
          <button onClick={() => navigate("/mes-demandes")}
            className="mt-6 rounded-2xl px-8 py-3 text-sm font-bold text-white transition-all active:scale-[0.98]"
            style={{ backgroundColor: "var(--color-primary)" }}>
            Retour à mes demandes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: "var(--color-bg)" }}>
      <header className="flex items-center gap-3 bg-white px-4 py-4 shadow-sm">
        <button onClick={() => navigate(-1)} className="rounded-full p-1.5 text-gray-600 transition-all active:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Évaluation</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-center text-lg font-bold text-gray-900">Notez l&apos;intervention</h2>
          <div className="mt-2 flex items-center justify-center gap-1">
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            <span className="text-2xl font-bold text-amber-500">{noteGlobale > 0 ? noteGlobale : "-"}</span>
            <span className="text-sm text-gray-400">/5</span>
          </div>

          <div className="mt-6 space-y-6">
            {[
              { label: "Compétence technique", note: competence, setNote: setCompetence },
              { label: "Ponctualité", note: ponctualite, setNote: setPonctualite },
              { label: "Rapport qualité/prix", note: tarif, setNote: setTarif },
            ].map((critere) => (
              <div key={critere.label}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{critere.label}</span>
                  <span className="text-xs text-gray-400">{critere.note}/5</span>
                </div>
                <div className="mt-2 flex justify-center">
                  <EtoilesWidget note={critere.note} onChange={critere.setNote} size="lg" />
                </div>
              </div>
            ))}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Commentaire (optionnel)</label>
              <textarea value={commentaire} onChange={(e) => setCommentaire(e.target.value)}
                placeholder="Partagez votre expérience..." rows={4}
                className="w-full resize-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-[#4A90E2] focus:bg-white focus:ring-2 focus:ring-[#4A90E2]/20" />
            </div>
          </div>
        </div>
      </main>

      <footer className="sticky bottom-0 border-t border-gray-200 bg-white p-4">
        <button onClick={handleSubmit} disabled={loading || noteGlobale === 0}
          className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold text-white shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
          style={{ backgroundColor: "var(--color-primary)", boxShadow: "0 4px 14px rgba(74, 144, 226, 0.3)" }}>
          {loading ? "Envoi..." : "ENVOYER MON AVIS"}
        </button>
      </footer>
    </div>
  );
}
