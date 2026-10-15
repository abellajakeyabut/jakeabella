"use client";

import { useEffect, useState } from "react";

/** Types out each line, pauses, deletes it, and moves to the next. */
export default function Typewriter({ lines }: { lines: string[] }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(lines[0]);
      return;
    }
    const full = lines[index % lines.length];
    let delay = deleting ? 22 : 45;
    if (!deleting && text === full) delay = 2200;
    if (deleting && text === "") delay = 300;

    const t = setTimeout(() => {
      if (!deleting && text === full) setDeleting(true);
      else if (deleting && text === "") {
        setDeleting(false);
        setIndex((i) => i + 1);
      } else {
        setText(full.slice(0, text.length + (deleting ? -1 : 1)));
      }
    }, delay);
    return () => clearTimeout(t);
  }, [text, deleting, index, lines]);

  return (
    <span className="typewriter" aria-label={lines[0]}>
      <span aria-hidden>{text}</span>
      <span className="typewriter__caret" aria-hidden />
    </span>
  );
}
