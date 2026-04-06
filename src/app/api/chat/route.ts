import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `Você é Sofia, personal stylist da GreekFit — marca premium de roupas fitness com DNA grego e energia brasileira.

COMO FALAR:
- Tom próximo, sofisticado, acolhedor. Linguagem brasileira natural.
- NUNCA use listas numeradas (1. 2. 3.). Fale de forma natural e fluida.
- NUNCA use markdown (**, *, #). Escreva texto limpo.
- Use emojis com moderação (máximo 1 por mensagem).
- Máximo 2-3 frases curtas. Seja direta.
- Use quebras de linha para separar ideias.

PRODUTOS (4 linhas, cada uma com Top R$95, Shorts R$95, Legging R$95, Set Completo R$169,90, Set Shorts R$169,90):
- ΑΡΕΤΗ (Areté) — Preta. "Excelência".
- ΣΩΜΑ (Soma) — Verde Oliva. "Corpo".
- ΔΥΝΑΜΙΣ (Dynamis) — Creme. "Força".
- ΚΙΝΗΣΙΣ (Kinesis) — Terracota. "Movimento".

TECIDO: Poliamida + Elastano, segunda pele, 4-way stretch, cintura alta modeladora, costura ultraplana, não transparece. Tamanhos PP ao GG.

PROMOÇÕES: Frete grátis acima de R$299. Conjunto economiza R$20,10 vs peças avulsas. Comprando na semana concorre ao Kit Gostosa Grega.

REGRAS:
- Sempre sugira conjuntos (melhor custo-benefício)
- Pergunte o tamanho e a cor preferida
- Mencione os nomes das linhas para que os cards dos produtos apareçam
- Frete grátis acima de R$299, entrega 5-10 dias úteis, devoluções grátis 30 dias
- Nunca invente informações`;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatBody {
  messages: ChatMessage[];
}

