import { IconDownload } from "./icons";

/**
 * DownloadCard — carte affichant un fichier audio prêt à télécharger
 *
 * Props:
 *  url      : string (object URL)
 *  filename : string
 *  label    : string (description sous le nom)
 */
const DownloadCard = ({ url, filename, label }) => {
  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="ma-download-card">
      <div className="ma-download-icon">🎵</div>
      <div className="ma-download-info">
        <div className="ma-download-name">{filename}</div>
        <div className="ma-download-size">{label}</div>
      </div>
      <button className="ma-btn-download" onClick={handleDownload}>
        <IconDownload /> Download
      </button>
    </div>
  );
};

export default DownloadCard;