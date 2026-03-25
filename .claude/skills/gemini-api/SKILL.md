---
name: gemini-api
description: Build applications with the Google Gemini API using the @google/genai TypeScript SDK. Covers text generation, image understanding, structured outputs (JSON schema / Zod), function calling, document processing, audio/video understanding, thinking/reasoning, streaming, multi-turn chat, and long context. Use this skill whenever the user mentions Gemini, Google AI, @google/genai, gemini-3, gemini-2.5, image analysis with Gemini, structured JSON output from Gemini, or any Google generative AI integration — even if they don't say "Gemini API" explicitly. Also trigger when code imports `@google/genai` or `GoogleGenAI`.
---

# Gemini API — TypeScript SDK Reference

This skill covers the `@google/genai` TypeScript/JavaScript SDK for building with Google's Gemini models.

## Setup

```bash
npm install @google/genai
```

```typescript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// Or rely on GEMINI_API_KEY / GOOGLE_API_KEY env var:
// const ai = new GoogleGenAI({});
```

## Models

Use the latest model IDs unless the user specifies otherwise:

| Model | ID | Best for |
|-------|----|----------|
| Gemini 3.1 Pro | `gemini-3.1-pro-preview` | Complex reasoning, agentic tasks |
| Gemini 3 Flash | `gemini-3-flash-preview` | Fast, cost-effective, general purpose |
| Gemini 3.1 Flash-Lite | `gemini-3.1-flash-lite-preview` | Budget workloads |
| Gemini 2.5 Pro | `gemini-2.5-pro` | Advanced reasoning, coding |
| Gemini 2.5 Flash | `gemini-2.5-flash` | High-volume, low-latency |

Default to `gemini-3-flash-preview` unless the task needs deeper reasoning.

---

## 1. Text Generation

### Basic

```typescript
const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: "Explain quantum computing in simple terms",
});
console.log(response.text);
```

### With config

```typescript
const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: "Write a haiku about coding",
  config: {
    systemInstruction: "You are a creative poet.",
    temperature: 1.0,  // Keep at 1.0 for Gemini 3 models
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 1024,
    stopSequences: ["END"],
  },
});
```

### Streaming

```typescript
const response = await ai.models.generateContentStream({
  model: "gemini-3-flash-preview",
  contents: "Explain how AI works",
});

for await (const chunk of response) {
  process.stdout.write(chunk.text);
}
```

### Multi-turn chat

```typescript
const chat = ai.chats.create({
  model: "gemini-3-flash-preview",
  history: [
    { role: "user", parts: [{ text: "Hello" }] },
    { role: "model", parts: [{ text: "Hi! How can I help?" }] },
  ],
});

const response = await chat.sendMessage({ message: "What's 2+2?" });
console.log(response.text);

// Streaming chat
const stream = await chat.sendMessageStream({ message: "Tell me more" });
for await (const chunk of stream) {
  process.stdout.write(chunk.text);
}
```

---

## 2. Image Understanding

Gemini is multimodal from the ground up — it can caption, classify, detect objects, segment, and answer visual questions.

### Inline base64

```typescript
import * as fs from "node:fs";

const base64Image = fs.readFileSync("photo.jpg", { encoding: "base64" });

const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: [
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Image,
      },
    },
    { text: "Describe what you see in this image." },
  ],
});
```

### From URL

```typescript
const imageResponse = await fetch("https://example.com/photo.jpg");
const imageBuffer = await imageResponse.arrayBuffer();
const base64Data = Buffer.from(imageBuffer).toString("base64");

const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: [
    { inlineData: { mimeType: "image/jpeg", data: base64Data } },
    { text: "Caption this image." },
  ],
});
```

### File API (recommended for large/reused images)

```typescript
import { createUserContent, createPartFromUri } from "@google/genai";

const file = await ai.files.upload({
  file: "path/to/image.jpg",
  config: { mimeType: "image/jpeg" },
});

const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: createUserContent([
    createPartFromUri(file.uri, file.mimeType),
    "What's in this image?",
  ]),
});
```

### Multiple images

```typescript
import { createUserContent, createPartFromUri } from "@google/genai";

const file1 = await ai.files.upload({ file: "img1.jpg", config: { mimeType: "image/jpeg" } });
const base64Img2 = fs.readFileSync("img2.png", { encoding: "base64" });

const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: createUserContent([
    "What is different between these two images?",
    createPartFromUri(file1.uri, file1.mimeType),
    { inlineData: { mimeType: "image/png", data: base64Img2 } },
  ]),
});
```

### Object detection

Gemini returns bounding boxes as `[ymin, xmin, ymax, xmax]` normalized to a **0–1000** scale. You must descale based on actual image dimensions.

### Segmentation (Gemini 2.5+)

Returns JSON with `box_2d` ([y0, x0, y1, x1] normalized 0–1000), `label`, and `mask` (base64 PNG). For best results, **disable thinking** by setting budget to 0.

### Supported image formats

