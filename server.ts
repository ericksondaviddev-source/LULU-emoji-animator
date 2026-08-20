import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Shared Gemini AI client initialized safely
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    return null;
  }
  try {
    return new GoogleGenAI({ apiKey });
  } catch (_err) {
    return null;
  }
}

// -------------------------------------------------------------
// INTELLIGENT RULE-BASED FALLBACK GENERATOR (ZERO-FAIL ENGINE)
// -------------------------------------------------------------
function fallbackGenerateCharacter(prompt: string, is916: boolean) {
  const text = prompt.toLowerCase();
  const centerX = 540;
  const centerY = is916 ? 960 : 540;

  let projectName = "Emoji Amigo";
  let explanation = "¡Personaje diseñado con combinaciones armoniosas y colores vibrantes!";
  let backgroundColor = "#1E293B";
  let suggestedCaption = "¡Hola! Estoy listo para animar.";

  let basePieceId = "base-classic-circle";
  let baseColor = "#FACC15";
  let baseDepth = 18;

  let eyesPieceId = "eyes-googly";
  let eyesColor = "#1E293B";
  let eyesYOffset = -40;

  let mouthPieceId = "mouth-open-laugh";
  let mouthColor = "#EF4444";
  let mouthYOffset = 65;

  let extraPieceId: string | null = null;
  let extraColor = "#FACC15";
  let extraYOffset = -135;
  let extraScale = 1.05;

  let secondExtraPieceId: string | null = null;
  let secondExtraColor = "#FB7185";
  let secondExtraYOffset = 30;

  if (text.includes("pirat") || text.includes("barco") || text.includes("tesoro")) {
    projectName = "Gatito Pirata Aventurero";
    explanation = "¡Un temible y tierno pirata de los siete mares con sombrero de capitán y sonrisa pícara!";
    backgroundColor = "#0F172A";
    suggestedCaption = "¡Al abordaje! En busca del gran tesoro 🏴‍☠️";
    basePieceId = "base-cat";
    baseColor = "#FB923C";
    eyesPieceId = "eyes-winking";
    mouthPieceId = "mouth-smirk";
    extraPieceId = "extra-pirate-hat";
    extraColor = "#1E293B";
    extraYOffset = -140;
    secondExtraPieceId = "extra-cat-whiskers";
    secondExtraColor = "#1E293B";
    secondExtraYOffset = 50;
  } else if (text.includes("alien") || text.includes("extraterrestre") || text.includes("ovni") || text.includes("espaci")) {
    projectName = "Alien Galáctico Feliz";
    explanation = "¡Un simpático ser intergaláctico de piel verde menta y brillo estelar!";
    backgroundColor = "#1E1B4B";
    suggestedCaption = "¡Venimos en son de paz y diversión! 🛸✨";
    basePieceId = "base-alien";
    baseColor = "#4ADE80";
    eyesPieceId = "eyes-stars";
    mouthPieceId = "mouth-wide-grin";
    extraPieceId = "extra-sparkle-stars";
    extraColor = "#FACC15";
    extraYOffset = -120;
  } else if (text.includes("robot") || text.includes("cyborg") || text.includes("gamer") || text.includes("futur")) {
    projectName = "Robot Gamer 3000";
    explanation = "¡Un androide con audífonos de alta fidelidad y mirada cibernética!";
    backgroundColor = "#0F172A";
    suggestedCaption = "¡Bip Bop! Cargando nueva partida 🎮🤖";
    basePieceId = "base-robot";
    baseColor = "#60A5FA";
    eyesPieceId = "eyes-cyborg-laser";
    mouthPieceId = "mouth-zipper";
    extraPieceId = "extra-headphones";
    extraColor = "#F43F5E";
    extraYOffset = -40;
    extraScale = 1.15;
  } else if (text.includes("diabl") || text.includes("demon") || text.includes("fuego") || text.includes("malo")) {
    projectName = "Diablito Travieso";
    explanation = "¡Un diablito simpático de color carmín con colmillos y cuernos puntiagudos!";
    backgroundColor = "#18181B";
    suggestedCaption = "¡Haciendo travesuras sin parar! 🔥😈";
    basePieceId = "base-devil";
    baseColor = "#EF4444";
    eyesPieceId = "eyes-fire";
    mouthPieceId = "mouth-vampire-fangs";
    secondExtraPieceId = "shape-fire-flame";
    secondExtraColor = "#F97316";
    secondExtraYOffset = -140;
  } else if (text.includes("princes") || text.includes("reina") || text.includes("coron") || text.includes("magic")) {
    projectName = "Princesa de Ensueño";
    explanation = "¡Una hermosa princesa con corona dorada brillante y ojos de estrellas!";
    backgroundColor = "#4A044E";
    suggestedCaption = "¡Un saludo mágico a todo mi reino! 👑💖";
    basePieceId = "base-heart";
    baseColor = "#F472B6";
    eyesPieceId = "eyes-anime-sparkle";
    mouthPieceId = "mouth-kiss-lips";
    extraPieceId = "extra-crown-gold";
    extraColor = "#FACC15";
    extraYOffset = -135;
    secondExtraPieceId = "extra-blush-cheeks";
    secondExtraColor = "#FB7185";
    secondExtraYOffset = 30;
  } else if (text.includes("vaquer") || text.includes("cowboy") || text.includes("oeste") || text.includes("sheriff")) {
    projectName = "Sheriff del Lejano Oeste";
    explanation = "¡Un valiente vaquero con sombrero texano y gran bigote!";
    backgroundColor = "#3F2E18";
    suggestedCaption = "¡Yeehaw! Este pueblo es el más alegre 🤠🌵";
    basePieceId = "base-classic-circle";
    baseColor = "#FACC15";
    eyesPieceId = "eyes-winking";
    mouthPieceId = "mouth-mustache";
    extraPieceId = "extra-cowboy-hat";
    extraColor = "#854D0E";
    extraYOffset = -140;
    extraScale = 1.1;
  } else if (text.includes("calabaz") || text.includes("halloween") || text.includes("miedo") || text.includes("terror")) {
    projectName = "Calabaza de Fiesta";
    explanation = "¡Una calabaza animada con sombrero festivo y sonrisa luminosa!";
    backgroundColor = "#18181B";
    suggestedCaption = "¡Dulce o travesura divertida! 🎃🍬";
    basePieceId = "base-pumpkin";
    baseColor = "#FB923C";
    eyesPieceId = "eyes-fire";
    mouthPieceId = "mouth-vampire-fangs";
    extraPieceId = "extra-party-hat";
    extraColor = "#EC4899";
    extraYOffset = -130;
  } else if (text.includes("fantasm") || text.includes("ghost")) {
    projectName = "Fantasmita Tierno";
    explanation = "¡Un fantasma flotante muy dulce con mejillas sonrojadas!";
    backgroundColor = "#09090B";
    suggestedCaption = "¡Booo! Pero con mucho cariño 👻❤️";
    basePieceId = "base-ghost";
    baseColor = "#F8FAFC";
    eyesPieceId = "eyes-cute-kawaii";
    mouthPieceId = "mouth-shock-gasp";
    secondExtraPieceId = "extra-blush-cheeks";
    secondExtraColor = "#FDA4AF";
    secondExtraYOffset = 25;
  } else if (text.includes("oso") || text.includes("panda") || text.includes("polar")) {
    const isPanda = text.includes("panda");
    projectName = isPanda ? "Oso Panda Comilón" : "Osito Amoroso";
    explanation = "¡Un tierno osito con orejitas redondas y mirada alegre!";
    backgroundColor = "#14532D";
    suggestedCaption = "¡Un gran abrazo suave para ti! 🐻🎋";
    basePieceId = isPanda ? "base-panda" : "base-bear";
    baseColor = isPanda ? "#FFFFFF" : "#A16207";
    eyesPieceId = "eyes-anime-sparkle";
    mouthPieceId = "mouth-open-laugh";
    secondExtraPieceId = "extra-blush-cheeks";
    secondExtraColor = "#FDA4AF";
    secondExtraYOffset = 30;
  } else if (text.includes("payaso") || text.includes("clown") || text.includes("circo")) {
    projectName = "Payasito Saltarín";
    explanation = "¡Un simpático payaso de circo con peluca colorida y corneta de fiesta!";
    backgroundColor = "#581C87";
    suggestedCaption = "¡El show más divertido va a comenzar! 🎪🤡";
    basePieceId = "base-clown";
    baseColor = "#FACC15";
    eyesPieceId = "eyes-swirl-dizzy";
    mouthPieceId = "mouth-party-horn";
    extraPieceId = "extra-clown-wig";
    extraColor = "#3B82F6";
    extraYOffset = -130;
  } else if (text.includes("amor") || text.includes("corazon") || text.includes("tierno") || text.includes("enamorad")) {
    projectName = "Corazón Enamorado";
    explanation = "¡Un personaje lleno de romance con ojos de corazones brillantes y beso!";
    backgroundColor = "#831843";
    suggestedCaption = "¡Te mando un beso volador! 💖😘";
    basePieceId = "base-heart";
    baseColor = "#FB7185";
    eyesPieceId = "eyes-hearts";
    mouthPieceId = "mouth-kiss-lips";
    secondExtraPieceId = "extra-blush-cheeks";
    secondExtraColor = "#F43F5E";
    secondExtraYOffset = 30;
  } else if (text.includes("enojad") || text.includes("furia") || text.includes("molest")) {
    projectName = "Furia Explosiva";
    explanation = "¡Un emoji furioso que echa humo por la cabeza pero sigue viéndose simpático!";
    backgroundColor = "#450A0A";
    suggestedCaption = "¡¿Quién se comió mi pedazo de pastel?! 😡🔥";
    basePieceId = "base-classic-circle";
    baseColor = "#EF4444";
    eyesPieceId = "eyes-angry";
    mouthPieceId = "mouth-screaming";
    extraPieceId = "shape-fire-flame";
    extraColor = "#F97316";
    extraYOffset = -130;
  } else {
    // Default vibrant party emoji
    projectName = "Emoji de Fiesta Radiante";
    explanation = "¡Un personaje festivo y alegre con gorrito de fiesta y ojos saltarines!";
    backgroundColor = "#1E293B";
    suggestedCaption = "¡A celebrar y divertirse al máximo! 🎉🥳";
    basePieceId = "base-classic-circle";
    baseColor = "#FACC15";
    eyesPieceId = "eyes-googly";
    mouthPieceId = "mouth-wide-grin";
    extraPieceId = "extra-party-hat";
    extraColor = "#EC4899";
    extraYOffset = -135;
    secondExtraPieceId = "extra-blush-cheeks";
    secondExtraColor = "#FB7185";
    secondExtraYOffset = 30;
  }

  const layers: any[] = [
    {
      pieceId: basePieceId,
      name: "Base de la cara",
      x: centerX,
      y: centerY,
      scale: 1.0,
      rotation: 0,
      color: baseColor,
      depth: baseDepth,
    },
    {
      pieceId: eyesPieceId,
      name: "Ojos expresivos",
      x: centerX,
      y: centerY + eyesYOffset,
      scale: 1.0,
      rotation: 0,
      color: eyesColor,
      depth: 14,
    },
    {
      pieceId: mouthPieceId,
      name: "Boca divertida",
      x: centerX,
      y: centerY + mouthYOffset,
      scale: 0.95,
      rotation: 0,
      color: mouthColor,
      depth: 14,
    },
  ];

  if (extraPieceId) {
    layers.push({
      pieceId: extraPieceId,
      name: "Accesorio principal",
      x: centerX,
      y: centerY + extraYOffset,
      scale: extraScale,
      rotation: 0,
      color: extraColor,
      depth: 18,
    });
  }

  if (secondExtraPieceId) {
    layers.push({
      pieceId: secondExtraPieceId,
      name: "Detalle decorativo",
      x: centerX,
      y: centerY + secondExtraYOffset,
      scale: 0.9,
      rotation: 0,
      color: secondExtraColor,
      depth: 12,
    });
  }

  return {
    projectName,
    explanation,
    backgroundColor,
    suggestedCaption,
    layers,
  };
}

