"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");

  function handleMicrophoneClick() {
    setText("TELEFONI TEST TOIMIB");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-zinc-50">
      <h1 className="text-5xl font-bold mb-4 text-blue-600">
        ÕPETAJA ÜTLEB
      </h1>

      <p className="text-zinc-600 mb-8">
        Häälmärkmetest kirjalik tagasiside
      </p>

      <button
  onClick={handleMicrophoneClick}
  onTouchStart={handleMicrophoneClick}
  className="bg-blue-600 text-white px-8 py-5 rounded-full text-3xl shadow-lg hover:bg-blue-700 transition"
>
  🎤
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