import { useMemo, useState } from "react";
import { motion } from "framer-motion";

function loadGalleryImages() {
  const modules = import.meta.glob("../assets/gallery/*.{png,jpg,jpeg,webp}", {
    eager: true,
    import: "default",
  });

  return Object.entries(modules)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => value);
}

export default function Gallery({ fallbackImage }) {
  const images = useMemo(() => {
    const loaded = loadGalleryImages();
    return loaded.length ? loaded : fallbackImage ? [fallbackImage] : [];
  }, [fallbackImage]);

  const [index, setIndex] = useState(0);

  if (!images.length) return null;

  const goPrev = () => setIndex((current) => (current - 1 + images.length) % images.length);
  const goNext = () => setIndex((current) => (current + 1) % images.length);

  return (
    <section className="gallery">
      <div className="gallery-frame">
        <button className="gallery-nav" type="button" onClick={goPrev} aria-label="Previous photo">
          ‹
        </button>
        <div
          className="gallery-backdrop"
          aria-hidden="true"
          style={{ backgroundImage: `url(${images[index]})` }}
        />
        <motion.img
          key={images[index]}
          className="gallery-image"
          src={images[index]}
          alt="Gallery photo"
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
        <button className="gallery-nav" type="button" onClick={goNext} aria-label="Next photo">
          ›
        </button>
      </div>

      {images.length > 1 && (
        <div className="gallery-dots" role="tablist" aria-label="Gallery">
          {images.map((_, dotIndex) => (
            <button
              key={`dot-${dotIndex}`}
              type="button"
              className={dotIndex === index ? "gallery-dot active" : "gallery-dot"}
              onClick={() => setIndex(dotIndex)}
              aria-label={`Go to photo ${dotIndex + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
