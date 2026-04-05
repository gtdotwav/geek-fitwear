export interface ProductColor {
  name: string;
  hex: string;
  image: string;
  backImage?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  tag?: 'Novo' | 'Mais Vendido' | 'Limitado' | 'Outlet';
  originalPrice: number;
  pixPrice: number;
  installments: { count: number; value: number };
  sizes: string[];
  colors: ProductColor[];
  description: string;
  stock: number;
  features: string[];
  details: string;
  washing: string;
}

export type Category = 'Todos' | 'Legging' | 'Top' | 'Shorts' | 'Set';

export const categories: Category[] = ['Todos', 'Legging', 'Top', 'Shorts', 'Set'];

export const products: Product[] = [

  // ─── LEGGINGS ──────────────────────────────────────────────────────────────

  {
    id: 'legging-aegean',
    name: 'Legging Aegean',
    category: 'Legging',
    tag: 'Mais Vendido',
    originalPrice: 249,
    pixPrice: 199,
    installments: { count: 12, value: 20.75 },
    sizes: ['P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Pedra', hex: '#8B8272', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80' },
      { name: 'Areia', hex: '#C2A27C', image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80' },
      { name: 'Obsidiana', hex: '#1A1A1A', image: 'https://images.unsplash.com/photo-1616803689943-5601631c7fec?w=600&q=80' },
    ],
    description: 'A peça fundamental da coleção. Tecido compressivo de alta performance com efeito sculpting que acompanha cada movimento sem perder a forma.',
    stock: 18,
    features: ['Tecido Sculpting 4-Way Stretch', 'Cintura alta modeladora', 'Não fica transparente', 'Secagem ultrarrápida', 'Costura flat sem atrito'],
    details: 'Composição: 76% Poliamida, 24% Elastano. Costura ultraplana. Cós duplo com encaixe anatômico. Comprimento 7/8.',
    washing: 'Lavar à mão ou em máquina com água fria. Não usar alvejante. Não torcer. Secar à sombra. Não passar ferro.',
  },

  {
    id: 'legging-santorini',
    name: 'Legging Santorini',
    category: 'Legging',
    tag: 'Novo',
    originalPrice: 279,
    pixPrice: 224,
    installments: { count: 12, value: 23.25 },
    sizes: ['P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Ceu Egeu', hex: '#6B8CAE', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80' },
      { name: 'Bruma', hex: '#D4CFC8', image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&q=80' },
    ],
    description: 'Inspirada nas pedras brancas de Santorini. Detalhe lateral tonal e bolso posterior discreto. Elegante o suficiente para o café depois do treino.',
    stock: 12,
    features: ['Bolso lateral com zíper', 'Detalhe lateral tonal', 'Compressão muscular suave', 'UPF 50+', 'Anti-pilling'],
    details: 'Composição: 80% Poliamida Reciclada, 20% Elastano. Comprimento full-length. Costuras planas reforçadas.',
    washing: 'Lavar à mão com água fria. Não usar amaciante. Secar à sombra. Não centrifugar.',
  },

  {
    id: 'legging-corinth',
    name: 'Legging Corinth',
    category: 'Legging',
    tag: 'Limitado',
    originalPrice: 299,
    pixPrice: 239,
    installments: { count: 12, value: 24.92 },
    sizes: ['P', 'M', 'G'],
    colors: [
      { name: 'Terracota', hex: '#C47B5A', image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&q=80' },
      { name: 'Musgo', hex: '#5C6B4A', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&q=80' },
    ],
    description: 'Edição limitada. Estampa tie-dye mineral exclusiva, feita com pigmentos naturais. Cada peça é única — como você.',
    stock: 6,
    features: ['Estampa tie-dye exclusiva', 'Pigmentos naturais', 'Cintura alta 10cm', 'Peça única numerada', 'Tecido ultra-macio'],
    details: 'Composição: 72% Poliamida, 28% Elastano. Cós duplo sem elástico exposto. Edição limitada de 50 unidades por cor.',
    washing: 'Lavar à mão com sabão neutro. Não expor ao sol. Secar sempre à sombra para preservar as cores.',
  },

  {
    id: 'legging-delphi',
    name: 'Legging Delphi',
    category: 'Legging',
    originalPrice: 229,
    pixPrice: 184,
    installments: { count: 12, value: 19.17 },
    sizes: ['P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Meia Noite', hex: '#2B2B3B', image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&q=80' },
      { name: 'Cinza Fumo', hex: '#7A7A7A', image: 'https://images.unsplash.com/photo-1600701245608-fb2e10e53a36?w=600&q=80' },
      { name: 'Preto', hex: '#0D0D0D', image: 'https://images.unsplash.com/photo-1545574473-60ca79346e96?w=600&q=80' },
    ],
    description: 'A legging de treino intenso. Compressão graduada que reduz a fadiga muscular e melhora a circulação durante o esforço.',
    stock: 24,
    features: ['Compressão graduada 20-15 mmHg', 'Tecnologia anti-odor permanente', 'Refletivos para uso noturno', 'Bolso escondido no cós', 'Alta durabilidade'],
    details: 'Composição: 78% Poliamida, 22% Elastano com fio elastano Lycra® Dualfx. Ideal para corrida, HIIT e musculação.',
    washing: 'Máquina fria, ciclo delicado. Não usar secadora. Não torcer. Secar à sombra.',
  },

  {
    id: 'legging-mykonos',
    name: 'Legging Mykonos',
    category: 'Legging',
    tag: 'Outlet',
    originalPrice: 259,
    pixPrice: 155,
    installments: { count: 12, value: 16.17 },
    sizes: ['M', 'G', 'GG'],
    colors: [
      { name: 'Rosa Nude', hex: '#D4A5A5', image: 'https://images.unsplash.com/photo-1590760475226-da8fd01f7e60?w=600&q=80' },
      { name: 'Lilas', hex: '#9B8EC4', image: 'https://images.unsplash.com/photo-1620738953992-f3e6db571a93?w=600&q=80' },
    ],
    description: 'Peça da temporada anterior em preço especial. Mesma qualidade premium GreekFit, estoque limitado por tamanho.',
    stock: 9,
    features: ['Tecido sculpting 4-way', 'Cintura alta modeladora', 'Costura flat', 'Secagem rápida', 'Não transparece'],
    details: 'Composição: 76% Poliamida, 24% Elastano. Coleção SS 2024. Comprimento 7/8.',
    washing: 'Lavar à mão ou máquina com água fria. Secar à sombra.',
  },

  // ─── TOPS ──────────────────────────────────────────────────────────────────

  {
    id: 'top-olympia',
    name: 'Top Olympia',
    category: 'Top',
    tag: 'Mais Vendido',
    originalPrice: 189,
    pixPrice: 152,
    installments: { count: 12, value: 15.83 },
    sizes: ['P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Pedra', hex: '#8B8272', image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600&q=80' },
      { name: 'Areia', hex: '#C2A27C', image: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80' },
      { name: 'Branco Giz', hex: '#F5F1E8', image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&q=80' },
    ],
    description: 'O top de alça que virou ícone da marca. Suporte médio-alto com bojo removível, perfeito para yoga, pilates e treino funcional.',
    stock: 22,
    features: ['Suporte médio-alto', 'Bojo removível', 'Alças cruzadas ajustáveis', 'Tecido suave tipo segunda pele', 'Costuras planas'],
    details: 'Composição: 82% Poliamida, 18% Elastano. Bojo de EVA destacável. Faixa de banda elástica dupla.',
    washing: 'Lavar à mão com água fria. Remover o bojo antes de lavar. Secar à sombra.',
  },

  {
    id: 'top-atenas',
    name: 'Top Atenas',
    category: 'Top',
    tag: 'Novo',
    originalPrice: 219,
    pixPrice: 175,
    installments: { count: 12, value: 18.25 },
    sizes: ['P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Obsidiana', hex: '#1A1A1A', image: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=600&q=80' },
      { name: 'Ceu Egeu', hex: '#6B8CAE', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80' },
    ],
    description: 'Design assimétrico com decote cruzado. Suporte alto para treinos de alto impacto. A arquitetura do movimento.',
    stock: 15,
    features: ['Suporte alto', 'Decote cruzado', 'Fio de aço na base', 'Regulagem de alça na frente', 'Anti-impacto certificado'],
    details: 'Composição: 78% Poliamida, 22% Elastano. Estrutura interna com espuma moldada. Fio de aço inoxidável na base.',
    washing: 'Lavar à mão com sabão neutro. Não usar secadora. Secar à sombra.',
  },

  {
    id: 'top-rhodos',
    name: 'Top Rhodos',
    category: 'Top',
    tag: 'Limitado',
    originalPrice: 239,
    pixPrice: 191,
    installments: { count: 12, value: 19.92 },
    sizes: ['P', 'M', 'G'],
    colors: [
      { name: 'Terracota', hex: '#C47B5A', image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80' },
      { name: 'Musgo', hex: '#5C6B4A', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80' },
    ],
    description: 'Edição especial com recortes laser cut nas costas. Ventilação estratégica sem comprometer o suporte. Arte e funcionalidade.',
    stock: 8,
    features: ['Recortes laser cut nas costas', 'Ventilação estratégica', 'Suporte médio-alto', 'Bojo moldado', 'Edição limitada'],
    details: 'Composição: 80% Poliamida Reciclada, 20% Elastano. Recortes termobondados. Edição de 60 unidades.',
    washing: 'Lavar somente à mão. Não dobrar sobre os recortes. Secar flat à sombra.',
  },

  {
    id: 'top-creta',
    name: 'Top Creta',
    category: 'Top',
    originalPrice: 169,
    pixPrice: 135,
    installments: { count: 12, value: 14.08 },
    sizes: ['P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Bruma', hex: '#D4CFC8', image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&q=80' },
      { name: 'Meia Noite', hex: '#2B2B3B', image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&q=80' },
      { name: 'Rosa Nude', hex: '#D4A5A5', image: 'https://images.unsplash.com/photo-1590760475226-da8fd01f7e60?w=600&q=80' },
    ],
    description: 'O top de yoga perfeito. Ultra leve, suporte leve-médio, sem bojo para máxima liberdade de movimento. Minimalismo que funciona.',
    stock: 30,
    features: ['Suporte leve-médio', 'Sem bojo (máxima leveza)', 'Tecido tipo segunda pele', 'Ideal para yoga e pilates', 'Alças fixas largas'],
    details: 'Composição: 88% Poliamida, 12% Elastano. Faixa inferior dupla. Alças de 4cm para maior conforto.',
    washing: 'Máquina fria, ciclo delicado. Secar à sombra.',
  },

  {
    id: 'top-corfu',
    name: 'Top Corfu',
    category: 'Top',
    tag: 'Outlet',
    originalPrice: 199,
    pixPrice: 119,
    installments: { count: 12, value: 12.42 },
    sizes: ['P', 'G', 'GG'],
    colors: [
      { name: 'Lilas', hex: '#9B8EC4', image: 'https://images.unsplash.com/photo-1620738953992-f3e6db571a93?w=600&q=80' },
      { name: 'Cinza Fumo', hex: '#7A7A7A', image: 'https://images.unsplash.com/photo-1600701245608-fb2e10e53a36?w=600&q=80' },
    ],
    description: 'Top de temporada anterior em liquidação. Alça dupla com detalhe em nó frontal. Perfeito para treinos de baixo a médio impacto.',
    stock: 11,
    features: ['Alça dupla com nó frontal', 'Bojo fixo', 'Suporte leve-médio', 'Tecido sculpting suave', 'Detalhe fashion'],
    details: 'Composição: 76% Poliamida, 24% Elastano. Coleção SS 2024. Bojo fixo não removível.',
    washing: 'Lavar à mão com água fria. Secar à sombra.',
  },

  // ─── SETS ──────────────────────────────────────────────────────────────────

  {
    id: 'set-olympus',
    name: 'Set Olympus',
    category: 'Set',
    tag: 'Mais Vendido',
    originalPrice: 419,
    pixPrice: 335,
    installments: { count: 12, value: 34.92 },
    sizes: ['P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Pedra', hex: '#8B8272', image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&q=80' },
      { name: 'Obsidiana', hex: '#1A1A1A', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80' },
      { name: 'Areia', hex: '#C2A27C', image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80' },
    ],
    description: 'O conjunto completo que define a coleção. Top Olympia + Legging Aegean combinados. Simetria perfeita entre forma e função.',
    stock: 20,
    features: ['Top + Legging coordenados', 'Tecido Sculpting 4-Way Stretch', 'Cintura alta modeladora', 'Bojo removível', 'Costura flat em todo o conjunto'],
    details: 'Set completo: Top Olympia + Legging Aegean. Mesma composição e lote de tingimento para cor exata. Vendidos juntos.',
    washing: 'Lavar à mão ou máquina fria. Remover bojo antes de lavar. Secar à sombra.',
  },

  {
    id: 'set-aegean-blue',
    name: 'Set Aegean Blue',
    category: 'Set',
    tag: 'Novo',
    originalPrice: 459,
    pixPrice: 367,
    installments: { count: 12, value: 38.25 },
    sizes: ['P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Ceu Egeu', hex: '#6B8CAE', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80' },
      { name: 'Bruma', hex: '#D4CFC8', image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&q=80' },
    ],
    description: 'Inspirado no azul infinito do Mar Egeu. Top Atenas + Legging Santorini na mesma paleta. Para quem treina com intenção e vive com estilo.',
    stock: 14,
    features: ['Top Atenas + Legging Santorini', 'Suporte alto no top', 'Bolso lateral na legging', 'UPF 50+', 'Poliamida Reciclada'],
    details: 'Set completo: Top Atenas + Legging Santorini. Tecido 80% Poliamida Reciclada, 20% Elastano. Certificação OEKO-TEX.',
    washing: 'Lavar à mão com água fria. Secar à sombra. Não usar amaciante.',
  },

  {
    id: 'set-terracota',
    name: 'Set Terracota',
    category: 'Set',
    tag: 'Limitado',
    originalPrice: 499,
    pixPrice: 399,
    installments: { count: 12, value: 41.58 },
    sizes: ['P', 'M', 'G'],
    colors: [
      { name: 'Terracota', hex: '#C47B5A', image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&q=80' },
      { name: 'Musgo', hex: '#5C6B4A', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&q=80' },
    ],
    description: 'Edição limitada. Top Rhodos com recortes laser cut + Legging Corinth tie-dye. Conjunto de colecionador. 40 unidades no total.',
    stock: 5,
    features: ['Top Rhodos + Legging Corinth', 'Recortes laser cut no top', 'Estampa tie-dye exclusiva na legging', 'Peças numeradas', 'Embalagem especial inclusa'],
    details: 'Set edição limitada numerada. Cada conjunto acompanha certificado de autenticidade e embalagem premium. Produção de 40 sets.',
    washing: 'Lavar somente à mão com sabão neutro. Peças separadas. Secar flat à sombra.',
  },

  {
    id: 'set-minimal-black',
    name: 'Set Minimal Black',
    category: 'Set',
    originalPrice: 379,
    pixPrice: 303,
    installments: { count: 12, value: 31.58 },
    sizes: ['P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Preto', hex: '#0D0D0D', image: 'https://images.unsplash.com/photo-1545574473-60ca79346e96?w=600&q=80' },
      { name: 'Meia Noite', hex: '#2B2B3B', image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&q=80' },
    ],
    description: 'O clássico preto GreekFit. Top Creta + Legging Delphi. Compressão graduada, leveza máxima. Para treinos sérios e dias casuais.',
    stock: 28,
    features: ['Top Creta + Legging Delphi', 'Compressão graduada na legging', 'Top ultra leve', 'Anti-odor permanente', 'Refletivos para uso noturno'],
    details: 'Set completo: Top Creta + Legging Delphi. Tecidos complementares de máxima performance. Ideal para corrida, HIIT e musculação.',
    washing: 'Máquina fria, ciclo delicado. Secar à sombra. Não usar secadora.',
  },

  {
    id: 'set-rosê',
    name: 'Set Rosê',
    category: 'Set',
    tag: 'Outlet',
    originalPrice: 399,
    pixPrice: 239,
    installments: { count: 12, value: 24.92 },
    sizes: ['M', 'G', 'GG'],
    colors: [
      { name: 'Rosa Nude', hex: '#D4A5A5', image: 'https://images.unsplash.com/photo-1590760475226-da8fd01f7e60?w=600&q=80' },
      { name: 'Lilas', hex: '#9B8EC4', image: 'https://images.unsplash.com/photo-1620738953992-f3e6db571a93?w=600&q=80' },
    ],
    description: 'Top Corfu com nó frontal + Legging Mykonos da coleção anterior em preço especial. Cores suaves para treinos e lifestyle.',
    stock: 7,
    features: ['Top Corfu + Legging Mykonos', 'Alça com nó frontal', 'Cintura alta modeladora', 'Tecido sculpting 4-way', 'Cores pastéis exclusivas'],
    details: 'Set coleção SS 2024. Top com bojo fixo + Legging 7/8. Composição: 76% Poliamida, 24% Elastano.',
    washing: 'Lavar à mão com água fria. Secar à sombra. Não usar amaciante.',
  },

  // ─── ΑΡΕΤΗ (ARETH) — LINHA PRETA ─────────────────────────────────────────

  {
    id: 'areth-top-preto',
    name: 'Top ΑΡΕΤΗ',
    category: 'Top',
    tag: 'Novo',
    originalPrice: 229,
    pixPrice: 183,
    installments: { count: 12, value: 19.08 },
    sizes: ['P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Preto', hex: '#0D0D0D', image: '/products/areth/top-closeup.png', backImage: '/products/areth/shorts-studio.png' },
    ],
    description: 'O top essencial da linha ΑΡΕΤΗ. Suporte médio-alto com faixa inferior com logo ΑΡΕΤΗ em relevo. Design racerback para máxima liberdade de movimento. A excelência no seu estado mais puro.',
    stock: 20,
    features: ['Suporte médio-alto', 'Bojo removível', 'Alças racerback cruzadas', 'Logo ΑΡΕΤΗ em relevo na faixa', 'Tecido segunda pele ultra-macio'],
    details: 'Composição: 82% Poliamida, 18% Elastano. Faixa inferior com logo em silicone tonal. Bojo EVA destacável. Costura ultraplana.',
    washing: 'Lavar à mão com água fria. Remover bojo antes de lavar. Não usar alvejante. Secar à sombra.',
  },

  {
    id: 'areth-shorts-preto',
    name: 'Shorts ΑΡΕΤΗ',
    category: 'Shorts',
    tag: 'Novo',
    originalPrice: 199,
    pixPrice: 159,
    installments: { count: 12, value: 16.58 },
    sizes: ['P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Preto', hex: '#0D0D0D', image: '/products/areth/shorts-stand.png', backImage: '/products/areth/shorts-chair.png' },
    ],
    description: 'Shorts de cintura alta da linha ΑΡΕΤΗ. Comprimento ideal para treino funcional e musculação, com logo ΑΡΕΤΗ discreto no cós. Compressão modeladora sem restringir o movimento.',
    stock: 18,
    features: ['Cintura alta modeladora', 'Logo ΑΡΕΤΗ no cós', 'Comprimento mid-thigh', 'Não sobe durante o treino', 'Tecido Sculpting 4-Way Stretch'],
    details: 'Composição: 76% Poliamida, 24% Elastano. Cós duplo de 8cm com logo em silicone. Comprimento 15cm de entrepernas. Costura flat.',
    washing: 'Lavar à mão ou máquina com água fria. Não usar alvejante. Secar à sombra. Não torcer.',
  },

  {
    id: 'areth-legging-preto',
    name: 'Legging ΑΡΕΤΗ',
    category: 'Legging',
    tag: 'Novo',
    originalPrice: 259,
    pixPrice: 207,
    installments: { count: 12, value: 21.58 },
    sizes: ['P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Preto', hex: '#0D0D0D', image: '/products/areth/legging-front.png', backImage: '/products/areth/legging-walk.png' },
    ],
    description: 'Legging full-length da linha ΑΡΕΤΗ. Cintura alta com logo ΑΡΕΤΗ no cós, compressão sculpting que modela e acompanha cada movimento. Elegância absoluta do treino ao dia a dia.',
    stock: 22,
    features: ['Cintura alta modeladora 10cm', 'Logo ΑΡΕΤΗ no cós', 'Compressão Sculpting 4-Way Stretch', 'Não fica transparente', 'Secagem ultrarrápida'],
    details: 'Composição: 76% Poliamida, 24% Elastano. Cós duplo com logo em silicone tonal. Comprimento full-length. Costura ultraplana sem atrito.',
    washing: 'Lavar à mão ou máquina com água fria. Não usar alvejante. Não torcer. Secar à sombra.',
  },

  {
    id: 'areth-set-legging-preto',
    name: 'Set ΑΡΕΤΗ Completo',
    category: 'Set',
    tag: 'Novo',
    originalPrice: 459,
    pixPrice: 367,
    installments: { count: 12, value: 38.25 },
    sizes: ['P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Preto', hex: '#0D0D0D', image: '/products/areth/legging-full.png', backImage: '/products/areth/set-grid.png' },
    ],
    description: 'O conjunto completo ΑΡΕΤΗ: Top + Legging coordenados em preto absoluto. Logo tonal em ambas as peças. A simetria perfeita entre virtude e movimento. Feito para quem busca excelência.',
    stock: 15,
    features: ['Top ΑΡΕΤΗ + Legging ΑΡΕΤΗ coordenados', 'Logo tonal em silicone em ambas as peças', 'Tecido Sculpting 4-Way Stretch', 'Cintura alta modeladora', 'Bojo removível no top'],
    details: 'Set completo: Top ΑΡΕΤΗ + Legging ΑΡΕΤΗ. Mesma composição e lote de tingimento. 82% Poliamida, 18% Elastano (top) / 76% Poliamida, 24% Elastano (legging).',
    washing: 'Lavar à mão com água fria. Remover bojo antes de lavar. Secar à sombra. Não usar amaciante.',
  },

  {
    id: 'areth-set-shorts-preto',
    name: 'Set ΑΡΕΤΗ Shorts',
    category: 'Set',
    tag: 'Novo',
    originalPrice: 399,
    pixPrice: 319,
    installments: { count: 12, value: 33.25 },
    sizes: ['P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Preto', hex: '#0D0D0D', image: '/products/areth/shorts-stand.png', backImage: '/products/areth/shorts-studio.png' },
    ],
    description: 'Conjunto ΑΡΕΤΗ versão shorts: Top + Shorts coordenados em preto. Ideal para treinos de alta intensidade e dias quentes. A mesma excelência, com mais liberdade.',
    stock: 16,
    features: ['Top ΑΡΕΤΗ + Shorts ΑΡΕΤΗ coordenados', 'Logo tonal em silicone em ambas as peças', 'Shorts mid-thigh que não sobe', 'Suporte médio-alto no top', 'Costura flat sem atrito'],
    details: 'Set completo: Top ΑΡΕΤΗ + Shorts ΑΡΕΤΗ. Mesma composição e lote. 82% Poliamida, 18% Elastano (top) / 76% Poliamida, 24% Elastano (shorts).',
    washing: 'Lavar à mão com água fria. Remover bojo antes de lavar. Secar à sombra.',
  },

  // ─── ΣΩΜΑ (SOMA) — LINHA VERDE OLIVA ─────────────────────────────────────

  {
    id: 'soma-top-verde',
    name: 'Top ΣΩΜΑ',
    category: 'Top',
    tag: 'Novo',
    originalPrice: 229,
    pixPrice: 183,
    installments: { count: 12, value: 19.08 },
    sizes: ['P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Verde Oliva', hex: '#5C6B4A', image: '/products/soma/legging-front.png', backImage: '/products/soma/legging-side.png' },
    ],
    description: 'O top essencial da linha ΣΩΜΑ. Suporte médio-alto com faixa inferior com logo ΣΩΜΑ em relevo dourado. Design racerback para máxima liberdade. Corpo e movimento em harmonia.',
    stock: 20,
    features: ['Suporte médio-alto', 'Bojo removível', 'Alças racerback cruzadas', 'Logo ΣΩΜΑ em relevo dourado na faixa', 'Tecido segunda pele ultra-macio'],
    details: 'Composição: 82% Poliamida, 18% Elastano. Faixa inferior com logo em silicone dourado. Bojo EVA destacável. Costura ultraplana.',
    washing: 'Lavar à mão com água fria. Remover bojo antes de lavar. Não usar alvejante. Secar à sombra.',
  },

  {
    id: 'soma-shorts-verde',
    name: 'Shorts ΣΩΜΑ',
    category: 'Shorts',
    tag: 'Novo',
    originalPrice: 199,
    pixPrice: 159,
    installments: { count: 12, value: 16.58 },
    sizes: ['P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Verde Oliva', hex: '#5C6B4A', image: '/products/soma/shorts-front.png', backImage: '/products/soma/shorts-front2.png' },
    ],
    description: 'Shorts de cintura alta da linha ΣΩΜΑ em verde oliva. Comprimento mid-thigh com logo ΣΩΜΑ discreto no cós e na perna. Compressão modeladora que conecta corpo e performance.',
    stock: 18,
    features: ['Cintura alta modeladora', 'Logo ΣΩΜΑ no cós e na perna', 'Comprimento mid-thigh', 'Não sobe durante o treino', 'Tecido Sculpting 4-Way Stretch'],
    details: 'Composição: 76% Poliamida, 24% Elastano. Cós duplo de 8cm com logo em silicone dourado. Comprimento 15cm de entrepernas. Costura flat.',
    washing: 'Lavar à mão ou máquina com água fria. Não usar alvejante. Secar à sombra. Não torcer.',
  },

  {
    id: 'soma-legging-verde',
    name: 'Legging ΣΩΜΑ',
    category: 'Legging',
    tag: 'Novo',
    originalPrice: 259,
    pixPrice: 207,
    installments: { count: 12, value: 21.58 },
    sizes: ['P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Verde Oliva', hex: '#5C6B4A', image: '/products/soma/legging-front.png', backImage: '/products/soma/legging-stretch.png' },
    ],
    description: 'Legging full-length da linha ΣΩΜΑ em verde oliva. Cintura alta com logo ΣΩΜΑ no cós, compressão sculpting que modela e honra cada curva. O corpo como templo.',
    stock: 22,
    features: ['Cintura alta modeladora 10cm', 'Logo ΣΩΜΑ no cós', 'Compressão Sculpting 4-Way Stretch', 'Não fica transparente', 'Secagem ultrarrápida'],
    details: 'Composição: 76% Poliamida, 24% Elastano. Cós duplo com logo em silicone dourado tonal. Comprimento full-length. Costura ultraplana sem atrito.',
    washing: 'Lavar à mão ou máquina com água fria. Não usar alvejante. Não torcer. Secar à sombra.',
  },

  {
    id: 'soma-set-legging-verde',
    name: 'Set ΣΩΜΑ Completo',
    category: 'Set',
    tag: 'Novo',
    originalPrice: 459,
    pixPrice: 367,
    installments: { count: 12, value: 38.25 },
    sizes: ['P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Verde Oliva', hex: '#5C6B4A', image: '/products/soma/legging-stretch.png', backImage: '/products/soma/set-grid.png' },
    ],
    description: 'O conjunto completo ΣΩΜΑ: Top + Legging coordenados em verde oliva. Logo dourado tonal em ambas as peças. A conexão perfeita entre corpo, mente e movimento.',
    stock: 15,
    features: ['Top ΣΩΜΑ + Legging ΣΩΜΑ coordenados', 'Logo dourado tonal em silicone em ambas as peças', 'Tecido Sculpting 4-Way Stretch', 'Cintura alta modeladora', 'Bojo removível no top'],
    details: 'Set completo: Top ΣΩΜΑ + Legging ΣΩΜΑ. Mesma composição e lote de tingimento. 82% Poliamida, 18% Elastano (top) / 76% Poliamida, 24% Elastano (legging).',
    washing: 'Lavar à mão com água fria. Remover bojo antes de lavar. Secar à sombra. Não usar amaciante.',
  },

  {
    id: 'soma-set-shorts-verde',
    name: 'Set ΣΩΜΑ Shorts',
    category: 'Set',
    tag: 'Novo',
    originalPrice: 399,
    pixPrice: 319,
    installments: { count: 12, value: 33.25 },
    sizes: ['P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Verde Oliva', hex: '#5C6B4A', image: '/products/soma/shorts-front.png', backImage: '/products/soma/shorts-studio.png' },
    ],
    description: 'Conjunto ΣΩΜΑ versão shorts: Top + Shorts coordenados em verde oliva. Ideal para treinos intensos e dias quentes. O corpo em seu estado mais livre.',
    stock: 16,
    features: ['Top ΣΩΜΑ + Shorts ΣΩΜΑ coordenados', 'Logo dourado tonal em silicone em ambas as peças', 'Shorts mid-thigh que não sobe', 'Suporte médio-alto no top', 'Costura flat sem atrito'],
    details: 'Set completo: Top ΣΩΜΑ + Shorts ΣΩΜΑ. Mesma composição e lote. 82% Poliamida, 18% Elastano (top) / 76% Poliamida, 24% Elastano (shorts).',
    washing: 'Lavar à mão com água fria. Remover bojo antes de lavar. Secar à sombra.',
  },
];
