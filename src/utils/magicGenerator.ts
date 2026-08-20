import { LayerItem, KeyframeData, LayerTransform } from '../types';
import { EMOJI_LIBRARY } from '../constants/items';

export interface GeneratedCharacter {
  projectName: string;
  explanation: string;
  backgroundColor: string;
  suggestedCaption: string;
  layers: LayerItem[];
}

export interface GeneratedAnimation {
  animationTitle: string;
  explanation: string;
  keyframes: KeyframeData[];
}

export interface CharacterPreset {
  id: string;
  name: string;
  description: string;
  emoji: string;
  bg: string;
  tags: string[];
  themeColor: string;
  basePieceId: string;
  baseColor: string;
  eyesPieceId: string;
  eyesColor: string;
  mouthPieceId: string;
  mouthColor: string;
  extraPieceId?: string;
  extraColor?: string;
  extraYOffset?: number;
  secondExtraPieceId?: string;
  secondExtraColor?: string;
  secondExtraYOffset?: number;
  caption: string;
}

export const CHARACTER_THEMES: CharacterPreset[] = [
  {
    id: 'pirate-cat',
    name: 'Gatito Pirata',
    description: 'Un felino aventurero con parche, sombrero y bigotes.',
    emoji: '🐱‍👤',
    bg: '#0F172A',
    tags: ['pirata', 'gato', 'mar', 'aventura', 'sombrero'],
    themeColor: '#FB923C',
    basePieceId: 'base-cat',
    baseColor: '#FB923C',
    eyesPieceId: 'eyes-winking',
    eyesColor: '#1E293B',
    mouthPieceId: 'mouth-smirk',
    mouthColor: '#EF4444',
    extraPieceId: 'extra-pirate-hat',
    extraColor: '#1E293B',
    extraYOffset: -140,
    secondExtraPieceId: 'extra-cat-whiskers',
    secondExtraColor: '#1E293B',
    secondExtraYOffset: 50,
    caption: '¡Al abordaje de las carcajadas! 🏴‍☠️🐱',
  },
  {
    id: 'space-alien',
    name: 'Alien Galáctico',
    description: 'Un simpático visitante extraterrestre de piel verde y ojos brillantes.',
    emoji: '👽',
    bg: '#1E1B4B',
    tags: ['alien', 'extraterrestre', 'espacio', 'galaxia', 'ovni'],
    themeColor: '#4ADE80',
    basePieceId: 'base-alien',
    baseColor: '#4ADE80',
    eyesPieceId: 'eyes-stars',
    eyesColor: '#1E293B',
    mouthPieceId: 'mouth-wide-grin',
    mouthColor: '#EF4444',
    extraPieceId: 'extra-sparkle-stars',
    extraColor: '#FACC15',
    extraYOffset: -120,
    caption: '¡Venimos en son de paz y diversión intergaláctica! 🛸✨',
  },
  {
    id: 'gamer-robot',
    name: 'Robot Gamer',
    description: 'Androide cibernético con audífonos pro y mirada láser.',
    emoji: '🤖',
    bg: '#0F172A',
    tags: ['robot', 'gamer', 'juegos', 'futuro', 'musica', 'audifonos'],
    themeColor: '#60A5FA',
    basePieceId: 'base-robot',
    baseColor: '#60A5FA',
    eyesPieceId: 'eyes-cyborg-laser',
    eyesColor: '#EF4444',
    mouthPieceId: 'mouth-zipper',
    mouthColor: '#1E293B',
    extraPieceId: 'extra-headphones',
    extraColor: '#F43F5E',
    extraYOffset: -40,
    caption: '¡Bip Bop! Subiendo de nivel en tres, dos, uno... 🎮🤖',
  },
  {
    id: 'kawaii-devil',
    name: 'Diablito Travieso',
    description: 'Un diablillo simpático de fuego con colmillos y mejillas tiernas.',
    emoji: '😈',
    bg: '#18181B',
    tags: ['diablo', 'diablito', 'fuego', 'rojo', 'travieso'],
    themeColor: '#EF4444',
    basePieceId: 'base-devil',
    baseColor: '#EF4444',
    eyesPieceId: 'eyes-fire',
    eyesColor: '#FACC15',
    mouthPieceId: 'mouth-vampire-fangs',
    mouthColor: '#FFFFFF',
    secondExtraPieceId: 'shape-fire-flame',
    secondExtraColor: '#F97316',
    secondExtraYOffset: -140,
    caption: '¡Haciendo travesuras sin parar! 🔥😈',
  },
  {
    id: 'magic-princess',
    name: 'Princesa Mágica',
    description: 'Una tierna princesa de corona dorada y ojos de estrellas.',
    emoji: '👑',
    bg: '#4A044E',
    tags: ['princesa', 'reina', 'corona', 'magia', 'rosa', 'amor'],
    themeColor: '#F472B6',
    basePieceId: 'base-heart',
    baseColor: '#F472B6',
    eyesPieceId: 'eyes-anime-sparkle',
    eyesColor: '#1E293B',
    mouthPieceId: 'mouth-kiss-lips',
    mouthColor: '#E11D48',
    extraPieceId: 'extra-crown-gold',
    extraColor: '#FACC15',
    extraYOffset: -135,
    secondExtraPieceId: 'extra-blush-cheeks',
    secondExtraColor: '#FB7185',
    secondExtraYOffset: 30,
    caption: '¡Un saludo mágico a todo mi reino! 👑💖',
  },
  {
    id: 'texas-cowboy',
    name: 'Vaquero del Oeste',
    description: 'Un valiente sheriff con sombrero texano y gran bigote.',
    emoji: '🤠',
    bg: '#3F2E18',
    tags: ['vaquero', 'cowboy', 'oeste', 'sombrero', 'bigote'],
    themeColor: '#FACC15',
    basePieceId: 'base-classic-circle',
    baseColor: '#FACC15',
    eyesPieceId: 'eyes-winking',
    eyesColor: '#1E293B',
    mouthPieceId: 'mouth-mustache',
    mouthColor: '#78350F',
    extraPieceId: 'extra-cowboy-hat',
    extraColor: '#854D0E',
    extraYOffset: -140,
    caption: '¡Yeehaw! Este es el pueblo más alegre del oeste 🤠🌵',
  },
  {
    id: 'party-pumpkin',
    name: 'Calabaza Festiva',
    description: 'Calabaza alegre con gorrito de fiesta y sonrisa luminosa.',
    emoji: '🎃',
    bg: '#18181B',
    tags: ['calabaza', 'halloween', 'fiesta', 'naranja'],
    themeColor: '#FB923C',
    basePieceId: 'base-pumpkin',
    baseColor: '#FB923C',
    eyesPieceId: 'eyes-fire',
    eyesColor: '#FACC15',
    mouthPieceId: 'mouth-vampire-fangs',
    mouthColor: '#FFFFFF',
    extraPieceId: 'extra-party-hat',
    extraColor: '#EC4899',
    extraYOffset: -130,
    caption: '¡Fiesta mágica llena de dulces! 🎃🍬',
  },
  {
    id: 'cute-ghost',
    name: 'Fantasmita Tierno',
    description: 'Un espíritu flotante suave y amistoso con mejillas sonrojadas.',
    emoji: '👻',
    bg: '#09090B',
    tags: ['fantasma', 'ghost', 'blanco', 'tierno', 'amigo'],
    themeColor: '#F8FAFC',
    basePieceId: 'base-ghost',
    baseColor: '#F8FAFC',
    eyesPieceId: 'eyes-cute-kawaii',
    eyesColor: '#1E293B',
    mouthPieceId: 'mouth-shock-gasp',
    mouthColor: '#EF4444',
    secondExtraPieceId: 'extra-blush-cheeks',
    secondExtraColor: '#FDA4AF',
    secondExtraYOffset: 25,
    caption: '¡Booo! Pero con mucho cariño 👻❤️',
  },
  {
    id: 'panda-bear',
    name: 'Osito Panda',
    description: 'Un panda comilón con grandes ojos anime y sonrisa alegre.',
    emoji: '🐼',
    bg: '#14532D',
    tags: ['panda', 'oso', 'animal', 'kawaii', 'tierno'],
    themeColor: '#FFFFFF',
    basePieceId: 'base-panda',
    baseColor: '#FFFFFF',
    eyesPieceId: 'eyes-anime-sparkle',
    eyesColor: '#1E293B',
    mouthPieceId: 'mouth-open-laugh',
    mouthColor: '#EF4444',
    secondExtraPieceId: 'extra-blush-cheeks',
    secondExtraColor: '#FDA4AF',
    secondExtraYOffset: 30,
    caption: '¡Un abrazo suavecito para ti! 🐼🎋',
  },
  {
    id: 'circus-clown',
    name: 'Payasito Saltarín',
    description: 'Un artista de circo con peluca azul y corneta de fiesta.',
    emoji: '🤡',
    bg: '#581C87',
    tags: ['payaso', 'circo', 'fiesta', 'risa', 'broma'],
    themeColor: '#FACC15',
    basePieceId: 'base-clown',
    baseColor: '#FACC15',
    eyesPieceId: 'eyes-swirl-dizzy',
    eyesColor: '#1E293B',
    mouthPieceId: 'mouth-party-horn',
    mouthColor: '#EF4444',
    extraPieceId: 'extra-clown-wig',
    extraColor: '#3B82F6',
    extraYOffset: -130,
    caption: '¡El show de risas va a comenzar! 🎪🤡',
  },
  {
    id: 'love-heart',
    name: 'Corazón Enamorado',
    description: 'Un personaje romántico con ojos de corazones y beso volador.',
    emoji: '💖',
    bg: '#831843',
    tags: ['corazon', 'amor', 'beso', 'rosa', 'enamorado'],
    themeColor: '#FB7185',
    basePieceId: 'base-heart',
    baseColor: '#FB7185',
    eyesPieceId: 'eyes-hearts',
    eyesColor: '#E11D48',
    mouthPieceId: 'mouth-kiss-lips',
    mouthColor: '#E11D48',
    secondExtraPieceId: 'extra-blush-cheeks',
    secondExtraColor: '#F43F5E',
    secondExtraYOffset: 30,
    caption: '¡Te mando un beso volador lleno de amor! 💖😘',
  },
  {
    id: 'crazy-party',
    name: 'Emoji Súper Fiesta',
    description: 'El clásico emoji amarillo saltarín con gorro festivo y ojos locos.',
    emoji: '🥳',
    bg: '#1E293B',
    tags: ['fiesta', 'party', 'alegria', 'celebrar', 'amarillo'],
    themeColor: '#FACC15',
    basePieceId: 'base-classic-circle',
    baseColor: '#FACC15',
    eyesPieceId: 'eyes-googly',
    eyesColor: '#1E293B',
    mouthPieceId: 'mouth-wide-grin',
    mouthColor: '#EF4444',
    extraPieceId: 'extra-party-hat',
    extraColor: '#EC4899',
    extraYOffset: -135,
    secondExtraPieceId: 'extra-blush-cheeks',
    secondExtraColor: '#FB7185',
    secondExtraYOffset: 30,
    caption: '¡A celebrar y bailar sin parar! 🎉🥳',
  },
];

