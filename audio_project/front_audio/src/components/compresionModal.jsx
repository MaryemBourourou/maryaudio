import Modal from "./Modal";
import DownloadCard from "./DownloadCard";

/**
 * CompressionModal — affiche le fichier audio compressé prêt au téléchargement
 *
 * Props:
 *  url      : string (object URL du blob)
 *  baseName : string (nom de base du fichier original sans extension)
 *  onClose  : () => void
 */
const CompressionModal = ({ url, baseName, onClose }) => (
  <Modal
    onClose={onClose}
    icon="📦"
    title="Compression Complete"
    subtitle="16kHz · Mono · WAV"
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
    <DownloadCard
      url={url}
      filename={`${baseName}_compressed.wav`}
      label="Compressed audio · WAV format"
    />
  </Modal>
);

export default CompressionModal;