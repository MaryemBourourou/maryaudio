import Modal from "./Modal";

/**
 * MetricsModal — affiche WER & CER
 *
 * Props:
 *  metrics : { wer: number|null, cer: number|null }
 *  onClose : () => void
 */

const metricClass = (value) => {
  if (value === null) return "";
  const n = parseFloat(value);
  if (n < 0.1) return "good";
  if (n < 0.3) return "warn";
  return "bad";
};

const MetricCard = ({ value, label }) => (
  <div className="ma-metric-card">
    <div className={`ma-metric-value ${metricClass(value)}`}>
      {value !== null ? `${(parseFloat(value) * 100).toFixed(1)}%` : "N/A"}
    </div>
    <div className="ma-metric-label">{label}</div>
  </div>
);

const MetricsModal = ({ metrics, onClose }) => (
  <Modal
    onClose={onClose}
    icon="📊"
    title="Quality Metrics"
    subtitle="Word & Character Error Rate"
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
    <p style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.6, marginBottom: 20 }}>
      Compares system transcription against Whisper reference to measure accuracy.
      Lower is better — green &lt; 10%, amber &lt; 30%, red ≥ 30%.
    </p>
    <div className="ma-metric-row">
      <MetricCard value={metrics.wer} label="Word Error Rate" />
      <MetricCard value={metrics.cer} label="Char Error Rate" />
    </div>
  </Modal>
);

export default MetricsModal;