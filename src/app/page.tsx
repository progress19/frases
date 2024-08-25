"use client";

import { useState, useEffect, useRef } from "react";
import "animate.css/animate.min.css";

export default function Home() {
  const [frase, setFrase] = useState("");
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const fetchFrase = async () => {
    try {
      const response = await fetch("http://localhost/frases/public/frase-aleatoria");
      const data = await response.json();
      return data.frase;
    } catch (error) {
      console.error("Error al obtener la frase:", error);
      return "";
    }
  };

  const updateFrase = async () => {
    setIsFadingOut(true);

    // Esperar a que termine el fadeOut
    setTimeout(async () => {
      const nuevaFrase = await fetchFrase();
      setFrase(nuevaFrase);
      setIsFadingOut(false);
      setAnimationKey(prevKey => prevKey + 1);
    }, 1000); // Duración del fadeOut en milisegundos
  };

  useEffect(() => {
    updateFrase();
    const interval = setInterval(updateFrase, 10000); // Cambia cada 10 segundos
    return () => clearInterval(interval);
  }, []);

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white p-4 font-poppins relative">
      <div className="max-w-screen-lg w-full px-4">
        <h1
          key={animationKey}
          className={`text-2xl md:text-3xl lg:text-5xl font-bold leading-10 md:leading-[1.5] lg:leading-[1.6] text-slate-300
            ${isFadingOut ? "animate__animated animate__fadeOut" : "animate__animated animate__fadeIn"} animate__duration-1s`}
        >
          {frase}
        </h1>
      </div>

      <audio ref={audioRef} src="music.mp3" loop />

      <button
        onClick={toggleMusic}
        className="absolute bottom-4 right-4 p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 focus:outline-none"
      >
        <i className={`fas ${isPlaying ? "fa-volume-up" : "fa-volume-mute"} text-2xl`} />
      </button>
    </div>
  );
}
