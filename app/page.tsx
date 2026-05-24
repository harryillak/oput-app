"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);

  function startListening() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setText("Sinu brauser ei toeta kõnetuvastust.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "et-EE";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setText("Kuulan...");
    };

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setText(spokenText);
    };

    recognition.onerror = () => {
      setText("Kõnetuvastusel tekkis viga.");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-zinc-50">
      <h1 className="text-5xl font-bold mb-4 text-blue-600">
        ÕPETAJA ÜTLEB
      </h1>

      <p className="text-zinc-600 mb-8">
        Häälmärkmetest kirjalik tagasiside · mobiilitest
      </p>

      <button
        onClick={startListening}
        className="bg-blue-600 text-white px-8 py-5 rounded-full text-3xl shadow-lg hover:bg-blue-700 transition"
      >
        {isListening ? "🎙️" : "🎤"}
      </button>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="mt-8 w-full max-w-xl border border-zinc-300 rounded-xl p-4 bg-white"
        rows={8}
        placeholder="Siia hakkab ilmuma õpetaja räägitud tekst..."
      />
    </main>
  );
}