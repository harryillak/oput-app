"use client";

import { useRef, useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(stream);

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");

        setText("Saadan heli kõnetuvastusse...");

        const response = await fetch("/api/transcribe", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (data.text) {
          setText(data.text);
        } else {
          setText("Teksti ei õnnestunud tuvastada.");
        }
      };

      mediaRecorder.start();

      mediaRecorderRef.current = mediaRecorder;

      setIsRecording(true);
      setText("Salvestan...");
    } catch (error) {
      console.error(error);
      setText("Mikrofoni kasutamine ei õnnestunud.");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
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
        onClick={isRecording ? stopRecording : startRecording}
        className="bg-blue-600 text-white px-8 py-5 rounded-full text-3xl shadow-lg hover:bg-blue-700 transition"
      >
        {isRecording ? "⏹️" : "🎤"}
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