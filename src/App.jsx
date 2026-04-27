import { useState } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

export default function App() {
  const [step, setStep] = useState(0);
  const [playMusic, setPlayMusic] = useState(false);

  const next = () => setStep(step + 1);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-center px-6">

      {playMusic && (
        <audio autoPlay loop>
          <source src="/music.mp3" type="audio/mpeg" />
        </audio>
      )}

      {step === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-4xl font-bold mb-6">
            Happy Birthday 💖
          </h1>
          <p className="mb-6">I made something special for you...</p>
          <button
            onClick={() => {
              setPlayMusic(true);
              next();
            }}
            className="bg-white text-pink-500 px-6 py-2 rounded-full"
          >
            Open 💌
          </button>
        </motion.div>
      )}

      {step === 1 && (
        <motion.div initial={{ x: 200, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <h2 className="text-3xl mb-4">You are special ✨</h2>
          <p className="mb-6">
            From the moment I met you, everything felt different...
          </p>
          <button onClick={next} className="bg-white text-pink-500 px-6 py-2 rounded-full">
            Next ➡️
          </button>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <h2 className="text-3xl mb-4">Memories 📸</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <img src="/img1.jpg" className="rounded-xl" />
            <img src="/img2.jpg" className="rounded-xl" />
            <img src="/img3.jpg" className="rounded-xl" />
            <img src="/img4.jpg" className="rounded-xl" />
          </div>
          <button onClick={next} className="bg-white text-pink-500 px-6 py-2 rounded-full">
            Continue 💕
          </button>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-3xl mb-4">My Message 💌</h2>
          <p className="mb-6">
            You make every day brighter just by being in it.
            I hope this small surprise makes you smile 😊
          </p>
          <button onClick={next} className="bg-white text-pink-500 px-6 py-2 rounded-full">
            One more thing...
          </button>
        </motion.div>
      )}

      {step === 4 && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <Confetti />
          <h1 className="text-4xl font-bold mb-4">
            I like you ❤️
          </h1>
          <p>Happy Birthday 🎂</p>
        </motion.div>
      )}

    </div>
  );
}