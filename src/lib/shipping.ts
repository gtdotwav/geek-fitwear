// Shipping calculation based on CEP region
// Free shipping above R$299

const FREE_SHIPPING_THRESHOLD = 299;

interface ShippingQuote {
  cost: number;
  estimatedDays: number;
  label: string;
  free: boolean;
}

// CEP ranges by region (first 3 digits)
// SP Capital: 010-098 | SP Interior: 110-199
// RJ: 200-289 | ES: 290-299 | MG: 300-399
// BA: 400-489 | SE: 490-499 | PE: 500-569 | AL: 570-579
// PB: 580-589 | RN: 590-599 | CE: 600-639 | PI: 640-649
// MA: 650-659 | PA: 660-689 | AM: 690-699 | AC/RR/RO/AP: 690-699
// DF: 700-727 | GO: 728-769 | MT: 780-789 | MS: 790-799
// PR: 800-879 | SC: 880-899 | RS: 900-999

function getRegion(cep: string): 'sp' | 'sudeste' | 'sul' | 'centro_oeste' | 'nordeste' | 'norte' {
  const prefix = parseInt(cep.substring(0, 3), 10);

  if (prefix >= 10 && prefix <= 199) return 'sp';
  if ((prefix >= 200 && prefix <= 399)) return 'sudeste';
  if (prefix >= 800 && prefix <= 999) return 'sul';
  if (prefix >= 700 && prefix <= 799) return 'centro_oeste';
  if (prefix >= 400 && prefix <= 659) return 'nordeste';
  if (prefix >= 660 && prefix <= 699) return 'norte';

  return 'sudeste'; // fallback
}

const regionRates: Record<string, { cost: number; days: number }> = {
  sp:             { cost: 0,     days: 3 },
  sudeste:        { cost: 12.90, days: 5 },
  sul:            { cost: 15.90, days: 6 },
  centro_oeste:   { cost: 18.90, days: 7 },
  nordeste:       { cost: 22.90, days: 9 },
  norte:          { cost: 28.90, days: 12 },
};

export function calculateShipping(cep: string, subtotal: number): ShippingQuote {
  const digits = cep.replace(/\D/g, '');
  if (digits.length !== 8) {
    return { cost: 0, estimatedDays: 0, label: 'CEP inválido', free: false };
  }

  const region = getRegion(digits);
  const rate = regionRates[region];

  if (subtotal >= FREE_SHIPPING_THRESHOLD || region === 'sp') {
    return {
      cost: 0,
      estimatedDays: rate.days,
      label: 'Frete grátis',
      free: true,
    };
  }

  return {
    cost: rate.cost,
    estimatedDays: rate.days,
    label: `R$ ${rate.cost.toFixed(2).replace('.', ',')}`,
    free: false,
  };
}

export { FREE_SHIPPING_THRESHOLD };
