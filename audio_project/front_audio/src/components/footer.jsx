import { IconWave } from "./icons";

const FOOTER_LINKS = ["About", "Privacy Policy", "Licensing", "Contact"];

const Footer = () => (
  <footer className="ma-footer">
    <div className="ma-footer-logo">
      <IconWave />
      MaryAudio
    </div>

    <ul className="ma-footer-links">
      {FOOTER_LINKS.map((label) => (
        <li key={label}>
          <a href="#">{label}</a>
        </li>
      ))}
    </ul>

    <div>© 2025 MaryAudio</div>
  </footer>
);

export default Footer;