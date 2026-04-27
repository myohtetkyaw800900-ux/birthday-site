import { useMemo } from "react";

const symbols = ["❤", "✦"];

function createPrng(seed) {
  let value = seed;
  return () => {
    value |= 0;
    value = (value + 0x6d2b79f5) | 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function FloatingDecor({ count = 14 }) {
  const items = useMemo(() => {
    const random = createPrng(1337);

    return Array.from({ length: count }, (_, index) => {
      const left = Math.round(random() * 1000) / 10;
      const size = 14 + Math.round(random() * 20);
      const duration = 10 + random() * 10;
      const delay = -random() * duration;
      const drift = (random() * 2 - 1) * 32;
      const opacity = 0.14 + random() * 0.14;
      const blur = random() > 0.65 ? 1.2 : 0;

      return {
        key: `${index}-${left}-${size}`,
        symbol: symbols[index % symbols.length],
        style: {
          left: `${left}%`,
          fontSize: `${size}px`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          "--drift": `${drift}px`,
          "--opacity": opacity,
          filter: blur ? `blur(${blur}px)` : undefined,
        },
      };
    });
  }, [count]);

  return (
    <div className="floating-decor" aria-hidden="true">
      {items.map((item) => (
        <span key={item.key} className="floating-decor-item" style={item.style}>
          {item.symbol}
        </span>
      ))}
    </div>
  );
}
