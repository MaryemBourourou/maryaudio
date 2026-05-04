import Modal from "./Modal";
import DownloadCard from "./DownloadCard";

/**
 * CleanModal — affiche le fichier audio nettoyé (noise reduction)
 *
 * Props:
 *  url      : string (object URL du blob)
 *  baseName : string
 *  onClose  : () => void
 */
const CleanModal = ({ url, baseName, onClose }) => (
  <Modal
    onClose={onClose}
    icon="✨"
    title="Noise Reduction Complete"
    subtitle="Background noise removed"
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
      filename={`${baseName}_cleaned.wav`}
      label="Cleaned audio · WAV format"
    />
  </Modal>
);

export default CleanModal;