export function buildCharacterFromPreset(
  preset: CharacterPreset,
  aspectRatio: '9:16' | '1:1'
): GeneratedCharacter {
  const is916 = aspectRatio === '9:16';
  const centerX = 540;
  const centerY = is916 ? 960 : 540;

  const rawPieces: Array<{
    pieceId: string;
    name: string;
    category: import('../types').ItemCategory;
    x: number;
    y: number;
    scale: number;
    color: string;
    depth: number;
  }> = [
    {
      pieceId: preset.basePieceId,
      name: 'Base de la cara',
      category: 'bases',
      x: centerX,
      y: centerY,
      scale: 1.0,
      color: preset.baseColor,
      depth: 18,
    },
    {
      pieceId: preset.eyesPieceId,
      name: 'Ojos expresivos',
      category: 'eyes',
      x: centerX,
      y: centerY - 40,
      scale: 1.0,
      color: preset.eyesColor,
      depth: 14,
    },
    {
      pieceId: preset.mouthPieceId,
      name: 'Boca divertida',
      category: 'mouths',
      x: centerX,
      y: centerY + 65,
      scale: 0.95,
      color: preset.mouthColor,
      depth: 14,
    },
  ];

  if (preset.extraPieceId) {
    rawPieces.push({
      pieceId: preset.extraPieceId,
      name: 'Accesorio principal',
      category: 'extras' as const,
      x: centerX,
      y: centerY + (preset.extraYOffset ?? -135),
      scale: 1.05,
      color: preset.extraColor || '#FACC15',
      depth: 18,
    });
  }

  if (preset.secondExtraPieceId) {
    rawPieces.push({
      pieceId: preset.secondExtraPieceId,
      name: 'Detalle decorativo',
      category: 'shapes' as const,
      x: centerX,
      y: centerY + (preset.secondExtraYOffset ?? 30),
      scale: 0.9,
      color: preset.secondExtraColor || '#FB7185',
      depth: 12,
    });
  }

  const layers: LayerItem[] = rawPieces.map((p, idx) => {
    const matched = EMOJI_LIBRARY.find(item => item.id === p.pieceId) || EMOJI_LIBRARY[0];
    return {
      id: `layer-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 5)}`,
      pieceId: matched.id,
      name: p.name,
      category: matched.category,
      x: p.x,
      y: p.y,
      scaleX: p.scale,
      scaleY: p.scale,
      rotation: 0,
      color: p.color,
      opacity: 1,
      depth: p.depth,
      geometryType: matched.geometryType || 'extrude',
      type: matched.type,
      content: matched.content,
      viewBox: matched.viewBox,
      zIndex: idx,
      locked: false,
    };
  });

  return {
    projectName: preset.name,
    explanation: preset.description,
    backgroundColor: preset.bg,
    suggestedCaption: preset.caption,
    layers,
  };
}

