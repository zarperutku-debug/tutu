import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import {
  STYLE_PRESETS,
  StyleId,
  parseRevisionIntent,
} from './src/utils/stylistEngine';

dotenv.config();

const PORT = 3000;

function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function resolveLocalImageBase64(imagePathOrDataUrl: string): { data: string; mimeType: string } | null {
  try {
    if (imagePathOrDataUrl.startsWith('data:')) {
      const match = imagePathOrDataUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        return { mimeType: match[1], data: match[2] };
      }
    }
    if (imagePathOrDataUrl.startsWith('/src/assets/')) {
      const absPath = path.join(process.cwd(), imagePathOrDataUrl.replace(/^\//, ''));
      if (fs.existsSync(absPath)) {
        const buf = fs.readFileSync(absPath);
        return { mimeType: 'image/jpeg', data: buf.toString('base64') };
      }
    }
  } catch {
    // Ignore file read errors and let caller fallback
  }
  return null;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '20mb' }));

  /**
   * POST /api/restyle-image
   * Uses gemini-nano-banana-2.1 to edit/restyle the user's outfit photo based on selected style
   * or custom revision instructions (e.g. "Pantolonun paçasını daralt, ayakkabıyı beyaz sneaker yap").
   */
  app.post('/api/restyle-image', async (req, res) => {
    const {
      imageSource,
      styleId = 'old-money',
      customRevisionPrompt,
    }: {
      imageSource?: string;
      styleId?: StyleId;
      customRevisionPrompt?: string;
    } = req.body ?? {};

    const preset = STYLE_PRESETS[styleId] ?? STYLE_PRESETS['old-money'];
    const revisionEffect = customRevisionPrompt
      ? parseRevisionIntent(customRevisionPrompt, styleId)
      : null;

    const ai = getGenAIClient();
    const resolvedImage = imageSource ? resolveLocalImageBase64(imageSource) : null;

    if (ai && resolvedImage) {
      try {
        const editInstruction = customRevisionPrompt
          ? `${preset.promptTemplate} Additionally, apply this exact tailoring and styling revision requested by the user: "${customRevisionPrompt}". Maintain the person's identity, full-body framing, and studio background.`
          : preset.promptTemplate;

        const response = await ai.models.generateContent({
          model: 'gemini-nano-banana-2.1',
          contents: {
            parts: [
              {
                inlineData: {
                  data: resolvedImage.data,
                  mimeType: resolvedImage.mimeType,
                },
              },
              {
                text: editInstruction,
              },
            ],
          },
          config: {
            imageConfig: {
              aspectRatio: '3:4',
              imageSize: '1K',
            },
          },
        });

        let generatedImageUrl: string | null = null;
        let modelNote = '';

        for (const part of response.candidates?.[0]?.content?.parts ?? []) {
          if (part.inlineData?.data) {
            const mime = part.inlineData.mimeType ?? 'image/png';
            generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
          } else if (part.text) {
            modelNote += part.text;
          }
        }

        if (generatedImageUrl) {
          return res.json({
            ok: true,
            modelUsed: 'gemini-nano-banana-2.1',
            afterImageUrl: generatedImageUrl,
            modelNote: modelNote || preset.editorialTagline,
            revisionEffect,
          });
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.warn('[Atelier Véra] gemini-nano-banana-2.1 fallback triggered:', message);
      }
    }

    // Studio preset / deterministic high-fashion synthesis fallback when paid image model key is not enabled
    const fallbackAfterUrl =
      revisionEffect?.visualAdjustments.overrideAfterImageUrl ?? preset.afterImageUrl;

    return res.json({
      ok: true,
      modelUsed: 'atelier-studio-engine',
      afterImageUrl: fallbackAfterUrl,
      modelNote: revisionEffect ? revisionEffect.stylistReply : preset.editorialTagline,
      revisionEffect,
    });
  });

  /**
   * POST /api/stylist-chat
   * Multi-turn context-aware AI Stylist conversation using gemini-4-argon (with fallback to gemini-3.8-flash).
   * Also returns immediate visual revision effects and updated wardrobe cards.
   */
  app.post('/api/stylist-chat', async (req, res) => {
    const {
      messages = [],
      latestMessage = '',
      currentStyleId = 'old-money',
      imageSource,
    }: {
      messages?: { role: 'user' | 'assistant'; content: string }[];
      latestMessage?: string;
      currentStyleId?: StyleId;
      imageSource?: string;
    } = req.body ?? {};

    const preset = STYLE_PRESETS[currentStyleId] ?? STYLE_PRESETS['old-money'];
    const revisionEffect = parseRevisionIntent(latestMessage, currentStyleId);

    const systemInstruction = `Sen "Atelier Véra" Baş Moda Editörü ve Kişisel AI Stilistisin.
Kullanıcının boydan kıyafet fotoğrafını ve şu an seçili olan "${preset.name}" (${preset.subtitle}) stilini analiz ediyorsun.
Görevlerin:
1. Kullanıcının istediği anlık revizyonları (örneğin: "Pantolonun paçasını daralt, ayakkabıyı beyaz sneaker yap", "Ceketi lacivert blazer yap", "Daha minimal bir üst seç") bir terzi ve baş stilist gözüyle değerlendir.
2. Bu değişikliğin omuz-bel-bacak oranı (silüet), paça açıklığı, kumaş dökümü ve renk kontrastı üzerindeki etkisini Türkçe, zarif ve net bir dille (2-3 kısa paragraf veya maddeler halinde) açıkla.
3. Yanıtında her zaman somut terzilik detayları (ör. 16.8 cm dar paça açıklığı, bilek kemiği hizasında kırılmasız bitiş, İtalyan Nappa deri beyaz sneaker kontrastı) kullan ve "Gardırobu Tamamla" bölümündeki parçaları bu revizyona göre güncellediğini belirt.`;

    const ai = getGenAIClient();

    if (ai) {
      // Try gemini-4-argon first (as specified for complex stylist reasoning), then fallback to gemini-3.8-flash
      const candidateModels = ['gemini-4-argon', 'gemini-3.8-flash'];
      for (const modelName of candidateModels) {
        try {
          const historyText = messages
            .slice(-6)
            .map((m) => `${m.role === 'user' ? 'Kullanıcı' : 'AI Stilist'}: ${m.content}`)
            .join('\n');

          const promptText = `Aktif Stil: ${preset.name} (${preset.description})
Önceki Sohbet Geçmişi:
${historyText || '(İlk mesaj)'}

Kullanıcının Yeni Revizyon / Stil Talebi: "${latestMessage}"
Tespit Edilen Terzilik Değişiklikleri: ${revisionEffect.summaryTitle}

Lütfen kullanıcıya doğrudan Türkçe olarak, Atelier Véra Baş Stilisti kimliğiyle yanıt ver.`;

          const resolvedImage = imageSource ? resolveLocalImageBase64(imageSource) : null;
          const contents = resolvedImage
            ? {
                parts: [
                  {
                    inlineData: {
                      data: resolvedImage.data,
                      mimeType: resolvedImage.mimeType,
                    },
                  },
                  { text: promptText },
                ],
              }
            : promptText;

          const response: GenerateContentResponse = await ai.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction,
            },
          });

          const replyText = response.text?.trim();
          if (replyText) {
            return res.json({
              ok: true,
              modelUsed: modelName,
              reply: replyText,
              revisionEffect: {
                ...revisionEffect,
                stylistReply: replyText,
              },
            });
          }
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          console.warn(`[Atelier Véra] ${modelName} chat fallback:`, msg);
        }
      }
    }

    return res.json({
      ok: true,
      modelUsed: 'atelier-stylist-context',
      reply: revisionEffect.stylistReply,
      revisionEffect,
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Atelier Véra server running on http://localhost:${PORT}`);
  });
}

startServer();
