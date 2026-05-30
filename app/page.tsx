"use client";

import Image from "next/image";
import { useState } from "react";

type AppPhase = "start" | "lesson" | "review";
type NoteType = "comment" | "task";

const BRAND = {
  blue: "#2D5085",
  orange: "#FF7D35",
  lightBlue: "#EEF4FC",
  lightOrange: "#FFF2EA",
};

const sampleNotes = [
  "Täna oli toon vabam ja kandvam.",
  "F-duur heliredel vajab aeglast harjutamist.",
  "Fraasi alguses tuleb hingata rahulikumalt.",
];

export default function Home() {
  const [phase, setPhase] = useState<AppPhase>("start");
  const [confirmed, setConfirmed] = useState(false);
  const [selectedNoteType, setSelectedNoteType] = useState<NoteType>("comment");

  const feedbackText =
    "Täna oli toon vabam ja kandvam. F-duur heliredelit tuleb harjutada aeglaselt, pöörates tähelepanu sõrmestuse ette mõtlemisele. Fraasi alguses aitab rahulikum hingamine hoida mängu stabiilsena ja muusikaliselt selgemana.";

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 py-8">
        <header className="flex justify-center pt-4">
          <Image
            src="/brand/opetaja-utles-logo.png"
            alt="Õpetaja ütles logo"
            width={260}
            height={260}
            priority
            className="h-auto w-56"
          />
        </header>

        {phase === "start" && (
          <section className="flex flex-1 flex-col items-center justify-center text-center">
            <p className="mt-6 text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
              Häälmärkmetest kirjalik tagasiside
            </p>

            <h1
              className="mt-4 text-3xl font-bold tracking-tight"
              style={{ color: BRAND.blue }}
            >
              Õpetaja ütles
            </h1>

            <p className="mt-4 max-w-sm text-base leading-7 text-slate-600">
              Töövahend õpetajale, kes soovib tunni jooksul öeldud tähelepanekud
              muuta toimetatud kirjalikuks tagasisideks.
            </p>

            <button
              type="button"
              onClick={() => setPhase("lesson")}
              className="mt-8 w-full rounded-2xl px-6 py-4 text-base font-semibold text-white shadow-lg transition active:scale-[0.98]"
              style={{ backgroundColor: BRAND.blue }}
            >
              Alusta tunni märkmete kogumist
            </button>

            <div className="mt-8 grid w-full gap-3 text-left">
              <FeatureRow
                color={BRAND.blue}
                background={BRAND.lightBlue}
                title="Õpetaja räägib"
                text="Tunni jooksul kogud lühikesi häälemärkmeid."
              />
              <FeatureRow
                color={BRAND.orange}
                background={BRAND.lightOrange}
                title="Rakendus vormistab"
                text="Märkmetest tekib kirjaliku tagasisideteksti ülevaatamist vajav versioon."
              />
              <FeatureRow
                color={BRAND.blue}
                background={BRAND.lightBlue}
                title="Õpetaja kinnitab"
                text="Lõplik tekst muutub kopeeritavaks alles pärast ülevaatamist."
              />
            </div>
          </section>
        )}

        {phase === "lesson" && (
          <section className="flex flex-1 flex-col">
            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Käimasolev tund</p>
              <h2
                className="mt-1 text-2xl font-bold"
                style={{ color: BRAND.blue }}
              >
                Jasper Poll
              </h2>
              <p className="mt-1 text-sm text-slate-600">Altsarv · 1. klass</p>
            </div>

            <div className="mt-8 rounded-3xl bg-slate-50 p-4">
              <p className="text-center text-sm font-semibold text-slate-700">
                Mida salvestada?
              </p>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <NoteTypeButton
                  label="Kommentaar"
                  active={selectedNoteType === "comment"}
                  onClick={() => setSelectedNoteType("comment")}
                />
                <NoteTypeButton
                  label="Ülesanne"
                  active={selectedNoteType === "task"}
                  onClick={() => setSelectedNoteType("task")}
                />
              </div>
            </div>

            <button
              type="button"
              className="mx-auto mt-8 flex h-32 w-32 items-center justify-center rounded-full text-xl font-bold text-white shadow-xl transition active:scale-[0.97]"
              style={{ backgroundColor: BRAND.orange }}
            >
              Salvestan
            </button>

            <p className="mt-4 text-center text-sm text-slate-500">
              Lisa eraldi lühikesi tähelepanekuid millest koostame koondi.
            </p>

            <div className="mt-8 space-y-3">
              {sampleNotes.map((note, index) => (
                <div
                  key={note}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700"
                >
                  <span
                    className="mr-2 font-semibold"
                    style={{ color: BRAND.blue }}
                  >
                    {index + 1}.
                  </span>
                  {note}
                </div>
              ))}
            </div>

            <div className="mt-auto pt-8">
              <button
                type="button"
                onClick={() => setPhase("review")}
                className="w-full rounded-2xl px-6 py-4 text-base font-semibold text-white shadow-lg transition active:scale-[0.98]"
                style={{ backgroundColor: BRAND.blue }}
              >
                Koosta tagasiside
              </button>
            </div>
          </section>
        )}

        {phase === "review" && (
          <section className="flex flex-1 flex-col">
            <div className="mt-6">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                Ülevaatus
              </p>
              <h2
                className="mt-3 text-2xl font-bold"
                style={{ color: BRAND.blue }}
              >
                Tagasiside enne kinnitamist
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Tekst ei ole veel lõplik. Loe see üle, paranda vajadusel ja 
               alles siis kinnita.
              </p>
            </div>

            <textarea
              defaultValue={feedbackText}
              className="mt-6 min-h-56 w-full resize-none rounded-3xl border border-slate-200 bg-white p-5 text-base leading-7 text-slate-800 shadow-sm outline-none focus:border-[#2D5085]"
            />

            <label className="mt-5 flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(event) => setConfirmed(event.target.checked)}
                className="mt-1 h-5 w-5"
              />
              <span>
                Tagasiside on üle vaadatud ja kinnitan, et see on sobiv minu
                tekstina kasutamiseks.
              </span>
            </label>

            <div className="mt-auto grid gap-3 pt-8">
              <button
                type="button"
                disabled={!confirmed}
                className="w-full rounded-2xl px-6 py-4 text-base font-semibold text-white shadow-lg transition enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                style={confirmed ? { backgroundColor: BRAND.blue } : undefined}
              >
                Kopeeri tagasiside
              </button>
<p className="text-center text-xs leading-5 text-slate-500">
  Tekst kopeeritakse lõikelauale. Seejärel saad selle kleepida e-päevikusse või mujale.
</p>
              <button
                type="button"
                onClick={() => {
                  setConfirmed(false);
                  setPhase("lesson");
                }}
                className="w-full rounded-2xl border border-slate-200 px-6 py-4 text-base font-semibold text-slate-700 transition active:scale-[0.98]"
              >
                Tagasi märkmete juurde
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function NoteTypeButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl px-4 py-3 text-sm font-semibold transition active:scale-[0.98]"
      style={{
        backgroundColor: active ? BRAND.blue : "#FFFFFF",
        color: active ? "#FFFFFF" : "#334155",
        border: active ? "1px solid #2D5085" : "1px solid #E2E8F0",
      }}
    >
      {label}
    </button>
  );
}


function FeatureRow({
  color,
  background,
  title,
  text,
}: {
  color: string;
  background: string;
  title: string;
  text: string;
}) {
  return (
    <div
      className="flex gap-4 rounded-2xl p-4"
      style={{ backgroundColor: background }}
    >
      <div
        className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
        style={{ backgroundColor: color }}
      >
        ÕÜ
      </div>
      <div>
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
      </div>
    </div>
  );
}