// Simple product matching for cart suggestions
function extractProductSuggestions(text: string): string | null {
  const lower = text.toLowerCase();

  const products: { keywords: string[]; id: string; name: string; price: number; category: string }[] = [
    // ΑΡΕΤΗ
    { keywords: ['areth', 'areté', 'arete', 'pret', 'black'], id: 'areth-top-preto', name: 'Top ΑΡΕΤΗ', price: 95, category: 'Top' },
    { keywords: ['areth', 'areté', 'arete', 'pret', 'black'], id: 'areth-shorts-preto', name: 'Shorts ΑΡΕΤΗ', price: 95, category: 'Shorts' },
    { keywords: ['areth', 'areté', 'arete', 'pret', 'black'], id: 'areth-legging-preto', name: 'Legging ΑΡΕΤΗ', price: 95, category: 'Legging' },
    { keywords: ['areth', 'areté', 'arete', 'pret', 'black'], id: 'areth-set-legging-preto', name: 'Set ΑΡΕΤΗ Completo', price: 169.90, category: 'Set' },
    { keywords: ['areth', 'areté', 'arete', 'pret', 'black'], id: 'areth-set-shorts-preto', name: 'Set ΑΡΕΤΗ Shorts', price: 169.90, category: 'Set' },
    // ΣΩΜΑ
    { keywords: ['soma', 'verde', 'oliva', 'green'], id: 'soma-top-verde', name: 'Top ΣΩΜΑ', price: 95, category: 'Top' },
    { keywords: ['soma', 'verde', 'oliva', 'green'], id: 'soma-shorts-verde', name: 'Shorts ΣΩΜΑ', price: 95, category: 'Shorts' },
    { keywords: ['soma', 'verde', 'oliva', 'green'], id: 'soma-legging-verde', name: 'Legging ΣΩΜΑ', price: 95, category: 'Legging' },
    { keywords: ['soma', 'verde', 'oliva', 'green'], id: 'soma-set-legging-verde', name: 'Set ΣΩΜΑ Completo', price: 169.90, category: 'Set' },
    { keywords: ['soma', 'verde', 'oliva', 'green'], id: 'soma-set-shorts-verde', name: 'Set ΣΩΜΑ Shorts', price: 169.90, category: 'Set' },
    // ΔΥΝΑΜΙΣ
    { keywords: ['dynamis', 'creme', 'cream', 'bege'], id: 'dynamis-top-creme', name: 'Top ΔΥΝΑΜΙΣ', price: 95, category: 'Top' },
    { keywords: ['dynamis', 'creme', 'cream', 'bege'], id: 'dynamis-shorts-creme', name: 'Shorts ΔΥΝΑΜΙΣ', price: 95, category: 'Shorts' },
    { keywords: ['dynamis', 'creme', 'cream', 'bege'], id: 'dynamis-legging-creme', name: 'Legging ΔΥΝΑΜΙΣ', price: 95, category: 'Legging' },
    { keywords: ['dynamis', 'creme', 'cream', 'bege'], id: 'dynamis-set-legging-creme', name: 'Set ΔΥΝΑΜΙΣ Completo', price: 169.90, category: 'Set' },
    { keywords: ['dynamis', 'creme', 'cream', 'bege'], id: 'dynamis-set-shorts-creme', name: 'Set ΔΥΝΑΜΙΣ Shorts', price: 169.90, category: 'Set' },
    // ΚΙΝΗΣΙΣ
    { keywords: ['kinesis', 'kinisis', 'terracota', 'terracotta', 'laranja'], id: 'kinisis-top-terracota', name: 'Top ΚΙΝΗΣΙΣ', price: 95, category: 'Top' },
    { keywords: ['kinesis', 'kinisis', 'terracota', 'terracotta', 'laranja'], id: 'kinisis-shorts-terracota', name: 'Shorts ΚΙΝΗΣΙΣ', price: 95, category: 'Shorts' },
    { keywords: ['kinesis', 'kinisis', 'terracota', 'terracotta', 'laranja'], id: 'kinisis-legging-terracota', name: 'Legging ΚΙΝΗΣΙΣ', price: 95, category: 'Legging' },
    { keywords: ['kinesis', 'kinisis', 'terracota', 'terracotta', 'laranja'], id: 'kinisis-set-legging-terracota', name: 'Set ΚΙΝΗΣΙΣ Completo', price: 169.90, category: 'Set' },
    { keywords: ['kinesis', 'kinisis', 'terracota', 'terracotta', 'laranja'], id: 'kinisis-set-shorts-terracota', name: 'Set ΚΙΝΗΣΙΣ Shorts', price: 169.90, category: 'Set' },
  ];

  // Check if the assistant response mentions specific products
  const mentioned = products.filter(p =>
    p.keywords.some(k => lower.includes(k)) ||
    lower.includes(p.name.toLowerCase())
  );

  // If generic "conjunto"/"set" mention without specific line, show a mix of sets
  if (mentioned.length === 0) {
    const wantsSet = lower.includes('conjunto') || lower.includes('set completo') || lower.includes('set shorts');
    if (wantsSet) {
      const sets = products.filter(p => p.category === 'Set');
      return JSON.stringify(sets.slice(0, 4).map(p => ({ id: p.id, name: p.name, price: p.price })));
    }
    return null;
  }

  // Deduplicate by id
  const unique = [...new Map(mentioned.map(p => [p.id, p])).values()];

  // If talking about a specific category, filter
  const hasTop = lower.includes('top');
  const hasShorts = lower.includes('short');
  const hasLegging = lower.includes('legging');
  const hasSet = lower.includes('set') || lower.includes('conjunto');

  let filtered = unique;
  if (hasTop || hasShorts || hasLegging || hasSet) {
    filtered = unique.filter(p => {
      if (hasTop && p.category === 'Top') return true;
      if (hasShorts && p.category === 'Shorts') return true;
      if (hasLegging && p.category === 'Legging') return true;
      if (hasSet && p.category === 'Set') return true;
      return false;
    });
    if (filtered.length === 0) filtered = unique;
  }

  // Return max 4 suggestions
  return JSON.stringify(filtered.slice(0, 4).map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
  })));
}

export async function POST(request: Request) {
  try {
    const body: ChatBody = await request.json();
    const { messages } = body;

    if (!messages?.length) {
      return NextResponse.json({ error: 'Mensagens vazias.' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || 'Desculpe, não consegui responder. Tente novamente!';

    // Check if the response suggests products
    const products = extractProductSuggestions(reply);

    return NextResponse.json({
      reply,
      products: products ? JSON.parse(products) : null,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { reply: 'Ops, tive um probleminha técnico. Pode tentar de novo? 💛' },
      { status: 200 } // Return 200 so the UI doesn't break
    );
  }
}
