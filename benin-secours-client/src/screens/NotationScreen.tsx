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

    // Récupérer le prestataire lié à cette intervention
    const { data: intData } = await supabase
      .from("interventions")
      .select("prestataire_id")
      .eq("id", id)
      .single();

    if (!intData?.prestataire_id) {
        alert("Impossible de trouver le prestataire");
        setLoading(false);
        return;
    }

    const success = await creerAvis({
      intervention_id: id,
      client_id: profile.id,
      prestataire_id: intData.prestataire_id,
      note_globale: noteGlobale,
      note_competence: competence,
      note_ponctualite: ponctualite,
      note_tarif: tarif,
      commentaire: commentaire || undefined,
    });

    if (success) {
        // Mise à jour de la note moyenne du prestataire (logique simplifiée)
        const { data: prest } = await supabase
            .from("prestataires")
            .select("note_moyenne, nombre_avis")
            .eq("id", intData.prestataire_id)
            .single();

        if (prest) {
            const newCount = (prest.nombre_avis || 0) + 1;
            const newNote = ((prest.note_moyenne || 0) * (prest.nombre_avis || 0) + noteGlobale) / newCount;

            await supabase
                .from("prestataires")
                .update({
                    note_moyenne: newNote,
                    nombre_avis: newCount
                })
                .eq("id", intData.prestataire_id);
        }
        setSubmitted(true);
    } else {
        alert("Erreur lors de l'envoi de l'avis");
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#0F0F0E] px-6 text-center">
        <div className="flex flex-col items-center animate-fade-in">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#FFFF00] shadow-[0_0_40px_rgba(255,255,0,0.3)]">
            <CheckCircle2 className="h-14 w-14 text-black" strokeWidth={3} />
          </div>
          <h2 className="mt-8 text-3xl font-black text-white">Merci pour votre avis !</h2>
          <p className="mt-4 text-sm font-bold uppercase tracking-widest text-zinc-500">
            Votre évaluation a été enregistrée
          </p>

          <div className="mt-10 w-full rounded-3xl bg-[#1C1C1A] p-6 border border-[#2D2D2A]">
             <div className="flex items-center justify-between py-2">
                <span className="text-xs font-bold uppercase text-zinc-500">Note globale</span>
                <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-[#FFFF00] text-[#FFFF00]" />
                    <span className="text-sm font-black text-[#FFFF00]">{noteGlobale}/5</span>
                </div>
             </div>
             <p className="mt-2 text-xs text-zinc-400 italic">"{commentaire || "Aucun commentaire"}"</p>
          </div>

          <button onClick={() => navigate("/mes-demandes")}
            className="mt-10 w-full rounded-2xl bg-[#FFFF00] py-4 text-sm font-black uppercase tracking-widest text-black transition-all active:scale-[0.98]">
            RETOUR À MES DEMANDES
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
