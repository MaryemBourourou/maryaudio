import { useState } from "react";

const API_BASE = "http://localhost:3005/audio";

/**
 * useAudioApi — encapsule tous les appels API audio
 * Retourne { loading, call }
 * call(operation, file) → résultat typé selon l'opération
 */
const useAudioApi = () => {
  const [loading, setLoading] = useState(false);

  const makeForm = (file) => {
    const fd = new FormData();
    fd.append("audio", file);
    return fd;
  };

  const call = async (operation, file) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}?operation=${operation}`, {
        method: "POST",
        body: makeForm(file),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // Opérations qui retournent un blob (fichier audio)
      if (["compression", "conversion", "clean"].includes(operation)) {
        const blob = await res.blob();
        return URL.createObjectURL(blob);
      }

      // Opérations qui retournent du JSON
      const data = await res.json();

      if (operation === "transcription") {
        return data.result?.transcription ?? "No transcription returned.";
      }
      if (operation === "info") {
        return {
          texte_corrige: data.texte_corrige ?? "",
          resume:        data.resume        ?? "",
          sujet:         data.sujet         ?? "",
        };
      }
      if (operation === "metrics") {
        return {
          cer: data.cer ?? null,
          wer: data.wer ?? null,
        };
      }

      return data;
    } catch (err) {
      console.error(`[useAudioApi] ${operation} failed:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, call };
};

export default useAudioApi;