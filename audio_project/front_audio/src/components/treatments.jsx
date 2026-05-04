import { useRef, useState } from "react";

import "../styles/treatments.css";
import { OPERATIONS } from "../data/operations";
import useAudioApi from "../hooks/useAudioApi";

import Navbar              from "./navbar";
import Footer              from "./footer";
import { IconUpload, IconFile, IconCheck, IconX } from "./icons";
import TranscriptionModal  from "./transcriptionModal";
import CompressionModal    from "./compresionModal";
import ConversionModal     from "./conversionModal";
import CleanModal          from "./cleanModal";
import InfoModal           from "./infoModal";
import MetricsModal        from "./metricsModal";

/* ── Waveform decoration ── */
const WAVE_BARS = Array.from({ length: 32 }, (_, i) => ({
  delay:    `${(i * 0.07).toFixed(2)}s`,
  duration: `${(0.8 + Math.random() * 0.8).toFixed(2)}s`,
  height:   `${Math.floor(Math.random() * 60 + 20)}%`,
}));

/* ── LoadingOverlay ── */
const LoadingOverlay = ({ opTitle }) => (
  <div className="ma-overlay">
    <div className="ma-spinner" />
    <div className="ma-overlay-text">
      Processing {opTitle?.toLowerCase()}…
    </div>
  </div>
);

/* ── OperationCard ── */
const OperationCard = ({ op, selected, onSelect }) => (
  <div
    className={`ma-op-card${selected ? " selected" : ""}`}
    style={{ "--card-accent": op.accent }}
    onClick={() => onSelect(op.id)}
  >
    <div className="ma-op-check"><IconCheck /></div>
    <div className="ma-op-icon">{op.icon}</div>
    <div className="ma-op-body">
      <div className="ma-op-title">{op.title}</div>
      <div className="ma-op-desc">{op.desc}</div>
      {op.badge && <div className="ma-op-badge">{op.badge}</div>}
    </div>
  </div>
);

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
const Treatments = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedOp,   setSelectedOp]   = useState(null);
  const [drag,         setDrag]         = useState(false);
  const fileInputRef = useRef(null);

  // Résultats des modals
  const [results, setResults] = useState({
    transcription: null,
    compressed:    null,
    converted:     null,
    cleaned:       null,
    info:          null,
    metrics:       null,
  });

  // Quel modal est ouvert
  const [openModal, setOpenModal] = useState(null);

  const { loading, call } = useAudioApi();

  /* ── Helpers ── */
  const baseName = selectedFile
    ? selectedFile.name.replace(/\.[^.]+$/, "")
    : "audio";

  const reset = () => {
    setSelectedFile(null);
    setSelectedOp(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (file) => {
    if (file) setSelectedFile(file);
  };

  /* ── Submit ── */
  const handleSubmit = async () => {
    if (!selectedFile) return alert("Please select an audio file.");
    if (!selectedOp)   return alert("Please select an operation.");

    try {
      const result = await call(selectedOp, selectedFile);

      const keyMap = {
        transcription: "transcription",
        compression:   "compressed",
        conversion:    "converted",
        clean:         "cleaned",
        info:          "info",
        metrics:       "metrics",
      };

      setResults((prev) => ({ ...prev, [keyMap[selectedOp]]: result }));
      setOpenModal(selectedOp);
    } catch {
      alert(`Error during ${selectedOp}. Please try again.`);
    }
  };

  const closeModal = () => setOpenModal(null);

  const activeOp = OPERATIONS.find((o) => o.id === selectedOp);

  return (
    <>
      <Navbar />

      <div className="ma-page">
        {/* ── Hero ── */}
        <div className="ma-hero">
          <div className="ma-hero-tag">
            <span className="ma-hero-tag-dot" />
            AI-Powered Audio Processing
          </div>
          <h1>
            Transform your audio<br />
            <span className="grad">with intelligence</span>
          </h1>
          <p>
            Transcribe, compress, convert and clean audio files using
            advanced AI — all in one streamlined workflow.
          </p>
          <div className="ma-wave">
            {WAVE_BARS.map((b, i) => (
              <div
                key={i}
                className="ma-wave-bar"
                style={{
                  height:            b.height,
                  animationDelay:    b.delay,
                  animationDuration: b.duration,
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Main ── */}
        <main className="ma-main">

          {/* Upload zone */}
          <div
            className={`ma-upload-zone${drag ? " drag" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); handleFileChange(e.dataTransfer.files[0]); }}
            onClick={() => fileInputRef.current?.click()}
          >
            {!selectedFile ? (
              <>
                <div className="ma-upload-icon"><IconUpload /></div>
                <h3>Drop your audio file here</h3>
                <p>Supports WAV · MP3 · OGG · FLAC — or click to browse</p>
              </>
            ) : (
              <>
                <div className="ma-upload-icon">🎵</div>
                <h3>File ready</h3>
                <p>Click to replace or drag a new file</p>
                <div className="ma-file-badge">
                  <IconFile />
                  {selectedFile.name}
                  &nbsp;·&nbsp;
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </>
            )}
           <input
  ref={fileInputRef}
  type="file"
  accept=".wav,.mp3,.ogg,.flac"
  style={{ display: "none" }}
  onChange={(e) => handleFileChange(e.target.files[0])}
/>
          </div>

          {/* Operations */}
          <div className="ma-ops-label">Choose an operation</div>
          <div className="ma-grid">
            {OPERATIONS.map((op) => (
              <OperationCard
                key={op.id}
                op={op}
                selected={selectedOp === op.id}
                onSelect={setSelectedOp}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="ma-actions">
            <button className="ma-btn ma-btn-ghost" onClick={reset}>
              <IconX /> Clear
            </button>
            <button
              className="ma-btn ma-btn-primary"
              disabled={!selectedFile || !selectedOp}
              onClick={handleSubmit}
            >
              {activeOp ? `Run ${activeOp.title}` : "Select a file & operation"}
              <span style={{ opacity: 0.7 }}>→</span>
            </button>
          </div>
        </main>

        
      </div>

      {/* ── Loading overlay ── */}
      {loading && <LoadingOverlay opTitle={activeOp?.title} />}

      {/* ── Modals ── */}
      {openModal === "transcription" && results.transcription !== null && (
        <TranscriptionModal transcription={results.transcription} onClose={closeModal} />
      )}
      {openModal === "compression" && results.compressed && (
        <CompressionModal url={results.compressed} baseName={baseName} onClose={closeModal} />
      )}
      {openModal === "conversion" && results.converted && (
        <ConversionModal url={results.converted} baseName={baseName} onClose={closeModal} />
      )}
      {openModal === "clean" && results.cleaned && (
        <CleanModal url={results.cleaned} baseName={baseName} onClose={closeModal} />
      )}
      {openModal === "info" && results.info && (
        <InfoModal data={results.info} onClose={closeModal} />
      )}
      {openModal === "metrics" && results.metrics && (
        <MetricsModal metrics={results.metrics} onClose={closeModal} />
      )}
    </>
  );
};

export default Treatments;