export function generateSmartCharacterByText(
  prompt: string,
  aspectRatio: '9:16' | '1:1'
): GeneratedCharacter {
  const query = prompt.toLowerCase().trim();

  // Find best match in presets
  const matched = CHARACTER_THEMES.find(p =>
    p.tags.some(tag => query.includes(tag)) ||
    query.includes(p.name.toLowerCase())
  );

  if (matched) {
    return buildCharacterFromPreset(matched, aspectRatio);
  }

  // Pick random preset for creative variety
  const randomPreset = CHARACTER_THEMES[Math.floor(Math.random() * CHARACTER_THEMES.length)];
  const result = buildCharacterFromPreset(randomPreset, aspectRatio);
  result.projectName = prompt.length > 2 ? prompt.slice(0, 24) : randomPreset.name;
  return result;
}

export function generateRandomCharacter(aspectRatio: '9:16' | '1:1'): GeneratedCharacter {
  const is916 = aspectRatio === '9:16';
  const centerX = 540;
  const centerY = is916 ? 960 : 540;

  const bases = EMOJI_LIBRARY.filter(i => i.category === 'bases');
  const eyes = EMOJI_LIBRARY.filter(i => i.category === 'eyes');
  const mouths = EMOJI_LIBRARY.filter(i => i.category === 'mouths');
  const extras = EMOJI_LIBRARY.filter(i => i.category === 'extras');

  const randomBase = bases[Math.floor(Math.random() * bases.length)];
  const randomEyes = eyes[Math.floor(Math.random() * eyes.length)];
  const randomMouth = mouths[Math.floor(Math.random() * mouths.length)];
  const randomExtra = Math.random() > 0.3 ? extras[Math.floor(Math.random() * extras.length)] : null;

  const colorPalette = ['#FACC15', '#FB7185', '#60A5FA', '#4ADE80', '#C084FC', '#FB923C', '#F472B6'];
  const bgPalette = ['#1E293B', '#0F172A', '#1E1B4B', '#14532D', '#581C87', '#4A044E', '#18181B'];

  const baseColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
  const bgColor = bgPalette[Math.floor(Math.random() * bgPalette.length)];

  const pieces = [
    {
      item: randomBase,
      name: 'Base Aleatoria',
      x: centerX,
      y: centerY,
      scale: 1,
      color: baseColor,
      depth: 18,
    },
    {
      item: randomEyes,
      name: 'Ojos Expresivos',
      x: centerX,
      y: centerY - 40,
      scale: 1,
      color: '#1E293B',
      depth: 14,
    },
    {
      item: randomMouth,
      name: 'Boca Divertida',
      x: centerX,
      y: centerY + 65,
      scale: 0.95,
      color: '#EF4444',
      depth: 14,
    },
  ];

  if (randomExtra) {
    pieces.push({
      item: randomExtra,
      name: 'Accesorio Sorpresa',
      x: centerX,
      y: centerY - 135,
      scale: 1.05,
      color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
      depth: 16,
    });
  }

  const layers: LayerItem[] = pieces.map((p, idx) => ({
    id: `layer-rand-${Date.now()}-${idx}`,
    pieceId: p.item.id,
    name: p.name,
    category: p.item.category,
    x: p.x,
    y: p.y,
    scaleX: p.scale,
    scaleY: p.scale,
    rotation: 0,
    color: p.color,
    opacity: 1,
    depth: p.depth,
    geometryType: p.item.geometryType || 'extrude',
    type: p.item.type,
    content: p.item.content,
    viewBox: p.item.viewBox,
    zIndex: idx,
    locked: false,
  }));

  return {
    projectName: 'Personaje Aleatorio 🎉',
    explanation: '¡Combinación sorpresa creada con el generador local de piezas!',
    backgroundColor: bgColor,
    suggestedCaption: '¡Mira mi nueva creación! ✨',
    layers,
  };
}

