import Modal from "./Modal";
import { IconCopy } from "./icons";
import useCopy from "../hooks/useCopy";

/**
 * TranscriptionModal — affiche le résultat de la transcription Whisper
 *
 * Props:
 *  transcription : string
 *  onClose       : () => void
 */
const TranscriptionModal = ({ transcription, onClose }) => {
  const [copied, copy] = useCopy();

  return (
    <Modal
      onClose={onClose}
      icon="🎙️"
      title="Transcription Result"
      subtitle="Whisper AI · Speech-to-text"
      footer={
        <>
          <button className="ma-copy-btn" onClick={() => copy(transcription)}>
            <IconCopy /> {copied ? "Copied!" : "Copy"}
          </button>
          <button
            className="ma-btn ma-btn-ghost"
            style={{ height: 36, fontSize: 13 }}
            onClick={onClose}
          >
            Close
          </button>
        </>
      }
    >
      <div className="ma-transcript-box">{transcription}</div>
    </Modal>
  );
};

export default TranscriptionModal;