function fallbackGenerateAnimation(prompt: string, layers: any[], duration: number) {
  const text = prompt.toLowerCase();
  let animationTitle = "Baile Rítmico Divertido";
  let explanation = "¡Coreografía balanceada con rebotes elásticos y giros expresivos!";

  const t0 = 0;
  const t1 = Number((duration * 0.25).toFixed(2));
  const t2 = Number((duration * 0.5).toFixed(2));
  const t3 = Number((duration * 0.75).toFixed(2));
  const t4 = Number(duration.toFixed(2));

  // Determine physics motion style
  let isJumpBounce = true;
  let maxAngle = 18;
  let jumpDistance = -40;
  let stretchX = 1.15;
  let squashY = 0.85;

  if (text.includes("risa") || text.includes("carcajada") || text.includes("chiste")) {
    animationTitle = "Ataque de Risa Cómica";
    explanation = "¡Vibración de risa rápida con temblor de boca y ojos felices!";
    maxAngle = 8;
    jumpDistance = -15;
    stretchX = 1.08;
    squashY = 0.92;
  } else if (text.includes("susto") || text.includes("sorpresa") || text.includes("salto")) {
    animationTitle = "Susto Cómico y Reacción";
    explanation = "¡Un brinco asustadizo hacia arriba con agrandamiento de ojos!";
    maxAngle = -12;
    jumpDistance = -70;
    stretchX = 0.9;
    squashY = 1.25;
  } else if (text.includes("latido") || text.includes("amor") || text.includes("corazon")) {
    animationTitle = "Latido Amoroso Suave";
    explanation = "¡Efecto de pulso continuo con expansión y balanceo tierno!";
    maxAngle = 6;
    jumpDistance = -10;
    stretchX = 1.2;
    squashY = 1.2;
  } else if (text.includes("despegue") || text.includes("volar") || text.includes("cohete")) {
    animationTitle = "Despegue Espacial Cohete";
    explanation = "¡Impulso ascendente con giro y regreso en caída suave!";
    maxAngle = 25;
    jumpDistance = -90;
    stretchX = 0.85;
    squashY = 1.3;
  } else if (text.includes("mareo") || text.includes("gir") || text.includes("vuelta")) {
    animationTitle = "Giro 360 y Bamboleo";
    explanation = "¡Giro de 360 grados continuo con desaceleración elástica!";
    maxAngle = 180;
    jumpDistance = -20;
    stretchX = 1.1;
    squashY = 0.95;
  }

  const kf0Transforms: any[] = [];
  const kf1Transforms: any[] = [];
  const kf2Transforms: any[] = [];
  const kf3Transforms: any[] = [];
  const kf4Transforms: any[] = [];

  layers.forEach((l) => {
    const origX = l.x ?? 540;
    const origY = l.y ?? 960;
    const origScaleX = Math.abs(l.scaleX ?? 1);
    const origScaleY = l.scaleY ?? 1;
    const origRot = l.rotation ?? 0;
    const isBase = l.category === "bases";

    // Keyframe 0 (t=0) - Neutral
    kf0Transforms.push({
      layerId: l.id,
      x: origX,
      y: origY,
      scaleX: origScaleX,
      scaleY: origScaleY,
      rotation: origRot,
      opacity: 1,
    });

    // Keyframe 1 (t=0.25) - Squash & Tilt Left
    kf1Transforms.push({
      layerId: l.id,
      x: origX - (isBase ? 15 : 12),
      y: origY + (isBase ? 10 : 6),
      scaleX: Number((origScaleX * stretchX).toFixed(2)),
      scaleY: Number((origScaleY * squashY).toFixed(2)),
      rotation: origRot - maxAngle,
      opacity: 1,
    });

    // Keyframe 2 (t=0.50) - Apex Jump & Stretch Up
    kf2Transforms.push({
      layerId: l.id,
      x: origX,
      y: origY + jumpDistance,
      scaleX: Number((origScaleX * squashY).toFixed(2)),
      scaleY: Number((origScaleY * stretchX).toFixed(2)),
      rotation: origRot,
      opacity: 1,
    });

    // Keyframe 3 (t=0.75) - Land & Tilt Right
    kf3Transforms.push({
      layerId: l.id,
      x: origX + (isBase ? 15 : 12),
      y: origY + (isBase ? 10 : 6),
      scaleX: Number((origScaleX * stretchX).toFixed(2)),
      scaleY: Number((origScaleY * squashY).toFixed(2)),
      rotation: origRot + maxAngle,
      opacity: 1,
    });

    // Keyframe 4 (t=duration) - Return to Neutral Loop
    kf4Transforms.push({
      layerId: l.id,
      x: origX,
      y: origY,
      scaleX: origScaleX,
      scaleY: origScaleY,
      rotation: origRot,
      opacity: 1,
    });
  });

  return {
    animationTitle,
    explanation,
    keyframes: [
      { time: t0, layerTransforms: kf0Transforms },
      { time: t1, layerTransforms: kf1Transforms },
      { time: t2, layerTransforms: kf2Transforms },
      { time: t3, layerTransforms: kf3Transforms },
      { time: t4, layerTransforms: kf4Transforms },
    ],
  };
}