`image/png`, `image/jpeg`, `image/webp`, `image/heic`, `image/heif`

### Image tips

- Place text prompt **after** image parts in the contents array
- Use File API for images >20 MB or reused across requests
- Max 3,600 images per request
- Token cost: 258 tokens if both dimensions <=384px; larger images tiled at 768x768

---

## 3. Structured Outputs

Force Gemini to return valid JSON matching a schema. This is essential for programmatic consumption of model outputs.

### With Zod (recommended)

```typescript
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const recipeSchema = z.object({
  recipe_name: z.string(),
  prep_time_minutes: z.number().optional(),
  ingredients: z.array(z.object({
    name: z.string(),
    quantity: z.string(),
  })),
  instructions: z.array(z.string()),
});

const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: "Give me a recipe for banana bread",
  config: {
    responseMimeType: "application/json",
    responseJsonSchema: zodToJsonSchema(recipeSchema),
  },
});

const recipe = JSON.parse(response.text);
```

### With raw JSON schema

```typescript
const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: "List 3 popular programming languages",
  config: {
    responseMimeType: "application/json",
    responseJsonSchema: {
      type: "object",
      properties: {
        languages: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              paradigm: { type: "string" },
              year_created: { type: "integer" },
            },
            required: ["name", "paradigm"],
          },
        },
      },
      required: ["languages"],
    },
  },
});
```

### Enums

```typescript
const schema = z.object({
  sentiment: z.enum(["positive", "negative", "neutral"]),
  confidence: z.number(),
});
```

### Combining structured output with tools (Gemini 3+)

```typescript
const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: "Search the web for today's weather in NYC and return structured data",
  config: {
    tools: [{ googleSearch: {} }],
    responseMimeType: "application/json",
    responseJsonSchema: zodToJsonSchema(weatherSchema),
  },
});
```

### Supported schema types

`string`, `number`, `integer`, `boolean`, `object`, `array`, `null`

Key properties: `enum`, `format` (date-time, date, time), `minimum`/`maximum`, `minItems`/`maxItems`, `required`, `additionalProperties`

### Structured output tips

- Provide clear descriptions for every property so the model knows what to generate
- Use `enum` for constrained values
- Validate output semantically even though the schema is enforced
- Streaming works — chunks concatenate to valid JSON

---

## 4. Function Calling

Let the model invoke your application functions.

### Define and call

```typescript
import { Type } from "@google/genai";

const getWeather = {
  name: "get_weather",
  description: "Gets current weather for a city",
  parameters: {
    type: Type.OBJECT,
    properties: {
      city: { type: Type.STRING, description: "City name" },
      unit: { type: Type.STRING, enum: ["celsius", "fahrenheit"] },
    },
    required: ["city"],
  },
};

const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: "What's the weather in Tokyo?",
  config: {
    tools: [{ functionDeclarations: [getWeather] }],
  },
});

// Check for function call
if (response.functionCalls?.length) {
  const call = response.functionCalls[0];
  console.log(call.name, call.args, call.id);
}
```

### Return function result to model

```typescript
// After executing the function:
const result = { temperature: 22, condition: "sunny" };

const finalResponse = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: [
    { role: "user", parts: [{ text: "What's the weather in Tokyo?" }] },
    response.candidates[0].content,  // model's function call
    {
      role: "user",
      parts: [{
        functionResponse: {
          name: call.name,
          response: { result },
          id: call.id,  // Must match the function call id
        },
      }],
    },
  ],
  config: {
    tools: [{ functionDeclarations: [getWeather] }],
  },
});
```

### Function calling modes

| Mode | Behavior |
|------|----------|
| `AUTO` (default) | Model decides when to call functions |
| `ANY` | Always calls a function (guarantees schema) |
| `NONE` | Disables function calling |

```typescript
config: {
  tools: [{ functionDeclarations: [getWeather] }],
  toolConfig: {
    functionCallingConfig: {
      mode: "ANY",
      allowedFunctionNames: ["get_weather"],
    },
  },
}
```

### Parallel & compositional calling

Gemini 3 can call multiple functions in one turn and chain results across turns automatically. Always include the `id` from the function call in your response.

---

## 5. Document Processing (PDF)

```typescript
// Inline (small PDFs)
const pdfBase64 = Buffer.from(await fetch(url).then(r => r.arrayBuffer())).toString("base64");

const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: [
    { text: "Summarize this document" },
    { inlineData: { mimeType: "application/pdf", data: pdfBase64 } },
  ],
});

// File API (large PDFs, recommended)
const file = await ai.files.upload({
  file: pdfBlob,
  config: { displayName: "report.pdf" },
});

// Poll until processed
let uploaded = await ai.files.get({ name: file.name });
while (uploaded.state === "PROCESSING") {
  await new Promise(r => setTimeout(r, 5000));
  uploaded = await ai.files.get({ name: file.name });
}

const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: [
    "Extract all key findings",
    createPartFromUri(uploaded.uri, uploaded.mimeType),
  ],
});
```