export interface AnimationStyleOption {
  id: string;
  name: string;
  description: string;
  emoji: string;
  motionType: 'bounce' | 'laugh' | 'surprise' | 'heartbeat' | 'rocket' | 'spin' | 'wave';
}

export const ANIMATION_STYLES: AnimationStyleOption[] = [
  {
    id: 'bounce-dance',
    name: '🕺 Baile Rítmico',
    description: 'Rebotes elásticos arriba y abajo con inclinaciones laterales acompasadas.',
    emoji: '🕺',
    motionType: 'bounce',
  },
  {
    id: 'laugh-burst',
    name: '😂 Ataque de Risa',
    description: 'Vibración rápida cómica con expansión de boca y temblor alegre.',
    emoji: '😂',
    motionType: 'laugh',
  },
  {
    id: 'surprise-jump',
    name: '😱 Susto Cómico',
    description: 'Salto hacia arriba en sorpresa con estiramiento de cuerpo y aterrizaje suave.',
    emoji: '😱',
    motionType: 'surprise',
  },
  {
    id: 'heart-pulse',
    name: '❤️ Latido Amoroso',
    description: 'Pulso continuo de expansión y contracción con balanceo tierno.',
    emoji: '❤️',
    motionType: 'heartbeat',
  },
  {
    id: 'rocket-fly',
    name: '🚀 Despegue Espacial',
    description: 'Vibración previa, lanzamiento vertical y retorno en bucle.',
    emoji: '🚀',
    motionType: 'rocket',
  },
  {
    id: 'spin-dizzy',
    name: '🌀 Mareo Giratorio',
    description: 'Giro de 360 grados con desaceleración elástica al final.',
    emoji: '🌀',
    motionType: 'spin',
  },
  {
    id: 'wave-friendly',
    name: '👋 Saludo Amistoso',
    description: 'Balanceo suave de izquierda a derecha para saludar a la cámara.',
    emoji: '👋',
    motionType: 'wave',
  },
];

