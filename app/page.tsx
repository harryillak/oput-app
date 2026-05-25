"use client";

import { useRef, useState } from "react";

type CommentItem = {
  id: number;
  time: string;
  text: string;
};

export default function Home() {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionFinished, setSessionFinished] = useState(false);

  const [text, setText] = useState("");
  const [comments, setComments] = useState<CommentItem[]>([]);

  const [feedbackDraft, setFeedbackDraft] = useState("");
  const [isFeedbackConfirmed, setIsFeedbackConfirmed] =
    useState(false);

  const [isRecording, setIsRecording] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  function startSession() {
    setSessionStarted(true);
    setSessionFinished(false);

    setComments([]);
    setFeedbackDraft("");
    setIsFeedbackConfirmed(false);

    setText("Tunni märkmete kogumine algas.");
  }

  function finishSession() {
    setSessionFinished(true);
    setSessionStarted(false);

    setText("Tunni märkmete kogumine on lõpetatud.");
  }

  function addComment(commentText: string) {
    const now = new Date();

    const newComment: CommentItem = {
      id: Date.now(),
      time: now.toLocaleTimeString("et-EE", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      text: commentText,
    };

    setComments((current) => [...current, newComment]);

    setText("");
  }

  function updateComment(id: number, newText: string) {
    setComments((current) =>
      current.map((comment) =>
        comment.id === id
          ? { ...comment, text: newText }
          : comment
      )
    );

    setIsFeedbackConfirmed(false);
  }

  async function startRecording() {
    if (!sessionStarted) {
      setText("Alusta enne tunni märkmete kogumist.");
      return;
    }

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
        try {
          const audioBlob = new Blob(
            audioChunksRef.current,
            {
              type: "audio/webm",
            }
          );

          const formData = new FormData();

          formData.append(
            "audio",
            audioBlob,
            "recording.webm"
          );

          setText("Saadan heli kõnetuvastusse...");

          const response = await fetch(
            "/api/transcribe",
            {
              method: "POST",
              body: formData,
            }
          );

          const data = await response.json();

          if (data.text) {
            addComment(data.text);
          } else if (data.error) {
            setText(`Viga: ${data.error}`);
          } else {
            setText(
              "Teksti ei õnnestunud tuvastada."
            );
          }
        } catch (error) {
          console.error(error);

          setText(
            `Võrgu või brauseri viga: ${String(
              error
            )}`
          );
        }
      };

      mediaRecorder.start();

      mediaRecorderRef.current = mediaRecorder;

      setIsRecording(true);

      setText("Salvestan kommentaari...");
    } catch (error) {
      console.error(error);

      setText(
        "Mikrofoni kasutamine ei õnnestunud."
      );
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();

    setIsRecording(false);
  }

  function generateFeedbackDraft() {
    if (comments.length === 0) {
      setText("Kommentaarid puuduvad.");
      return;
    }

    const combinedText = comments
      .map((comment) => comment.text)
      .join(" ");

    setFeedbackDraft(combinedText);

    setIsFeedbackConfirmed(false);

    setText("Tagasiside mustand loodud.");
  }

  function confirmFeedback() {
    setIsFeedbackConfirmed(true);

    setText("Tagasiside kinnitatud.");
  }

  async function copyFeedback() {
    if (!isFeedbackConfirmed) return;

    await navigator.clipboard.writeText(
      feedbackDraft
    );

    setText("Kinnitatud tagasiside kopeeritud.");
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-8 bg-zinc-50">
      <section className="w-full max-w-2xl flex flex-col items-center">
        <h1 className="text-5xl font-bold mb-4 text-blue-600">
          ÕPETAJA ÜTLES
        </h1>

        <p className="text-zinc-600 mb-8">
          Häälmärkmed kirjalikuks tagasisideks
        </p>

        <div className="flex gap-3 mb-6 flex-wrap">
          <button
            onClick={startSession}
            className="bg-zinc-900 text-white px-5 py-3 rounded-xl"
          >
            Alusta tunni märkmeid
          </button>

          <button
            onClick={finishSession}
            disabled={comments.length === 0}
            className="bg-zinc-200 text-zinc-900 px-5 py-3 rounded-xl disabled:opacity-40"
          >
            Lõpeta kogumine
          </button>

          <button
            onClick={generateFeedbackDraft}
            disabled={comments.length === 0}
            className="bg-amber-600 text-white px-5 py-3 rounded-xl disabled:opacity-40"
          >
            Koosta mustand
          </button>
        </div>

        <button
          onClick={
            isRecording
              ? stopRecording
              : startRecording
          }
          className="bg-blue-600 text-white px-8 py-5 rounded-full text-3xl shadow-lg hover:bg-blue-700 transition"
        >
          {isRecording ? "⏹️" : "🎤"}
        </button>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="mt-8 w-full border border-zinc-300 rounded-xl p-4 bg-white text-zinc-900"
          rows={3}
          placeholder="Siia ilmub hetkeseis või veateade..."
        />

        <section className="mt-8 w-full">
          <h2 className="text-xl font-semibold mb-3">
            Tunni kommentaarid
          </h2>

          {comments.length === 0 ? (
            <p className="text-zinc-500">
              Kommentaare ei ole veel lisatud.
            </p>
          ) : (
            <ol className="space-y-3">
              {comments.map((comment, index) => (
                <li
                  key={comment.id}
                  className="bg-white border border-zinc-200 rounded-xl p-4"
                >
                  <div className="text-sm text-zinc-500 mb-2">
                    {index + 1}. kommentaar ·{" "}
                    {comment.time}
                  </div>

                  <textarea
                    value={comment.text}
                    onChange={(e) =>
                      updateComment(
                        comment.id,
                        e.target.value
                      )
                    }
                    className="w-full border border-zinc-200 rounded-lg p-3 text-zinc-900 bg-zinc-50"
                    rows={3}
                  />
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="mt-10 w-full">
          <h2 className="text-xl font-semibold mb-3">
            Tagasiside mustand
          </h2>

          <textarea
            value={feedbackDraft}
            onChange={(e) => {
              setFeedbackDraft(e.target.value);
              setIsFeedbackConfirmed(false);
            }}
            className="w-full border border-zinc-300 rounded-xl p-4 bg-white text-zinc-900"
            rows={8}
            placeholder="Siia ilmub AI koostatud tagasiside mustand..."
          />

          <p className="mt-2 text-sm text-amber-700">
            AI koostatud mustand. Palun loe üle,
            paranda ja kinnita enne kasutamist.
          </p>

          <div className="flex gap-3 mt-4 flex-wrap">
            <button
              onClick={confirmFeedback}
              disabled={!feedbackDraft}
              className="bg-green-700 text-white px-5 py-3 rounded-xl disabled:opacity-40"
            >
              Kinnitan tagasiside
            </button>

            <button
              onClick={copyFeedback}
              disabled={!isFeedbackConfirmed}
              className="bg-blue-600 text-white px-5 py-3 rounded-xl disabled:opacity-40"
            >
              Kopeeri tagasiside
            </button>
          </div>
        </section>

        {sessionFinished && comments.length > 0 && (
          <div className="mt-8 p-4 rounded-xl bg-green-50 border border-green-200 text-green-900 w-full">
            Kogumine lõpetatud. Kommentaare kokku:{" "}
            {comments.length}.
          </div>
        )}
      </section>
    </main>
  );
}