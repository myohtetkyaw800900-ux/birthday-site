import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import heroImage from "./assets/hero.png";
import AudioToggle from "./components/AudioToggle.jsx";
import Gallery from "./components/Gallery.jsx";
import Guestbook from "./components/Guestbook.jsx";
import FloatingDecor from "./components/FloatingDecor.jsx";
import "./App.css";

const galleryModules = import.meta.glob("./assets/gallery/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
});

const galleryEntries = Object.entries(galleryModules).sort(([a], [b]) => a.localeCompare(b));
const galleryImages = galleryEntries.map(([, value]) => value);
const image01 =
  galleryEntries.find(([path]) => /\/01\.(png|jpe?g|webp)$/i.test(path))?.[1] ?? null;

const preferredHeroImage = image01 ?? galleryImages[0] ?? heroImage;

const memories = [
  {
    title: "Sweet energy",
    text: "The kind of smile that makes the whole day feel lighter.",
  },
  {
    title: "Soft moments",
    text: "The little memories that stay warm in my head for a long time.",
  },
  {
    title: "Birthday magic",
    text: "A day that deserves extra joy, extra love, and extra sparkle.",
  },
  {
    title: "Always special",
    text: "You have a way of making ordinary moments feel beautiful.",
  },
];

const slides = [
  {
    eyebrow: "Happy Birthday",
    title: "May ❤️",
    text: "I made this little page just for you, with a few sweet things I wanted to say.",
    button: "Open",
  },
  {
    eyebrow: "For you",
    title: "You are special",
    text: "You bring a calm, bright feeling that is hard to explain and impossible to ignore.",
    button: "Next",
  },
  {
    eyebrow: "Good memories",
    title: "The moments I keep",
    text: "Some memories stay because they are full of light, comfort, and your smile.",
    button: "Continue",
  },
  {
    eyebrow: "Little gallery",
    title: "Photo moments",
    text: "A few snapshots I’d keep in my pocket forever.",
    button: "Next",
  },
  {
    eyebrow: "Wish wall",
    title: "Leave a wish",
    text: "Write something sweet — it will stay on this device like a tiny time capsule.",
    button: "Next",
  },
  {
    eyebrow: "One message",
    title: "What I want you to know",
    text: "You make ordinary days feel softer and happier. I hope this birthday gives that feeling back to you.",
    button: "One more thing",
  },
];

const CONFETTI_DURATION_MS = 5000;

export default function App() {
  const [step, setStep] = useState(0);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiTimeoutRef = useRef(null);

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    if (!showConfetti) return undefined;

    if (confettiTimeoutRef.current) {
      window.clearTimeout(confettiTimeoutRef.current);
    }

    confettiTimeoutRef.current = window.setTimeout(() => {
      setShowConfetti(false);
      confettiTimeoutRef.current = null;
    }, CONFETTI_DURATION_MS);

    return () => {
      if (confettiTimeoutRef.current) {
        window.clearTimeout(confettiTimeoutRef.current);
        confettiTimeoutRef.current = null;
      }
    };
  }, [showConfetti]);

  const next = () => {
    const nextStep = Math.min(step + 1, slides.length);
    if (nextStep === slides.length && step !== slides.length) {
      setShowConfetti(true);
    }
    setStep(nextStep);
  };

  const currentSlide = slides[step];
  const showFinale = step === slides.length;
  const compactVisualPanel = !showFinale && step >= 3;
  const showInlineImage = !showFinale && (step === 4 || step === 5);

  return (
    <main className="page-shell">
      <div className="page-glow page-glow-left" />
      <div className="page-glow page-glow-right" />
      <FloatingDecor />

      <section className="birthday-card">
        <div className="top-actions">
          <AudioToggle />
        </div>
        {!showFinale ? (
          <motion.div
            key={step}
            className="content-grid"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <div className={compactVisualPanel ? "visual-panel compact" : "visual-panel"}>
              <div className="photo-frame">
                <img className="hero-photo" src={preferredHeroImage} alt="Birthday photo" />
              </div>
              <div className="visual-badge">Birthday note</div>
            </div>

            <div className="copy-panel">
              <div className="step-indicator">
                {slides.map((slide, index) => (
                  <span
                    key={slide.title}
                    className={index === step ? "indicator-dot active" : "indicator-dot"}
                  />
                ))}
              </div>

              <p className="eyebrow">{currentSlide.eyebrow}</p>
              <h1 className="headline">{currentSlide.title}</h1>
              <p className="message">{currentSlide.text}</p>

              {showInlineImage && (
                <div className="inline-photo-card">
                  <div
                    className="inline-photo-backdrop"
                    aria-hidden="true"
                    style={{ backgroundImage: `url(${preferredHeroImage})` }}
                  />
                  <img className="inline-photo-image" src={preferredHeroImage} alt="Photo" />
                </div>
              )}

              {step === 2 && (
                <div className="memory-grid">
                  {memories.map((memory) => (
                    <article key={memory.title} className="memory-card">
                      <h2>{memory.title}</h2>
                      <p>{memory.text}</p>
                    </article>
                  ))}
                </div>
              )}

              {step === 3 && <Gallery fallbackImage={heroImage} />}
              {step === 4 && <Guestbook />}

              <button className="primary-button" onClick={next}>
                {currentSlide.button}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="finale"
            className="finale"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            {showConfetti && (
              <Confetti
                width={viewport.width}
                height={viewport.height}
                numberOfPieces={viewport.width < 640 ? 90 : 140}
                recycle
              />
            )}

            <img className="finale-photo" src={preferredHeroImage} alt="Birthday photo" />
            <h1 className="headline">I miss you</h1>
            <p className="message">
              Happy Birthday. I hope today feels gentle, beautiful, and full of reasons to smile.
            </p>
            <button
              className="secondary-button"
              onClick={() => {
                setShowConfetti(false);
                if (confettiTimeoutRef.current) {
                  window.clearTimeout(confettiTimeoutRef.current);
                  confettiTimeoutRef.current = null;
                }
                setStep(0);
              }}
            >
              Replay
            </button>
          </motion.div>
        )}
      </section>
    </main>
  );
}