export function generateSmartKeyframes(
  styleType: string,
  layers: LayerItem[],
  duration: number = 3.0
): GeneratedAnimation {
  const selectedStyle = ANIMATION_STYLES.find(s => s.id === styleType) || ANIMATION_STYLES[0];

  let maxAngle = 18;
  let jumpDistance = -40;
  let stretchX = 1.15;
  let squashY = 0.85;

  switch (selectedStyle.motionType) {
    case 'laugh':
      maxAngle = 8;
      jumpDistance = -15;
      stretchX = 1.08;
      squashY = 0.92;
      break;
    case 'surprise':
      maxAngle = -12;
      jumpDistance = -70;
      stretchX = 0.9;
      squashY = 1.25;
      break;
    case 'heartbeat':
      maxAngle = 6;
      jumpDistance = -10;
      stretchX = 1.2;
      squashY = 1.2;
      break;
    case 'rocket':
      maxAngle = 25;
      jumpDistance = -90;
      stretchX = 0.85;
      squashY = 1.3;
      break;
    case 'spin':
      maxAngle = 180;
      jumpDistance = -20;
      stretchX = 1.1;
      squashY = 0.95;
      break;
    case 'wave':
      maxAngle = 22;
      jumpDistance = -8;
      stretchX = 1.05;
      squashY = 0.98;
      break;
    default:
      maxAngle = 18;
      jumpDistance = -40;
      stretchX = 1.15;
      squashY = 0.85;
      break;
  }

  const times = [0, 0.25, 0.5, 0.75, 1.0];

  const keyframes: KeyframeData[] = times.map((normalizedTime, stepIdx) => {
    const transforms: Record<string, LayerTransform> = {};

    layers.forEach((l) => {
      const origX = l.x ?? 540;
      const origY = l.y ?? 960;
      const origScaleX = Math.abs(l.scaleX ?? 1);
      const origScaleY = l.scaleY ?? 1;
      const origRot = l.rotation ?? 0;
      const isBase = l.category === 'bases';

      let curX = origX;
      let curY = origY;
      let curScaleX = origScaleX;
      let curScaleY = origScaleY;
      let curRot = origRot;

      if (stepIdx === 1) {
        // Step 1: Tilt Left & Squash
        curX = origX - (isBase ? 15 : 12);
        curY = origY + (isBase ? 10 : 6);
        curScaleX = Number((origScaleX * stretchX).toFixed(2));
        curScaleY = Number((origScaleY * squashY).toFixed(2));
        curRot = origRot - maxAngle;
      } else if (stepIdx === 2) {
        // Step 2: Jump & Stretch
        curX = origX;
        curY = origY + jumpDistance;
        curScaleX = Number((origScaleX * squashY).toFixed(2));
        curScaleY = Number((origScaleY * stretchX).toFixed(2));
        curRot = selectedStyle.motionType === 'spin' ? origRot + 180 : origRot;
      } else if (stepIdx === 3) {
        // Step 3: Tilt Right & Land
        curX = origX + (isBase ? 15 : 12);
        curY = origY + (isBase ? 10 : 6);
        curScaleX = Number((origScaleX * stretchX).toFixed(2));
        curScaleY = Number((origScaleY * squashY).toFixed(2));
        curRot = selectedStyle.motionType === 'spin' ? origRot + 360 : origRot + maxAngle;
      }

      transforms[l.id] = {
        x: curX,
        y: curY,
        scaleX: curScaleX,
        scaleY: curScaleY,
        rotation: curRot,
        opacity: 1,
      };
    });

    return {
      time: normalizedTime,
      transforms,
    };
  });

  return {
    animationTitle: selectedStyle.name,
    explanation: selectedStyle.description,
    keyframes,
  };
}

export const DIALOGUE_COLLECTION = [
  { phrase: '¡Hola a todos! ¡Miren lo genial que me veo en 3D!', tone: 'Voz entusiasta de creador' },
  { phrase: '¡No pararé de bailar hasta que este video llegue a 1 millón de vistas!', tone: 'Ritmo enérgico festivo' },
  { phrase: '¡Dale al botoncito de like si te gustó mi animación!', tone: 'Tono simpático y dulce' },
  { phrase: '¡Espera hasta el final para ver mi truco secreto!', tone: 'Susurro de misterio cómico' },
  { phrase: '¡Arrr marinero! ¿Dónde escondiste mi mapa del tesoro?', tone: 'Voz de pirata divertido' },
  { phrase: '¡Saludos humanos terrestres! Venimos en busca de risas.', tone: 'Voz robótica alienígena' },
  { phrase: '¡Bip Bop! Cargando nueva partida en tres, dos, uno...', tone: 'Locutor de videojuegos' },
  { phrase: '¡Yeehaw! El sheriff más rápido de todo TikTok.', tone: 'Vaquero alegre del oeste' },
];