- Max 50 MB, up to 1,000 pages
- ~258 tokens per page
- Only PDFs get meaningful vision processing; other formats lose rendering context

---

## 6. Audio Understanding

```typescript
// Upload audio
const audioFile = await ai.files.upload({
  file: "recording.mp3",
  config: { mimeType: "audio/mp3" },
});

const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: createUserContent([
    createPartFromUri(audioFile.uri, audioFile.mimeType),
    "Transcribe this audio with timestamps",
  ]),
});
```

Supported: `audio/wav`, `audio/mp3`, `audio/aiff`, `audio/aac`, `audio/ogg`, `audio/flac`

- 32 tokens/second, max 9.5 hours
- Use structured output for parsed transcriptions with timestamps and emotion detection

---

## 7. Video Understanding

```typescript
// File API upload
const videoFile = await ai.files.upload({
  file: "video.mp4",
  config: { mimeType: "video/mp4" },
});

const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: createUserContent([
    createPartFromUri(videoFile.uri, videoFile.mimeType),
    "Summarize this video and list key moments with timestamps",
  ]),
});

// YouTube URLs work directly
const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: [
    { fileData: { fileUri: "https://www.youtube.com/watch?v=VIDEO_ID" } },
    { text: "Summarize this video" },
  ],
});
```

### Video clipping

```typescript
contents: [{
  role: "user",
  parts: [
    {
      fileData: { fileUri: "https://www.youtube.com/watch?v=ID", mimeType: "video/*" },
      videoMetadata: { startOffset: "40s", endOffset: "80s" },
    },
    { text: "What happens in this segment?" },
  ],
}]
```

Supported: `video/mp4`, `video/mpeg`, `video/mov`, `video/avi`, `video/webm`, `video/wmv`, `video/3gpp`

- ~300 tokens/sec at default resolution, ~100 at low
- Default 1 FPS sampling; increase for high-motion content
- Use File API for files >100 MB or videos >10 min

---

## 8. Thinking / Reasoning

For complex tasks, enable extended reasoning:

```typescript
import { ThinkingLevel } from "@google/genai";

const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: "Solve this step by step: ...",
  config: {
    thinkingConfig: {
      thinkingLevel: ThinkingLevel.HIGH,  // minimal | low | medium | high
      includeThoughts: true,
    },
  },
});

// Access thinking
for (const part of response.candidates[0].content.parts) {
  if (part.thought) {
    console.log("Thinking:", part.text);
  } else {
    console.log("Answer:", part.text);
  }
}
```

- `minimal`: Near-zero thinking, chat/high-throughput
- `low`: Simple tasks, low latency
- `medium`: Balanced
- `high` (default): Complex math, coding, reasoning

For Gemini 2.5, use `thinkingBudget` (token count) instead of `thinkingLevel`.

---

## 9. Built-in Tools

Gemini models can use Google's built-in tools:

```typescript
// Google Search grounding
config: { tools: [{ googleSearch: {} }] }

// URL context
config: { tools: [{ urlContext: {} }] }

// Code execution
config: { tools: [{ codeExecution: {} }] }
```

These can be combined with structured outputs on Gemini 3+.

---

## 10. Files API Reference

The Files API handles uploads for large media. Files are available for 48 hours.

```typescript
// Upload
const file = await ai.files.upload({
  file: "path/to/file",
  config: { mimeType: "image/jpeg", displayName: "my-image" },
});

// Check status
const status = await ai.files.get({ name: file.name });

// Use in request
createPartFromUri(file.uri, file.mimeType)

// List files
const files = await ai.files.list();

// Delete
await ai.files.delete({ name: file.name });
```

Size limits: 20 GB (paid) / 2 GB (free) per file.

---

## Quick Reference: Common Patterns

### Image analysis with structured JSON output

```typescript
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const analysisSchema = z.object({
  objects: z.array(z.object({
    name: z.string(),
    confidence: z.number(),
    description: z.string(),
  })),
  scene: z.string(),
  mood: z.enum(["happy", "sad", "neutral", "energetic", "calm"]),
});

const base64 = fs.readFileSync("photo.jpg", { encoding: "base64" });

const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: [
    { inlineData: { mimeType: "image/jpeg", data: base64 } },
    { text: "Analyze this image. Identify all objects, describe the scene, and assess the mood." },
  ],
  config: {
    responseMimeType: "application/json",
    responseJsonSchema: zodToJsonSchema(analysisSchema),
  },
});

const analysis = JSON.parse(response.text);
```

### Multi-modal chat with system instructions

```typescript
const chat = ai.chats.create({
  model: "gemini-3-flash-preview",
  config: {
    systemInstruction: "You are a helpful assistant that analyzes images and documents.",
  },
});

const response = await chat.sendMessage({
  message: createUserContent([
    { inlineData: { mimeType: "image/jpeg", data: base64Image } },
    "What do you see?",
  ]),
});
```
