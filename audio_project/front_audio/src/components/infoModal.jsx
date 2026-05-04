import Modal from "./Modal";
import { IconCopy } from "./icons";
import useCopy from "../hooks/useCopy";

/**
 * InfoModal — affiche le résultat de l'extraction AI (sujet, résumé, texte corrigé)
 *
 * Props:
 *  data    : { sujet: string, resume: string, texte_corrige: string }
 *  onClose : () => void
 */
const InfoModal = ({ data, onClose }) => {
  const [copiedResume,  copyResume]  = useCopy();
  const [copiedCorrige, copyCorrige] = useCopy();

  return (
    <Modal
      onClose={onClose}
      icon="🧠"
      title="AI Info Extraction"
      subtitle="Powered by GPT-3.5"
      footer={
        <button
          className="ma-btn ma-btn-ghost"
          style={{ height: 36, fontSize: 13 }}
          onClick={onClose}
        >
          Close
        </button>
      }
    >
      {/* Subject */}
      <div className="ma-info-section">
        <div className="ma-info-label">Subject</div>
        <div className="ma-info-content">
          {data.sujet ? (
            <span className="ma-info-tag">{data.sujet}</span>
          ) : (
            <span style={{ color: "var(--text3)" }}>No subject detected.</span>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="ma-info-section">
        <div
          className="ma-info-label"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <span>Summary</span>
          {data.resume && (
            <button className="ma-copy-btn" onClick={() => copyResume(data.resume)}>
              <IconCopy /> {copiedResume ? "Copied!" : "Copy"}
            </button>
          )}
        </div>
        <div className="ma-info-content">
          {data.resume || (
            <span style={{ color: "var(--text3)" }}>No summary available.</span>
          )}
        </div>
      </div>

      {/* Corrected text */}
      <div className="ma-info-section">
        <div
          className="ma-info-label"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <span>Corrected text</span>
          {data.texte_corrige && (
            <button className="ma-copy-btn" onClick={() => copyCorrige(data.texte_corrige)}>
              <IconCopy /> {copiedCorrige ? "Copied!" : "Copy"}
            </button>
          )}
        </div>
        <div className="ma-info-content">
          {data.texte_corrige || (
            <span style={{ color: "var(--text3)" }}>No text available.</span>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default InfoModal;