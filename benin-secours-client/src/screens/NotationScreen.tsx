import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Star, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { creerAvis } from "@/services/supabase_service";
import { supabase } from "@/config/supabase";
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
            <CheckCircle className="h-14 w-14 text-black" strokeWidth={3} />
          </div>
          <h2 className="mt-8 text-3xl font-black text-white">Merci !</h2>
          <p className="mt-4 text-sm font-bold uppercase tracking-widest text-zinc-500">
            Votre avis a été enregistré
          </p>

          <button onClick={() => navigate("/mes-demandes")}
            className="mt-10 w-full rounded-2xl bg-[#FFFF00] py-4 text-sm font-black uppercase tracking-widest text-black transition-all active:scale-[0.98]">
            RETOUR À MES DEMANDES
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[#0F0F0E] text-white">
      <header className="flex items-center justify-between px-6 py-6">
        <button onClick={() => navigate(-1)} className="text-zinc-400">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-black uppercase tracking-tight">Évaluation</h1>
        <button onClick={() => navigate("/")} className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-400">
          <XCircle className="h-6 w-6" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-6">
        <div className="rounded-3xl bg-[#1C1C1A] p-8 border border-[#2D2D2A] shadow-2xl">
          <h2 className="text-center text-xl font-black text-white uppercase tracking-tight">Notez l&apos;intervention</h2>
          <div className="mt-4 flex items-center justify-center gap-2">
            <Star className="h-6 w-6 fill-[#FFFF00] text-[#FFFF00]" />
            <span className="text-3xl font-black text-[#FFFF00]">{noteGlobale > 0 ? noteGlobale : "-"}</span>
            <span className="text-sm font-bold text-zinc-600">/5</span>
          </div>

          <div className="mt-10 space-y-8">
            {[
              { label: "Compétence technique", note: competence, setNote: setCompetence },
              { label: "Ponctualité", note: ponctualite, setNote: setPonctualite },
              { label: "Rapport qualité/prix", note: tarif, setNote: setTarif },
            ].map((critere) => (
              <div key={critere.label}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{critere.label}</span>
                  <span className="text-xs font-black text-[#FFFF00]">{critere.note}/5</span>
                </div>
                <div className="flex justify-center">
                  <EtoilesWidget note={critere.note} onChange={critere.setNote} size="lg" />
                </div>
              </div>
            ))}

            <div className="pt-4">
              <label className="mb-4 block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Commentaire</label>
              <textarea value={commentaire} onChange={(e) => setCommentaire(e.target.value)}
                placeholder="Partagez votre expérience..." rows={4}
                className="w-full resize-none rounded-2xl border border-zinc-800 bg-zinc-900/50 px-5 py-4 text-sm font-medium text-white outline-none focus:border-[#FFFF00]" />
            </div>
          </div>
        </div>
      </main>

      <footer className="shrink-0 p-6 bg-[#0F0F0E] border-t border-zinc-900">
        <button onClick={handleSubmit} disabled={loading || noteGlobale === 0}
          className="w-full rounded-2xl bg-[#FFFF00] py-5 text-sm font-black uppercase tracking-[0.2em] text-black shadow-2xl shadow-[#FFFF00]/20 transition-all active:scale-[0.98] disabled:opacity-50">
          {loading ? "Envoi..." : "Envoyer mon avis"}
        </button>
      </footer>
    </div>
  );
}
