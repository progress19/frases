'use client';

import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');

  const postTweet = async () => {
    try {
      const response = await fetch('/api/post-tweet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: message }),
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log('Tweet publicado exitosamente:', data);
      } else {
        console.error('Error en la publicación:', data.message);
      }
    } catch (error) {
      console.error('Error al postear el tweet:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escribe tu tweet aquí"
      />
      <button onClick={postTweet}>
        Publicar en X
      </button>
    </div>
  );
}
