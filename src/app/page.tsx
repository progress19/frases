"use client";

import { useState, useEffect, useRef } from "react";
import "animate.css/animate.min.css";

export default function Home() {
  const [frase, setFrase] = useState("");
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null); // Asegúrate de especificar el tipo

  const fetchFrase = async () => {
    try {
      const response = await fetch("http://localhost/frases/public/frase-aleatoria");
      const data = await response.json();
      setIsFadingOut(true);
      setTimeout(() => {
        setFrase(data.frase);
        setIsFadingOut(false);
        setAnimationKey(prevKey => prevKey + 1);
      }, 500);
    } catch (error) {
      console.error("Error al obtener la frase:", error);
    }
  };

  useEffect(() => {
    fetchFrase();
    const interval = setInterval(fetchFrase, 10000);
    return () => clearInterval(interval);
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white p-4 font-poppins relative">
      <div className="max-w-screen-lg w-full px-4">
        <h1
          key={animationKey}
          className={`text-2xl md:text-3xl lg:text-5xl font-bold leading-10 md:leading-[1.5] lg:leading-[1.6] text-slate-300
            ${isFadingOut ? "animate__animated animate__fadeOut" : "animate__animated animate__fadeIn"} animate__delay-1s`}
        >
          {frase}
        </h1>
      </div>

      <audio ref={audioRef} src="/path/to/your/instrumental-music.mp3" loop />
      
      <button
        onClick={toggleMusic}
        className="absolute bottom-4 right-4 p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 focus:outline-none"
      >
        <i className={`fas ${isPlaying ? "fa-volume-up" : "fa-volume-mute"} text-2xl`} />
      </button>
    </div>
  );
}
