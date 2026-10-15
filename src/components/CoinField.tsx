"use client";

import { useState } from "react";
import PixelArt from "./PixelArt";

const COINS = [
  { left: "50%", top: "24%" },
  { left: "55%", top: "17%" },
  { left: "60%", top: "13%" },
  { left: "65%", top: "17%" },
  { left: "70%", top: "24%" },
];

/** A small easter egg: collectable coins floating in the hero sky. */
export default function CoinField() {
  const [collected, setCollected] = useState<number[]>([]);
  const score = collected.length * 100;

  return (
    <>
      <div className="hud" aria-live="polite">
        <span>SCORE</span>
        <strong>{String(score).padStart(6, "0")}</strong>
        <PixelArt name="coin" scale={2} />
        <span>×{String(collected.length).padStart(2, "0")}</span>
      </div>
      {COINS.map((pos, i) =>
        collected.includes(i) ? (
          <span key={i} className="coin-pop" style={pos} aria-hidden>
            +100
          </span>
        ) : (
          <button
            key={i}
            className="coin"
            style={{ ...pos, animationDelay: `${i * 0.18}s` }}
            onClick={() => setCollected((c) => [...c, i])}
            aria-label="Collect coin"
          >
            <PixelArt name="coin" scale={4} />
          </button>
        )
      )}
    </>
  );
}
