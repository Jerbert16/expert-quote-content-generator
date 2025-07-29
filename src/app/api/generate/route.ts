import { NextRequest, NextResponse } from 'next/server';
import { Expert, GenerateContentRequest } from '@/types';
import { generateExpertContext } from '@/app/lib/utils';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const body: GenerateContentRequest = await request.json();
    const { topic, experts } = body;

    if (!topic || !experts?.length) {
      return NextResponse.json(
        { error: 'Topic and experts are required', content: '' },
        { status: 400 }
      );
    }

    const sanitizedTopic = sanitizeInput(topic);
    if (sanitizedTopic.length > 200) {
      return NextResponse.json(
        { error: 'Topic must be 200 characters or less', content: '' },
        { status: 400 }
      );
    }

    // Validate experts: must have name and quote, length limits
    const isValidExpert = (e: unknown): e is Expert =>
      typeof e === 'object' &&
      e !== null &&
      'name' in e &&
      'quote' in e &&
      typeof (e as Expert).name === 'string' &&
      typeof (e as Expert).quote === 'string' &&
      (e as Expert).name.trim().length > 0 &&
      (e as Expert).quote.trim().length > 0 &&
      (e as Expert).name.length <= 100 &&
      (e as Expert).quote.length <= 1000;

    const valid = experts.filter(isValidExpert);

    if (!valid.length || valid.length > 10) {
      return NextResponse.json(
        {
          error: valid.length
            ? 'Maximum 10 experts allowed'
            : 'No valid experts provided',
          content: '',
        },
        { status: 400 }
      );
    }

    // Sanitize experts — keep quotes inside expert quotes by skipping quote stripping on quote field
    const sanitizedExperts = valid.map((e) => ({
      ...e,
      name: sanitizeInput(e.name),
      quote: sanitizeQuote(e.quote),
      title: sanitizeInput(e.title || ''),
      expertise: sanitizeInput(e.expertise || ''),
    }));

    const context = generateExpertContext(sanitizedExperts);
    const prompt = createPrompt(sanitizedTopic, context);
    const content = await generateWithGemini(prompt);

    return NextResponse.json({ content });
  } catch (e) {
    console.error('Error generating content:', e);
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to generate content: ${msg}`, content: '' },
      { status: 500 }
    );
  }
}

// Sanitize general inputs: remove problematic HTML chars and normalize whitespace
function sanitizeInput(s: string): string {
  return s.trim().replace(/[<>&"]/g, '').replace(/\s+/g, ' ');
}

// Sanitize quotes: keep quotation marks, just trim and normalize whitespace
function sanitizeQuote(s: string): string {
  return s.trim().replace(/\s+/g, ' ');
}

function createPrompt(topic: string, expertContext: string) {
  return `Write a comprehensive, professional article about "${topic}" that incorporates quotes and insights from the following experts. Make sure to properly attribute each quote and weave them naturally into the content.

Expert Quotes and Information:
${expertContext}

IMPORTANT REQUIREMENTS:
1. Write in a professional, engaging tone
2. Structure the article with clear sections and headings using markdown
3. **MUST include ALL expert quotes exactly as provided, wrapped in quotation marks**
4. Each quote must be properly attributed to the expert (e.g., "Quote text here," says John Smith, CTO at Company X.)
5. Provide context and analysis around each quote to explain its significance
6. Include an introduction, main body with expert insights, and conclusion
7. Use proper markdown formatting with headers (##, ###)
8. Ensure the article is between 800-1500 words
9. **Every single expert quote from the provided list must appear in the final article with proper attribution**
10. Format quotes using markdown quote blocks (>) or inline quotes with proper attribution

Example quote format: 
- Inline: "The future of AI is bright," explains Dr. Jane Smith, AI Researcher at Tech Corp.
- Or block quote:
> "The future of AI is bright and full of possibilities for innovation."
> — Dr. Jane Smith, AI Researcher at Tech Corp

The article should be informative, well-researched in tone, and provide valuable insights to readers interested in ${topic}. Remember: EVERY quote from the expert list must be included in the final article.`;
}

async function generateWithGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY!;
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-exp',
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 3000,
    },
  });

  const result = await model.generateContent([{ text: prompt }]);
  const response = await result.response;
  return response.text() || 'Content generation failed';
}
