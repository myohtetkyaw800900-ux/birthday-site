import { useEffect, useMemo, useRef, useState } from "react";

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
  const frameRef = useRef(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;
    if (!images.length) return undefined;

    const handleResize = () => {
      frame.scrollTo({ left: frame.clientWidth * index });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [images, index]);

  if (!images.length) return null;

  return (
    <section className="gallery">
      <div
        ref={frameRef}
        className="gallery-frame"
        role="region"
        aria-label="Gallery photos"
        onScroll={() => {
          const frame = frameRef.current;
          if (!frame) return;
          const nextIndex = Math.round(frame.scrollLeft / Math.max(1, frame.clientWidth));
          setIndex((current) => (current === nextIndex ? current : nextIndex));
        }}
      >
        {images.map((url, slideIndex) => (
          <div
            key={url}
            className="gallery-slide"
            style={{ "--bg-url": `url(${url})` }}
            aria-label={`Photo ${slideIndex + 1} of ${images.length}`}
          >
            <div className="gallery-backdrop" aria-hidden="true" />
            <img className="gallery-image" src={url} alt={`Gallery photo ${slideIndex + 1}`} />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <div className="gallery-dots" role="tablist" aria-label="Gallery">
          {images.map((_, dotIndex) => (
            <button
              key={`dot-${dotIndex}`}
              type="button"
              className={dotIndex === index ? "gallery-dot active" : "gallery-dot"}
              onClick={() => {
                const frame = frameRef.current;
                if (!frame) return;
                frame.scrollTo({ left: frame.clientWidth * dotIndex, behavior: "smooth" });
                setIndex(dotIndex);
              }}
              aria-label={`Go to photo ${dotIndex + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
