import { IconX } from "./icons";

/**
 * Modal — wrapper générique réutilisé par tous les modals résultat
 *
 * Props:
 *  onClose   : () => void
 *  icon      : string (emoji)
 *  title     : string
 *  subtitle  : string (optionnel)
 *  footer    : ReactNode (optionnel)
 *  children  : ReactNode
 */
const Modal = ({ onClose, icon, title, subtitle, children, footer }) => (
  <div
    className="ma-modal-backdrop"
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div className="ma-modal">
      {/* Header */}
      <div className="ma-modal-header">
        <div className="ma-modal-title-row">
          <div className="ma-modal-icon">{icon}</div>
          <div>
            <div className="ma-modal-title">{title}</div>
            {subtitle && <div className="ma-modal-sub">{subtitle}</div>}
          </div>
        </div>
        <button className="ma-modal-close" onClick={onClose}>
          <IconX />
        </button>
      </div>

      {/* Body */}
      <div className="ma-modal-body">{children}</div>

      {/* Footer */}
      {footer && <div className="ma-modal-footer">{footer}</div>}
    </div>
  </div>
);

export default Modal;