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

  // ─── ΑΡΕΤΗ (ARETH) — LINHA PRETA ─────────────────────────────────────────

  {
    id: 'areth-top-preto',
    name: 'Top ΑΡΕΤΗ',
    category: 'Top',
    tag: 'Novo',
    originalPrice: 129,
    pixPrice: 95,
    installments: { count: 12, value: 7.92 },
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
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
    originalPrice: 129,
    pixPrice: 95,
    installments: { count: 12, value: 7.92 },
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
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
    originalPrice: 129,
    pixPrice: 95,
    installments: { count: 12, value: 7.92 },
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
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
    originalPrice: 229,
    pixPrice: 169.90,
    installments: { count: 12, value: 14.16 },
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
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
    originalPrice: 229,
    pixPrice: 169.90,
    installments: { count: 12, value: 14.16 },
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
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
    originalPrice: 129,
    pixPrice: 95,
    installments: { count: 12, value: 7.92 },
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
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
    originalPrice: 129,
    pixPrice: 95,
    installments: { count: 12, value: 7.92 },
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
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
    originalPrice: 129,
    pixPrice: 95,
    installments: { count: 12, value: 7.92 },
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
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
    originalPrice: 229,
    pixPrice: 169.90,
    installments: { count: 12, value: 14.16 },
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
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
    originalPrice: 229,
    pixPrice: 169.90,
    installments: { count: 12, value: 14.16 },
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Verde Oliva', hex: '#5C6B4A', image: '/products/soma/shorts-front.png', backImage: '/products/soma/shorts-studio.png' },
    ],
    description: 'Conjunto ΣΩΜΑ versão shorts: Top + Shorts coordenados em verde oliva. Ideal para treinos intensos e dias quentes. O corpo em seu estado mais livre.',
    stock: 16,
    features: ['Top ΣΩΜΑ + Shorts ΣΩΜΑ coordenados', 'Logo dourado tonal em silicone em ambas as peças', 'Shorts mid-thigh que não sobe', 'Suporte médio-alto no top', 'Costura flat sem atrito'],
    details: 'Set completo: Top ΣΩΜΑ + Shorts ΣΩΜΑ. Mesma composição e lote. 82% Poliamida, 18% Elastano (top) / 76% Poliamida, 24% Elastano (shorts).',
    washing: 'Lavar à mão com água fria. Remover bojo antes de lavar. Secar à sombra.',
  },

  // ─── ΔΥΝΑΜΙΣ (DYNAMIS) — LINHA CREME ───────────────────────────────────────

  {
    id: 'dynamis-top-creme',
    name: 'Top ΔΥΝΑΜΙΣ',
    category: 'Top',
    tag: 'Novo',
    originalPrice: 129,
    pixPrice: 95,
    installments: { count: 12, value: 7.92 },
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Creme', hex: '#E2D6C6', image: '/products/dynamis/set-shorts-arms.png', backImage: '/products/dynamis/set-grid.png' },
    ],
    description: 'O top essencial da linha ΔΥΝΑΜΙΣ. Suporte médio-alto com faixa inferior com logo ΔΥΝΑΜΙΣ em relevo tonal. Design scoop neck com alças largas para estabilidade absoluta. A força no seu estado mais puro.',
    stock: 20,
    features: ['Suporte médio-alto', 'Bojo removível', 'Alças largas estabilizadoras', 'Logo ΔΥΝΑΜΙΣ em relevo tonal na faixa', 'Tecido segunda pele ultra-macio'],
    details: 'Composição: 82% Poliamida, 18% Elastano. Faixa inferior com logo em silicone tonal. Bojo EVA destacável. Costura ultraplana.',
    washing: 'Lavar à mão com água fria. Remover bojo antes de lavar. Não usar alvejante. Secar à sombra.',
  },

  {
    id: 'dynamis-shorts-creme',
    name: 'Shorts ΔΥΝΑΜΙΣ',
    category: 'Shorts',
    tag: 'Novo',
    originalPrice: 129,
    pixPrice: 95,
    installments: { count: 12, value: 7.92 },
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Creme', hex: '#E2D6C6', image: '/products/dynamis/shorts-front.png', backImage: '/products/dynamis/shorts-studio.png' },
    ],
    description: 'Shorts de cintura alta da linha ΔΥΝΑΜΙΣ em creme. Comprimento mid-thigh com logo ΔΥΝΑΜΙΣ discreto no cós. Compressão modeladora que libera a força de cada movimento.',
    stock: 18,
    features: ['Cintura alta modeladora', 'Logo ΔΥΝΑΜΙΣ no cós', 'Comprimento mid-thigh', 'Não sobe durante o treino', 'Tecido Sculpting 4-Way Stretch'],
    details: 'Composição: 76% Poliamida, 24% Elastano. Cós duplo de 8cm com logo em silicone tonal. Comprimento 15cm de entrepernas. Costura flat.',
    washing: 'Lavar à mão ou máquina com água fria. Não usar alvejante. Secar à sombra. Não torcer.',
  },

  {
    id: 'dynamis-legging-creme',
    name: 'Legging ΔΥΝΑΜΙΣ',
    category: 'Legging',
    tag: 'Novo',
    originalPrice: 129,
    pixPrice: 95,
    installments: { count: 12, value: 7.92 },
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Creme', hex: '#E2D6C6', image: '/products/dynamis/legging-front.png', backImage: '/products/dynamis/legging-walk.png' },
    ],
    description: 'Legging full-length da linha ΔΥΝΑΜΙΣ em creme. Cintura alta com logo ΔΥΝΑΜΙΣ no cós, compressão sculpting que modela e potencializa cada movimento. A força em sua forma mais elegante.',
    stock: 22,
    features: ['Cintura alta modeladora 10cm', 'Logo ΔΥΝΑΜΙΣ no cós', 'Compressão Sculpting 4-Way Stretch', 'Não fica transparente', 'Secagem ultrarrápida'],
    details: 'Composição: 76% Poliamida, 24% Elastano. Cós duplo com logo em silicone tonal. Comprimento full-length. Costura ultraplana sem atrito.',
    washing: 'Lavar à mão ou máquina com água fria. Não usar alvejante. Não torcer. Secar à sombra.',
  },

  {
    id: 'dynamis-set-legging-creme',
    name: 'Set ΔΥΝΑΜΙΣ Completo',
    category: 'Set',
    tag: 'Novo',
    originalPrice: 229,
    pixPrice: 169.90,
    installments: { count: 12, value: 14.16 },
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Creme', hex: '#E2D6C6', image: '/products/dynamis/legging-walk.png', backImage: '/products/dynamis/set-grid.png' },
    ],
    description: 'O conjunto completo ΔΥΝΑΜΙΣ: Top + Legging coordenados em creme. Logo tonal em ambas as peças. A simetria perfeita entre força e movimento. Feito para quem busca potência.',
    stock: 15,
    features: ['Top ΔΥΝΑΜΙΣ + Legging ΔΥΝΑΜΙΣ coordenados', 'Logo tonal em silicone em ambas as peças', 'Tecido Sculpting 4-Way Stretch', 'Cintura alta modeladora', 'Bojo removível no top'],
    details: 'Set completo: Top ΔΥΝΑΜΙΣ + Legging ΔΥΝΑΜΙΣ. Mesma composição e lote de tingimento. 82% Poliamida, 18% Elastano (top) / 76% Poliamida, 24% Elastano (legging).',
    washing: 'Lavar à mão com água fria. Remover bojo antes de lavar. Secar à sombra. Não usar amaciante.',
  },

  {
    id: 'dynamis-set-shorts-creme',
    name: 'Set ΔΥΝΑΜΙΣ Shorts',
    category: 'Set',
    tag: 'Novo',
    originalPrice: 229,
    pixPrice: 169.90,
    installments: { count: 12, value: 14.16 },
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Creme', hex: '#E2D6C6', image: '/products/dynamis/set-shorts-front-side.png', backImage: '/products/dynamis/shorts-grid.png' },
    ],
    description: 'Conjunto ΔΥΝΑΜΙΣ versão shorts: Top + Shorts coordenados em creme. Ideal para treinos de alta intensidade e dias quentes. A força em seu estado mais livre.',
    stock: 16,
    features: ['Top ΔΥΝΑΜΙΣ + Shorts ΔΥΝΑΜΙΣ coordenados', 'Logo tonal em silicone em ambas as peças', 'Shorts mid-thigh que não sobe', 'Suporte médio-alto no top', 'Costura flat sem atrito'],
    details: 'Set completo: Top ΔΥΝΑΜΙΣ + Shorts ΔΥΝΑΜΙΣ. Mesma composição e lote. 82% Poliamida, 18% Elastano (top) / 76% Poliamida, 24% Elastano (shorts).',
    washing: 'Lavar à mão com água fria. Remover bojo antes de lavar. Secar à sombra.',
  },

  // ─── ΚΙΝΗΣΙΣ (KINISIS) — LINHA TERRACOTA ────────────────────────────────────

  {
    id: 'kinisis-top-terracota',
    name: 'Top ΚΙΝΗΣΙΣ',
    category: 'Top',
    tag: 'Novo',
    originalPrice: 129,
    pixPrice: 95,
    installments: { count: 12, value: 7.92 },
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Terracota', hex: '#B8654A', image: '/products/kinisis/shorts-front.png', backImage: '/products/kinisis/shorts-side.png' },
    ],
    description: 'O top essencial da linha ΚΙΝΗΣΙΣ. Suporte médio-alto com faixa inferior com logo ΚΙΝΗΣΙΣ em relevo tonal. Design scoop neck com alças largas para estabilidade absoluta. O movimento no seu estado mais puro.',
    stock: 20,
    features: ['Suporte médio-alto', 'Bojo removível', 'Alças largas estabilizadoras', 'Logo ΚΙΝΗΣΙΣ em relevo tonal na faixa', 'Tecido segunda pele ultra-macio'],
    details: 'Composição: 82% Poliamida, 18% Elastano. Faixa inferior com logo em silicone tonal. Bojo EVA destacável. Costura ultraplana.',
    washing: 'Lavar à mão com água fria. Remover bojo antes de lavar. Não usar alvejante. Secar à sombra.',
  },

  {
    id: 'kinisis-shorts-terracota',
    name: 'Shorts ΚΙΝΗΣΙΣ',
    category: 'Shorts',
    tag: 'Novo',
    originalPrice: 129,
    pixPrice: 95,
    installments: { count: 12, value: 7.92 },
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Terracota', hex: '#B8654A', image: '/products/kinisis/shorts-crouch.png', backImage: '/products/kinisis/shorts-walk.png' },
    ],
    description: 'Shorts de cintura alta da linha ΚΙΝΗΣΙΣ em terracota. Comprimento mid-thigh com logo ΚΙΝΗΣΙΣ discreto no cós. Compressão modeladora que libera a fluidez de cada movimento.',
    stock: 18,
    features: ['Cintura alta modeladora', 'Logo ΚΙΝΗΣΙΣ no cós', 'Comprimento mid-thigh', 'Não sobe durante o treino', 'Tecido Sculpting 4-Way Stretch'],
    details: 'Composição: 76% Poliamida, 24% Elastano. Cós duplo de 8cm com logo em silicone tonal. Comprimento 15cm de entrepernas. Costura flat.',
    washing: 'Lavar à mão ou máquina com água fria. Não usar alvejante. Secar à sombra. Não torcer.',
  },

  {
    id: 'kinisis-legging-terracota',
    name: 'Legging ΚΙΝΗΣΙΣ',
    category: 'Legging',
    tag: 'Novo',
    originalPrice: 129,
    pixPrice: 95,
    installments: { count: 12, value: 7.92 },
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Terracota', hex: '#B8654A', image: '/products/kinisis/legging-stretch.png', backImage: '/products/kinisis/set-grid.png' },
    ],
    description: 'Legging full-length da linha ΚΙΝΗΣΙΣ em terracota. Cintura alta com logo ΚΙΝΗΣΙΣ no cós, compressão sculpting que modela e acompanha cada movimento. O movimento em sua forma mais elegante.',
    stock: 22,
    features: ['Cintura alta modeladora 10cm', 'Logo ΚΙΝΗΣΙΣ no cós', 'Compressão Sculpting 4-Way Stretch', 'Não fica transparente', 'Secagem ultrarrápida'],
    details: 'Composição: 76% Poliamida, 24% Elastano. Cós duplo com logo em silicone tonal. Comprimento full-length. Costura ultraplana sem atrito.',
    washing: 'Lavar à mão ou máquina com água fria. Não usar alvejante. Não torcer. Secar à sombra.',
  },

  {
    id: 'kinisis-set-legging-terracota',
    name: 'Set ΚΙΝΗΣΙΣ Completo',
    category: 'Set',
    tag: 'Novo',
    originalPrice: 229,
    pixPrice: 169.90,
    installments: { count: 12, value: 14.16 },
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Terracota', hex: '#B8654A', image: '/products/kinisis/legging-stretch.png', backImage: '/products/kinisis/set-grid.png' },
    ],
    description: 'O conjunto completo ΚΙΝΗΣΙΣ: Top + Legging coordenados em terracota. Logo tonal em ambas as peças. A simetria perfeita entre fluidez e movimento. Feito para quem busca liberdade.',
    stock: 15,
    features: ['Top ΚΙΝΗΣΙΣ + Legging ΚΙΝΗΣΙΣ coordenados', 'Logo tonal em silicone em ambas as peças', 'Tecido Sculpting 4-Way Stretch', 'Cintura alta modeladora', 'Bojo removível no top'],
    details: 'Set completo: Top ΚΙΝΗΣΙΣ + Legging ΚΙΝΗΣΙΣ. Mesma composição e lote de tingimento. 82% Poliamida, 18% Elastano (top) / 76% Poliamida, 24% Elastano (legging).',
    washing: 'Lavar à mão com água fria. Remover bojo antes de lavar. Secar à sombra. Não usar amaciante.',
  },

  {
    id: 'kinisis-set-shorts-terracota',
    name: 'Set ΚΙΝΗΣΙΣ Shorts',
    category: 'Set',
    tag: 'Novo',
    originalPrice: 229,
    pixPrice: 169.90,
    installments: { count: 12, value: 14.16 },
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Terracota', hex: '#B8654A', image: '/products/kinisis/shorts-front.png', backImage: '/products/kinisis/shorts-grid.png' },
    ],
    description: 'Conjunto ΚΙΝΗΣΙΣ versão shorts: Top + Shorts coordenados em terracota. Ideal para treinos de alta intensidade e dias quentes. O movimento em seu estado mais livre.',
    stock: 16,
    features: ['Top ΚΙΝΗΣΙΣ + Shorts ΚΙΝΗΣΙΣ coordenados', 'Logo tonal em silicone em ambas as peças', 'Shorts mid-thigh que não sobe', 'Suporte médio-alto no top', 'Costura flat sem atrito'],
    details: 'Set completo: Top ΚΙΝΗΣΙΣ + Shorts ΚΙΝΗΣΙΣ. Mesma composição e lote. 82% Poliamida, 18% Elastano (top) / 76% Poliamida, 24% Elastano (shorts).',
    washing: 'Lavar à mão com água fria. Remover bojo antes de lavar. Secar à sombra.',
  },
];
