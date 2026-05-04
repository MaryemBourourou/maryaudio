import { IconWave } from "./icons";

const NAV_LINKS = ["Home", "Treatments", "Create Audio", "About", "Contact"];

const Navbar = () => (
  <nav className="ma-nav">
    <div className="ma-nav-logo">
      <div className="ma-nav-logo-icon">
        <IconWave />
      </div>
      Mary<span className="accent">Audio</span>
    </div>

    <ul className="ma-nav-links">
      {NAV_LINKS.map((label) => (
        <li key={label}>
          <a href="#">{label}</a>
        </li>
      ))}
    </ul>

    <button className="ma-nav-pill">Get started →</button>
  </nav>
);

export default Navbar;