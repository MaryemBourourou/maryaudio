import Modal from "./Modal";
import DownloadCard from "./DownloadCard";

/**
 * ConversionModal — affiche le fichier audio converti en MP3
 *
 * Props:
 *  url      : string (object URL du blob)
 *  baseName : string
 *  onClose  : () => void
 */
const ConversionModal = ({ url, baseName, onClose }) => (
  <Modal
    onClose={onClose}
    icon="🔄"
    title="Conversion Complete"
    subtitle="WAV → MP3"
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
      filename={`${baseName}_converted.mp3`}
      label="Converted audio · MP3 format"
    />
  </Modal>
);

export default ConversionModal;