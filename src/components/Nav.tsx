"use client";

import { useEffect, useState } from "react";
import PixelArt from "./PixelArt";

const links = [
  { id: "about", label: "About" },
  { id: "journey", label: "Journey" },
  { id: "skills", label: "Skills" },
  { id: "portfolio", label: "Portfolio" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    links.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="nav__inner">
        <a href="#top" className="nav__brand" onClick={() => setOpen(false)}>
          <PixelArt name="heart" scale={3} />
          <span>JAKE.ABELLA</span>
        </a>

        <button
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "CLOSE" : "MENU"}
        </button>

        <nav id="nav-menu" className={`nav__links ${open ? "nav__links--open" : ""}`}>
          {links.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={active === id ? "is-active" : ""}
              onClick={() => setOpen(false)}
            >
              {active === id && <span className="nav__cursor" aria-hidden>▶</span>}
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