function fallbackGenerateDialogues(description: string) {
  const text = (description || "").toLowerCase();
  if (text.includes("pirat")) {
    return [
      { phrase: "¡Arrr marinero! ¿Dónde escondiste mi mapa del tesoro?", tone: "Voz de pirata ronca y graciosa" },
      { phrase: "¡Por las barbas de Neptuno, este video va a ser viral!", tone: "Grito entusiasmado con risa" },
      { phrase: "¡Zarpamos rumbo a la isla de las bananas mágicas!", tone: "Tono aventurero heroico" },
      { phrase: "¡Un momento... olvidé dónde estacioné mi barco pirata!", tone: "Susurro confundido y cómico" },
    ];
  } else if (text.includes("alien") || text.includes("espaci")) {
    return [
      { phrase: "¡Saludos humanos terrestres! Venimos por sus pizzas.", tone: "Voz robótica alienígena" },
      { phrase: "¡Nuestra nave espacial funciona con emojis felices!", tone: "Tono agudo y divertido" },
      { phrase: "¡Alerta en la galaxia! Nivel de ternura al 100%.", tone: "Voz de computadora espacial" },
      { phrase: "¡No toquen ese botón rojo cósmico... bueno, solo una vez!", tone: "Risa cómplice" },
    ];
  } else if (text.includes("robot") || text.includes("gamer")) {
    return [
      { phrase: "¡Bip Bop! Subiendo de nivel en tres, dos, uno...", tone: "Voz electrónica de videojuego" },
      { phrase: "¡Error 404: La pereza no fue encontrada en mi sistema!", tone: "Tono de locutor enérgico" },
      { phrase: "¡Mis circuitos indican que este video merece un like!", tone: "Voz computarizada alegre" },
      { phrase: "¡Activando propulsores de fiesta inmediata!", tone: "Efecto de sirena y festejo" },
    ];
  }

  return [
    { phrase: "¡Hola a todos! ¡Miren lo genial que me veo en 3D!", tone: "Voz súper entusiasta y animada" },
    { phrase: "¡No pararé de bailar hasta que termine este Short!", tone: "Ritmo musical cantarín" },
    { phrase: "¡Dale al corazoncito si te gustó mi animación!", tone: "Tono dulce y simpático" },
    { phrase: "¡Espera hasta el final para ver mi mejor truco!", tone: "Susurro de misterio con remate gracioso" },
  ];
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", geminiReady: !!process.env.GEMINI_API_KEY });
  });

  // 1. AI Character Generator Endpoint
  app.post("/api/gemini/generate-character", async (req, res) => {
    const { prompt = "", aspectRatio = "9:16" } = req.body;
    const is916 = aspectRatio === "9:16";
    const centerX = 540;
    const centerY = is916 ? 960 : 540;

    const ai = getGeminiClient();

    if (ai && prompt.trim()) {
      try {
        const systemPrompt = `
Eres un diseñador experto de personajes emoji y stickers divertidos para niños y creadores de contenido (YouTube Shorts y TikTok).
Tu tarea es interpretar la descripción del usuario y ensamblar un personaje completo seleccionando piezas de nuestra biblioteca disponible.

La pantalla tiene dimensiones ${is916 ? "1080x1920 (vertical 9:16)" : "1080x1080 (cuadrado 1:1)"}. El centro de la cara está en x=${centerX}, y=${centerY}.

PIEZAS DISPONIBLES EN LA BIBLIOTECA:
- BASES (id empieza con 'base-'):
  'base-classic-circle', 'base-smooth-circle', 'base-squircle', 'base-heart', 'base-devil', 'base-cat', 'base-alien', 'base-robot', 'base-bear', 'base-pig', 'base-panda', 'base-ghost', 'base-pumpkin', 'base-skull', 'base-clown'
- OJOS (id empieza con 'eyes-'):
  'eyes-googly', 'eyes-anime-sparkle', 'eyes-stars', 'eyes-hearts', 'eyes-sleepy', 'eyes-side-glance', 'eyes-winking', 'eyes-crying-happy', 'eyes-swirl-dizzy', 'eyes-sunglasses-cool', 'eyes-angry', 'eyes-surprised-dot', 'eyes-cyborg-laser', 'eyes-money-dollar', 'eyes-fire', 'eyes-cute-kawaii', 'eyes-spiral-hypno', 'eyes-nerd-glasses', 'eyes-monocle', 'eyes-vr-headset'
- BOCAS (id empieza con 'mouth-'):
  'mouth-wide-grin', 'mouth-open-laugh', 'mouth-tongue-out', 'mouth-smirk', 'mouth-shock-gasp', 'mouth-kiss-lips', 'mouth-vampire-fangs', 'mouth-zipper', 'mouth-mustache', 'mouth-buck-teeth', 'mouth-screaming', 'mouth-sad-frown', 'mouth-bubblegum-blow', 'mouth-smoking-pipe', 'mouth-whistling', 'mouth-cigar', 'mouth-beaming-teeth', 'mouth-cat-mouth-3', 'mouth-drooling', 'mouth-party-horn'
- EXTRAS / ACCESORIOS (id empieza con 'extra-'):
  'extra-pirate-hat', 'extra-crown-gold', 'extra-party-hat', 'extra-devil-horns-accessory', 'extra-angel-halo', 'extra-blush-cheeks', 'extra-sweat-drop', 'extra-tears-stream', 'extra-sparkle-stars', 'extra-chef-hat', 'extra-cowboy-hat', 'extra-viking-helmet', 'extra-headband-ninja', 'extra-clown-wig', 'extra-detective-hat', 'extra-headphones', 'extra-bandage-cheek', 'extra-cat-whiskers', 'extra-rainbow-trail', 'extra-poop-hat'
- FORMAS / EFECTOS (id empieza con 'shape-'):
  'shape-star-5', 'shape-heart-solid', 'shape-lightning-bolt', 'shape-speech-bubble', 'shape-thought-cloud', 'shape-fire-flame', 'shape-explosion-pow', 'shape-diamond-gem', 'shape-music-note', 'shape-cross-x', 'shape-badge-ribbon', 'shape-sun-burst', 'shape-crescent-moon', 'shape-four-point-star', 'shape-exclamation-mark', 'shape-question-mark', 'shape-flower-petals', 'shape-dollar-bill', 'shape-gamepad', 'shape-magic-wand'

PALETA DE COLORES RECOMENDADOS:
'#FACC15' (Amarillo Emoji), '#60A5FA' (Azul Cielo), '#FCA5A5' (Rosa Pastel), '#FB7185' (Coral/Rojo), '#4ADE80' (Verde Menta/Alien), '#C084FC' (Púrpura Mágico), '#1E293B' (Gris Pizarra/Oscuro), '#FB923C' (Naranja), '#FFFFFF' (Blanco), '#EF4444' (Rojo Fuego)

ESTRUCTURA DE CAPAS:
1. Una base centrada en (${centerX}, ${centerY}), escala ~1.0
2. Ojos posicionados un poco arriba del centro (ej. y=${centerY - 40}), escala ~1.0
3. Boca posicionada un poco abajo del centro (ej. y=${centerY + 60}), escala ~1.0
4. 1 o 2 accesorios o extras acordes a la temática (ej. sombrero arriba en y=${centerY - 130}, mejillas en y=${centerY + 30}, etc.)
`;

        // Attempt with gemini-2.5-flash
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `Crea un personaje basado en esta idea: "${prompt}"`,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                projectName: { type: Type.STRING },
                explanation: { type: Type.STRING },
                backgroundColor: { type: Type.STRING },
                suggestedCaption: { type: Type.STRING },
                layers: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      pieceId: { type: Type.STRING },
                      name: { type: Type.STRING },
                      x: { type: Type.NUMBER },
                      y: { type: Type.NUMBER },
                      scale: { type: Type.NUMBER },
                      rotation: { type: Type.NUMBER },
                      color: { type: Type.STRING },
                      depth: { type: Type.NUMBER },
                    },
                    required: ["pieceId", "name", "x", "y", "scale", "color"],
                  },
                },
              },
              required: ["projectName", "explanation", "backgroundColor", "layers"],
            },
          },
        });

        const parsed = JSON.parse(response.text?.trim() || "{}");
        if (parsed && Array.isArray(parsed.layers) && parsed.layers.length > 0) {
          return res.json({ success: true, data: parsed, engine: "gemini-2.5-flash" });
        }
      } catch (_geminiError: any) {
        // Fallback gracefully without noisy console traces
      }
    }

    // Graceful smart fallback (guaranteed instant success)
    const fallbackData = fallbackGenerateCharacter(prompt || "Emoji Feliz", is916);
    return res.json({ success: true, data: fallbackData, engine: "smart-engine-fallback" });
  });

  // 2. AI Animation Choreographer Endpoint
  app.post("/api/gemini/generate-animation", async (req, res) => {
    const { prompt = "", layers = [], duration = 3.0, fps = 30 } = req.body;
    const ai = getGeminiClient();

    if (ai && prompt.trim() && Array.isArray(layers) && layers.length > 0) {
      try {
        const layerSummaries = layers.map((l: any) => ({
          id: l.id,
          name: l.name,
          category: l.category,
          x: l.x,
          y: l.y,
          scaleX: l.scaleX,
          scaleY: l.scaleY,
          rotation: l.rotation,
        }));

        const systemPrompt = `
Eres un animador profesional de motion graphics.
Tu tarea es generar keyframes divertidos y fluidos para las capas dadas según la acción solicitada.
Duración total: ${duration} segundos.
Genera keyframes uniformes en tiempos clave: ej. [0, ${Number((duration * 0.25).toFixed(2))}, ${Number((duration * 0.5).toFixed(2))}, ${Number((duration * 0.75).toFixed(2))}, ${duration}].
Asegúrate de que en t=0 y t=${duration} los valores coincidan para crear un bucle (loop) fluido.
`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `Genera una animación para: "${prompt}". Capas: ${JSON.stringify(layerSummaries)}`,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                animationTitle: { type: Type.STRING },
                explanation: { type: Type.STRING },
                keyframes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      time: { type: Type.NUMBER },
                      layerTransforms: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            layerId: { type: Type.STRING },
                            x: { type: Type.NUMBER },
                            y: { type: Type.NUMBER },
                            scaleX: { type: Type.NUMBER },
                            scaleY: { type: Type.NUMBER },
                            rotation: { type: Type.NUMBER },
                            opacity: { type: Type.NUMBER },
                          },
                          required: ["layerId", "x", "y", "scaleX", "scaleY", "rotation"],
                        },
                      },
                    },
                    required: ["time", "layerTransforms"],
                  },
                },
              },
              required: ["animationTitle", "explanation", "keyframes"],
            },
          },
        });

        const parsed = JSON.parse(response.text?.trim() || "{}");
        if (parsed && Array.isArray(parsed.keyframes) && parsed.keyframes.length > 0) {
          return res.json({ success: true, data: parsed, engine: "gemini-2.5-flash" });
        }
      } catch (_geminiError: any) {
        // Fallback gracefully without noisy console traces
      }
    }

    // Graceful physics keyframe fallback
    const fallbackAnim = fallbackGenerateAnimation(prompt || "Baile", layers, duration);
    return res.json({ success: true, data: fallbackAnim, engine: "smart-engine-fallback" });
  });

  // 3. AI Voice Dialogue Suggestions
  app.post("/api/gemini/suggest-voice", async (req, res) => {
    const { characterDescription = "" } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `Sugiere 4 frases cortas, cómicas y expresivas en español que este personaje diría en un video de YouTube Shorts / TikTok: "${characterDescription || "Emoji divertido"}"`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                dialogues: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      phrase: { type: Type.STRING },
                      tone: { type: Type.STRING },
                    },
                    required: ["phrase", "tone"],
                  },
                },
              },
              required: ["dialogues"],
            },
          },
        });

        const parsed = JSON.parse(response.text?.trim() || "{}");
        if (parsed && Array.isArray(parsed.dialogues) && parsed.dialogues.length > 0) {
          return res.json({ success: true, data: parsed });
        }
      } catch (_err) {
        // Fallback gracefully
      }
    }

    const fallbackList = fallbackGenerateDialogues(characterDescription);
    return res.json({ success: true, data: { dialogues: fallbackList } });
  });

  // Vite Middleware for development & Static Files for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Lulu Animator Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
