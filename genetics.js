// ===============================
// TIPOS DE GENES
// ===============================
const GENE_TYPES = {
  RECESSIVE: "recessive",
  CODOMINANT: "codominant",
  DOMINANT: "dominant"
};

// ===============================
// DEFINICIÓN DE GENES
// ===============================
const GENES = {
  tremper: { name: "Tremper Albino", type: GENE_TYPES.RECESSIVE },
  bell: { name: "Bell Albino", type: GENE_TYPES.RECESSIVE },
  rainwater: { name: "Rainwater Albino", type: GENE_TYPES.RECESSIVE },

  eclipse: { name: "Eclipse", type: GENE_TYPES.RECESSIVE },

  blizzard: { name: "Blizzard", type: GENE_TYPES.RECESSIVE },
  murphy: { name: "Murphy Patternless", type: GENE_TYPES.RECESSIVE },

  mack_snow: { name: "Mack Snow", type: GENE_TYPES.CODOMINANT },
  giant: { name: "Giant / Super Giant", type: GENE_TYPES.CODOMINANT },

  white_yellow: { name: "White & Yellow", type: GENE_TYPES.DOMINANT },
  enigma: { name: "Enigma", type: GENE_TYPES.DOMINANT }
};

// ===============================
// ESTADO → ALELOS
// ===============================
function stateToAlleles(type, state) {
  if (type === GENE_TYPES.RECESSIVE) {
    if (state === "normal") return ["A", "A"];
    if (state === "het") return ["A", "a"];
    if (state === "visual") return ["a", "a"];
  }

  if (type === GENE_TYPES.CODOMINANT) {
    if (state === "normal") return ["A", "A"];
    if (state === "het") return ["A", "a"];
    if (state === "super") return ["a", "a"];
  }

  if (type === GENE_TYPES.DOMINANT) {
    if (state === "normal") return ["A", "A"];
    if (state === "visual") return ["A", "a"];
  }

  throw new Error("Estado genético inválido");
}

// ===============================
// CRUCE DE ALELOS (PUNNETT)
// ===============================
function cruzarAlelos(alelosPadre, alelosMadre) {
  let resultados = {};

  for (let a of alelosPadre) {
    for (let b of alelosMadre) {
      const combo = [a, b].sort().join("");
      resultados[combo] = (resultados[combo] || 0) + 25;
    }
  }

  return resultados;
}

// ===============================
// INTERPRETACIÓN DEL RESULTADO
// ===============================
function interpretarResultado(type, combinaciones) {
  let salida = { normal: 0, het: 0, visual: 0, super: 0 };

  for (let combo in combinaciones) {
    const pct = combinaciones[combo];

    if (type === GENE_TYPES.RECESSIVE) {
      if (combo === "AA") salida.normal += pct;
      if (combo === "Aa") salida.het += pct;
      if (combo === "aa") salida.visual += pct;
    }

    if (type === GENE_TYPES.CODOMINANT) {
      if (combo === "AA") salida.normal += pct;
      if (combo === "Aa") salida.het += pct;
      if (combo === "aa") salida.super += pct;
    }

    if (type === GENE_TYPES.DOMINANT) {
      if (combo === "AA") salida.normal += pct;
      if (combo === "Aa" || combo === "aa") salida.visual += pct;
    }
  }

  return salida;
}

// ===============================
// FUNCIÓN FINAL POR GEN
// ===============================
function calcularGen(genId, estadoPadre, estadoMadre) {
  const gen = GENES[genId];
  if (!gen) throw new Error("Gen no definido");

  const alelosPadre = stateToAlleles(gen.type, estadoPadre);
  const alelosMadre = stateToAlleles(gen.type, estadoMadre);

  const combinaciones = cruzarAlelos(alelosPadre, alelosMadre);
  const resultado = interpretarResultado(gen.type, combinaciones);

  return {
    gen: gen.name,
    combinaciones,
    resultado
  };
}

// ===============================
// HETS PROBABLES (66% / 50%)
// ===============================
function calcularHetProbable(probPadre, probMadre) {
  const pPadre = probPadre ? probPadre * 0.5 : 0;
  const pMadre = probMadre ? probMadre * 0.5 : 0;
  return pPadre + pMadre;
}
