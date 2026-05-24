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
      model: "whisper-1",
      language: "et",
    });

    return Response.json({
      text: transcription.text,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Kõnetuvastusel tekkis serveris viga." },
      { status: 500 }
    );
  }
}