import { useState, useEffect, useCallback, useRef } from "react";
import "./App.css";

// audio
import Q from "./assets/audio/Heater-1.mp3";
import W from "./assets/audio/Heater-2.mp3";
import E from "./assets/audio/Heater-3.mp3";
import A from "./assets/audio/Heater-4_1.mp3";
import S from "./assets/audio/Heater-6.mp3";
import D from "./assets/audio/Dsc_Oh.mp3";
import Z from "./assets/audio/Kick_n_Hat.mp3";
import X from "./assets/audio/RP4_KICK_1.mp3";
import C from "./assets/audio/Cev_H2.mp3";

const audioClips = {
  Q: Q,
  W: W,
  E: E,
  A: A,
  S: S,
  D: D,
  Z: Z,
  X: X,
  C: C,
};

const displayNames = {
  Q: "Heater 1",
  W: "Heater 2",
  E: "Heater 3",
  A: "Heater 4",
  S: "Clap",
  D: "Open HH",
  Z: "Kick n' Hat",
  X: "Kick",
  C: "Closed HH",
};

const drumPads = ["Q", "W", "E", "A", "S", "D", "Z", "X", "C"];

function App() {
  const [display, setDisplay] = useState("");
  const audioRefs = useRef({});

  const [power, setPower] = useState(true);
  const [volume, setVolume] = useState(0.5);

  const playSound = useCallback(
    (audioId) => {
      if (!power) return;

      const audio = audioRefs.current[audioId];
      if (audio) {
        audio.volume = volume;
        audio.currentTime = 0; // rewind to start
        audio.play();
      }
    },
    [power, volume]
  );

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!power) {
        setDisplay("");
        return;
      }

      const key = event.key.toUpperCase();
      if (drumPads.includes(key)) {
        setDisplay(displayNames[key]);
        playSound(key);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [playSound, power]);

  return (
    <div
      id="drum-machine"
      className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white"
    >
      <div id="display" className="text-2xl mb-4">
        {display}
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        {drumPads.map((drumPad, index) => (
          <button
            key={index}
            id={drumPad}
            className="drum-pad bg-blue-500 p-4 rounded shadow-lg text-xl font-semibold"
            onClick={() => {
              if (power) {
                setDisplay(displayNames[drumPad]);
                playSound(drumPad);
              } else {
                setDisplay("");
              }
            }}
          >
            {drumPad}
            <audio
              ref={(el) => {
                audioRefs.current[drumPad] = el;
              }}
              id={drumPad}
              className="clip"
              src={audioClips[drumPad]}
            ></audio>
          </button>
        ))}
      </div>
      <div className="flex space-x-4">
        <button
          className={`p-4 rounded shadow-lg ${
            power ? "bg-green-500" : "bg-red-500"
          }`}
          onClick={() => setPower(!power)}
        >
          Power
        </button>
        <input
          type="range"
          className="slider"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
      </div>
    </div>
  );
}

export default App;
