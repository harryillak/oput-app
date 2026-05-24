import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audio = formData.get("audio");

    if (!audio || !(audio instanceof File)) {
      return Response.json(
        { error: "Helifail puudub." },
        { status: 400 }
      );
    }

    const transcription = await openai.audio.transcriptions.create({
      file: audio,
      model: "gpt-4o-transcribe",
      language: "et",
      prompt:
        "Tegemist on eesti keeles räägitud muusikaõpetaja tunni tagasisidega. Kasuta korrektset eesti kirjakeelt, loomulikku lausestruktuuri ja sobivaid kirjavahemärke. Tekstis võivad esineda õpilaste nimed, muusikaterminid, taktid, hingamine, toon, rütm, artikulatsioon, dünaamika, fraseerimine ja harjutamisjuhised.",
    });

    return Response.json({
      text: transcription.text,
    });
  } catch (error) {
    console.error(error);

    const errorMessage =
  error instanceof Error ? error.message : "Tundmatu serveriviga.";

return Response.json(
  { error: errorMessage },
  { status: 500 }
);
  }
}