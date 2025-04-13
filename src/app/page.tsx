"use client";

import { useState, useEffect, useRef } from "react";
import "animate.css/animate.min.css";

const FADE_DURATION = 1000;
const PHRASE_DURATION = 10000;

export default function Home() {
  const [frase, setFrase] = useState("");
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [fraseType, setFraseType] = useState("todas");
  const [showDropdown, setShowDropdown] = useState(false);

  const fraseTypes = {
    todas: "frase-aleatoria",
    varias: "frase-general",
    budista: "frase-budista",
    estoica: "frase-estoica",
    metafísica: "frase-metafisica"
  };

  // Función para obtener una nueva frase del backend
  const fetchFrase = async (tipo: string) => {
    try {
      const endpoint = fraseTypes[tipo as keyof typeof fraseTypes] || "frase-aleatoria";
      const response = await fetch(`https://frases-backend.mauriciolavilla.net/public/${endpoint}`);
      const data = await response.json();
      return data.frase;
    } catch (error) {
      console.error("Error al obtener la frase:", error);
      return "";
    }
  };

  // Función para actualizar la frase con animación
  const updateFrase = async () => {
    setIsFadingOut(true);
    await new Promise(resolve => setTimeout(resolve, FADE_DURATION)); // Esperar fadeOut

    const nuevaFrase = await fetchFrase(fraseType);
    setFrase(nuevaFrase);
    setIsFadingOut(false);
    setAnimationKey(prevKey => prevKey + 1);
  };

  // Manejo del intervalo de actualización
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current); // Limpiar intervalos previos
    }

    if (!isPaused) {
      updateFrase(); // Actualizar frase de inmediato
      intervalRef.current = setInterval(updateFrase, PHRASE_DURATION);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, fraseType]); // Se ejecuta al cambiar `isPaused` o `fraseType`

  const playClickSound = () => {
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play();
    }
  };

  const fadeAudio = (audioElement: HTMLAudioElement, fadeType: 'in' | 'out') => {
    const fadeInterval = 50;
    const fadeStep = 0.05;
    
    let volume = fadeType === 'in' ? 0 : 1;
    audioElement.volume = volume;
    
    if (fadeType === 'in') {
      audioElement.play();
    }

    const fade = setInterval(() => {
      volume = fadeType === 'in' ? Math.min(1, volume + fadeStep) : Math.max(0, volume - fadeStep);
      audioElement.volume = volume;

      if ((fadeType === 'in' && volume >= 1) || (fadeType === 'out' && volume <= 0)) {
        clearInterval(fade);
        if (fadeType === 'out') audioElement.pause();
      }
    }, fadeInterval);
  };

  const toggleMusic = () => {
    playClickSound();
    if (audioRef.current) {
      isPlaying ? fadeAudio(audioRef.current, 'out') : fadeAudio(audioRef.current, 'in');
      setIsPlaying(!isPlaying);
    }
  };

  const togglePause = () => {
    playClickSound();
    setIsPaused(prev => !prev);
  };

  const handleDropdownClick = () => {
    setShowDropdown(!showDropdown);
  };

  // Cambio de tipo de frase sin desincronizar intervalos
  const handleTypeSelection = async (type: string) => {
    playClickSound();
    setIsPaused(false);
    setFraseType(type);
    setShowDropdown(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white p-4 font-poppins relative">
      <div className="max-w-screen-lg w-full px-4">
        <h1
          key={animationKey}
          className={`text-2xl md:text-3xl lg:text-5xl font-bold leading-10 md:leading-[1.5] lg:leading-[1.6] text-slate-300
            ${isFadingOut ? "animate__animated animate__fadeOut" : "animate__animated animate__fadeIn"} animate__duration-10s`}
        >
          {frase}
        </h1>
      </div>

      <audio ref={audioRef} src="music.mp3" loop />
      <audio ref={clickSoundRef} src="clicky-mouse-click-182496.mp3" />

      <button
        onClick={togglePause}
        className="absolute bottom-4 right-20 w-12 h-12 flex items-center justify-center bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 focus:outline-none"
      >
        <i className={`fas ${isPaused ? "fa-play" : "fa-pause"} text-xl`} />
      </button>

      <button
        onClick={toggleMusic}
        className="absolute bottom-4 right-4 w-12 h-12 flex items-center justify-center bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 focus:outline-none"
      >
        <i className={`fas ${isPlaying ? "fa-volume-up" : "fa-volume-mute"} text-xl`} />
      </button>

      <div className="absolute bottom-4 right-36">
        <div className="relative">
          <button
            onClick={handleDropdownClick}
            onMouseEnter={() => setShowDropdown(true)}
            className="w-12 h-12 flex items-center justify-center bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 focus:outline-none"
          >
            <i className="fas fa-list text-xl" />
          </button>

          {showDropdown && (
            <div className="absolute bottom-14 right-0 bg-gray-800 rounded-lg shadow-xl py-2 min-w-[150px] animate__animated animate__fadeIn"
              onMouseLeave={() => setShowDropdown(false)}
            >
              {Object.entries(fraseTypes).map(([type]) => (
                <button key={type} onClick={() => handleTypeSelection(type)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors ${fraseType === type ? 'bg-gray-700' : ''}`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
