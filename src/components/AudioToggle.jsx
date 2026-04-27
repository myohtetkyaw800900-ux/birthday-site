import { useEffect, useRef, useState } from "react";

export default function AudioToggle() {
  const [enabled, setEnabled] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current.load();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const onVisibility = () => {
      const audio = audioRef.current;
      if (!audio) return;

      if (document.visibilityState === "hidden") {
        audio.pause();
      } else if (enabled) {
        void audio.play().catch(() => {
          setEnabled(false);
        });
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [enabled]);

  const toggle = async () => {
    if (!enabled) {
      try {
        if (!audioRef.current) {
          const audio = new Audio("/music.mp3");
          audio.loop = true;
          audio.preload = "auto";
          audio.volume = 0.35;
          audioRef.current = audio;
        }

        await audioRef.current.play();
        setEnabled(true);
      } catch {
        setEnabled(false);
      }
      return;
    }

    setEnabled(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  return (
    <button className="chip-button" type="button" onClick={toggle}>
      Music: {enabled ? "On" : "Off"}
    </button>
  );
}
