import { EmojiPiece, ItemCategory } from '../types';

export const COLOR_PALETTE = [
  { name: 'Emoji Yellow', hex: '#FACC15', border: '#EAB308' },
  { name: 'Sky Blue', hex: '#60A5FA', border: '#3B82F6' },
  { name: 'Pastel Pink', hex: '#FCA5A5', border: '#F87171' },
  { name: 'Soft Blue', hex: '#93C5FD', border: '#60A5FA' },
  { name: 'Coral / Salmon', hex: '#FB7185', border: '#F43F5E' },
  { name: 'Mint Green', hex: '#4ADE80', border: '#22C55E' },
  { name: 'Purple Dream', hex: '#C084FC', border: '#A855F7' },
  { name: 'Deep Slate', hex: '#1E293B', border: '#0F172A' },
  { name: 'Pure White', hex: '#FFFFFF', border: '#E2E8F0' },
  { name: 'Electric Orange', hex: '#FB923C', border: '#EA580C' },
];

export const EMOJI_LIBRARY: EmojiPiece[] = [
  // ================= BASES =================
  {
    id: 'base-classic-circle',
    name: 'Classic Yellow Face',
    category: 'bases',
    type: 'svg',
    defaultColor: '#FACC15',
    defaultScale: 1.0,
    depth: 18,
    geometryType: 'cylinder',
    viewBox: '0 0 300 300',
    content: `
      <g>
        <!-- Outer accent rim like in reference image -->
        <circle cx="150" cy="150" r="145" fill="#EAB308" />
        <circle cx="150" cy="150" r="130" fill="#FACC15" />
        <circle cx="150" cy="150" r="128" fill="none" stroke="#CA8A04" stroke-width="3" />
      </g>
    `
  },
  {
    id: 'base-smooth-circle',
    name: 'Smooth Circle',
    category: 'bases',
    type: 'svg',
    defaultColor: '#FACC15',
    defaultScale: 1.0,
    depth: 16,
    geometryType: 'sphere',
    viewBox: '0 0 300 300',
    content: `
      <g>
        <circle cx="150" cy="150" r="140" fill="currentColor" />
      </g>
    `
  },
  {
    id: 'base-squircle',
    name: 'Squircle Head',
    category: 'bases',
    type: 'svg',
    defaultColor: '#60A5FA',
    defaultScale: 1.0,
    depth: 16,
    geometryType: 'extrude',
    viewBox: '0 0 300 300',
    content: `
      <g>
        <rect x="20" y="20" width="260" height="260" rx="70" fill="currentColor" />
      </g>
    `
  },
  {
    id: 'base-heart',
    name: 'Heart Face',
    category: 'bases',
    type: 'svg',
    defaultColor: '#FB7185',
    defaultScale: 1.0,
    depth: 16,
    geometryType: 'extrude',
    viewBox: '0 0 300 300',
    content: `
      <g>
        <path d="M150 260 C150 260 20 180 20 100 C20 40 70 20 115 20 C140 20 150 45 150 45 C150 45 160 20 185 20 C230 20 280 40 280 100 C280 180 150 260 150 260 Z" fill="currentColor" />
      </g>
    `
  },
  {
    id: 'base-devil',
    name: 'Devil Horns Head',
    category: 'bases',
    type: 'svg',
    defaultColor: '#EF4444',
    defaultScale: 1.0,
    depth: 16,
    geometryType: 'extrude',
    viewBox: '0 0 300 300',
    content: `
      <g>
        <path d="M70 70 Q40 10 30 10 Q60 50 80 90 Z" fill="#DC2626" />
        <path d="M230 70 Q260 10 270 10 Q240 50 220 90 Z" fill="#DC2626" />
        <circle cx="150" cy="160" r="125" fill="currentColor" />
      </g>
    `
  },
  {
    id: 'base-cat',
    name: 'Cat Ears Head',
    category: 'bases',
    type: 'svg',
    defaultColor: '#FACC15',
    defaultScale: 1.0,
    depth: 16,
    geometryType: 'extrude',
    viewBox: '0 0 300 300',
    content: `
      <g>
        <polygon points="50,110 30,30 110,60" fill="#EAB308" />
        <polygon points="250,110 270,30 190,60" fill="#EAB308" />
        <circle cx="150" cy="160" r="125" fill="currentColor" />
      </g>
    `
  },
  {
    id: 'base-alien',
    name: 'Alien Head',
    category: 'bases',
    type: 'svg',
    defaultColor: '#4ADE80',
    defaultScale: 1.0,
    depth: 16,
    geometryType: 'extrude',
    viewBox: '0 0 300 300',
    content: `
      <g>
        <path d="M150 30 C70 30 30 100 50 190 C70 260 130 280 150 280 C170 280 230 260 250 190 C270 100 230 30 150 30 Z" fill="currentColor" />
      </g>
    `
  },
  {
    id: 'base-robot',
    name: 'Robot Head',
    category: 'bases',
    type: 'svg',
    defaultColor: '#94A3B8',
    defaultScale: 1.0,
    depth: 16,
    geometryType: 'box',
    viewBox: '0 0 300 300',
    content: `
      <g>
        <rect x="140" y="20" width="20" height="30" fill="#64748B" />
        <circle cx="150" cy="20" r="14" fill="#EF4444" />
        <rect x="50" y="50" width="200" height="210" rx="30" fill="currentColor" stroke="#475569" stroke-width="6" />
        <rect x="25" y="120" width="25" height="50" rx="6" fill="#64748B" />
        <rect x="250" y="120" width="25" height="50" rx="6" fill="#64748B" />
      </g>
    `
  },

  // ================= EYES =================
  {
    id: 'eyes-capsule-stitch',
    name: 'Reference Capsule Eyes',
    category: 'eyes',
    type: 'svg',
    defaultColor: '#1E293B',
    defaultScale: 0.9,
    depth: 6,
    viewBox: '0 0 200 100',
    content: `
      <g fill="currentColor">
        <rect x="20" y="10" width="34" height="68" rx="17" />
        <rect x="146" y="10" width="34" height="68" rx="17" />
      </g>
    `
  },
  {
    id: 'eyes-dot',
    name: 'Minimal Dots',
    category: 'eyes',
    type: 'svg',
    defaultColor: '#1E293B',
    defaultScale: 0.9,
    depth: 6,
    viewBox: '0 0 200 100',
    content: `
      <g fill="currentColor">
        <circle cx="45" cy="50" r="22" />
        <circle cx="155" cy="50" r="22" />
      </g>
    `
  },
  {
    id: 'eyes-happy-curves',
    name: 'Happy Closed Eyes',
    category: 'eyes',
    type: 'svg',
    defaultColor: '#1E293B',
    defaultScale: 0.9,
    depth: 5,
    viewBox: '0 0 200 100',
    content: `
      <g fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round">
        <path d="M25 55 Q45 20 70 55" />
        <path d="M130 55 Q155 20 175 55" />
      </g>
    `
  },
  {
    id: 'eyes-wink',
    name: 'Playful Wink',
    category: 'eyes',
    type: 'svg',
    defaultColor: '#1E293B',
    defaultScale: 0.9,
    depth: 6,
    viewBox: '0 0 200 100',
    content: `
      <g fill="currentColor">
        <!-- Open capsule eye -->
        <rect x="25" y="15" width="34" height="68" rx="17" />
        <!-- Wink path -->
        <path d="M130 55 Q155 20 178 55" fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round" />
      </g>
    `
  },
  {
    id: 'eyes-heart',
    name: 'Heart Eyes (In Love)',
    category: 'eyes',
    type: 'svg',
    defaultColor: '#EF4444',
    defaultScale: 0.9,
    depth: 7,
    viewBox: '0 0 200 100',
    content: `
      <g fill="currentColor">
        <path d="M45 80 C45 80 15 55 15 35 C15 18 28 10 38 10 C46 10 50 18 50 18 C50 18 54 10 62 10 C72 10 85 18 85 35 C85 55 45 80 45 80 Z" />
        <path d="M155 80 C155 80 125 55 125 35 C125 18 138 10 148 10 C156 10 160 18 160 18 C160 18 164 10 172 10 C182 10 195 18 195 35 C195 55 155 80 155 80 Z" />
      </g>
    `
  },
  {
    id: 'eyes-star',
    name: 'Star Eyes (Excited)',
    category: 'eyes',
    type: 'svg',
    defaultColor: '#F59E0B',
    defaultScale: 0.9,
    depth: 7,
    viewBox: '0 0 200 100',
    content: `
      <g fill="currentColor">
        <polygon points="45,15 54,36 76,38 59,53 64,75 45,63 26,75 31,53 14,38 36,36" />
        <polygon points="155,15 164,36 186,38 169,53 174,75 155,63 136,75 141,53 124,38 146,36" />
      </g>
    `
  },
  {
    id: 'eyes-sunglasses',
    name: 'Cool Sunglasses',
    category: 'eyes',
    type: 'svg',
    defaultColor: '#0F172A',
    defaultScale: 1.1,
    depth: 8,
    viewBox: '0 0 240 100',
    content: `
      <g fill="currentColor">
        <path d="M15 25 L105 25 C105 25 100 80 60 80 C20 80 15 25 15 25 Z" />
        <path d="M135 25 L225 25 C225 25 220 80 180 80 C140 80 135 25 135 25 Z" />
        <rect x="95" y="25" width="50" height="12" rx="3" />
        <!-- Gloss highlight -->
        <polygon points="25,32 50,32 30,70 22,70" fill="white" opacity="0.4" />
        <polygon points="145,32 170,32 150,70 142,70" fill="white" opacity="0.4" />
      </g>
    `
  },
  {
    id: 'eyes-anime-sparkle',
    name: 'Sparkly Anime Eyes',
    category: 'eyes',
    type: 'svg',
    defaultColor: '#1E293B',
    defaultScale: 0.9,
    depth: 6,
    viewBox: '0 0 200 100',
    content: `
      <g>
        <ellipse cx="45" cy="50" rx="26" ry="36" fill="#1E293B" />
        <circle cx="36" cy="38" r="10" fill="white" />
        <circle cx="54" cy="62" r="5" fill="white" />
        
        <ellipse cx="155" cy="50" rx="26" ry="36" fill="#1E293B" />
        <circle cx="146" cy="38" r="10" fill="white" />
        <circle cx="164" cy="62" r="5" fill="white" />
      </g>
    `
  },
  {
    id: 'eyes-spiral',
    name: 'Dizzy Spirals',
    category: 'eyes',
    type: 'svg',
    defaultColor: '#1E293B',
    defaultScale: 0.9,
    depth: 5,
    viewBox: '0 0 200 100',
    content: `
      <g fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round">
        <path d="M45,50 m-25,0 a25,25 0 1,0 50,0 a20,20 0 1,0 -40,0 a14,14 0 1,0 28,0 a8,8 0 1,0 -16,0" />
        <path d="M155,50 m-25,0 a25,25 0 1,0 50,0 a20,20 0 1,0 -40,0 a14,14 0 1,0 28,0 a8,8 0 1,0 -16,0" />
      </g>
    `
  },

  // ================= MOUTHS =================
  {
    id: 'mouth-stitch-smile',
    name: 'Gentle Curved Smile',
    category: 'mouths',
    type: 'svg',
    defaultColor: '#1E293B',
    defaultScale: 0.8,
    depth: 6,
    viewBox: '0 0 200 80',
    content: `
      <g fill="currentColor">
        <path d="M30 25 C70 65 130 65 170 25 C145 42 105 48 85 48 C65 48 45 38 30 25 Z" />
      </g>
    `
  },
  {
    id: 'mouth-big-smile',
    name: 'Big Open Grin',
    category: 'mouths',
    type: 'svg',
    defaultColor: '#1E293B',
    defaultScale: 0.8,
    depth: 7,
    viewBox: '0 0 200 120',
    content: `
      <g>
        <path d="M20 25 Q100 130 180 25 Z" fill="#1E293B" />
        <!-- Tongue -->
        <path d="M70 70 Q100 45 130 70 Q100 125 70 70 Z" fill="#FB7185" />
      </g>
    `
  },
  {
    id: 'mouth-tongue-out',
    name: 'Tongue Out Playful',
    category: 'mouths',
    type: 'svg',
    defaultColor: '#1E293B',
    defaultScale: 0.8,
    depth: 7,
    viewBox: '0 0 200 140',
    content: `
      <g>
        <path d="M30 40 Q100 80 170 40" fill="none" stroke="#1E293B" stroke-width="12" stroke-linecap="round" />
        <path d="M75 55 Q75 125 100 125 Q125 125 125 55 Z" fill="#F43F5E" stroke="#1E293B" stroke-width="4" />
        <line x1="100" y1="65" x2="100" y2="105" stroke="#BE123C" stroke-width="4" stroke-linecap="round" />
      </g>
    `
  },
  {
    id: 'mouth-surprised-o',
    name: 'Surprised "O"',
    category: 'mouths',
    type: 'svg',
    defaultColor: '#1E293B',
    defaultScale: 0.7,
    depth: 6,
    viewBox: '0 0 100 100',
    content: `
      <g fill="currentColor">
        <ellipse cx="50" cy="50" rx="28" ry="36" />
      </g>
    `
  },
  {
    id: 'mouth-smirk',
    name: 'Cheeky Smirk',
    category: 'mouths',
    type: 'svg',
    defaultColor: '#1E293B',
    defaultScale: 0.75,
    depth: 5,
    viewBox: '0 0 160 80',
    content: `
      <g fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round">
        <path d="M30 50 Q80 50 135 25" />
      </g>
    `
  },
  {
    id: 'mouth-mustache',
    name: 'Gentleman Mustache',
    category: 'mouths',
    type: 'svg',
    defaultColor: '#1E293B',
    defaultScale: 0.9,
    depth: 7,
    viewBox: '0 0 200 80',
    content: `
      <g fill="currentColor">
        <path d="M100 35 C80 15 40 10 15 35 C35 60 75 55 100 35 Z" />
        <path d="M100 35 C120 15 160 10 185 35 C165 60 125 55 100 35 Z" />
      </g>
    `
  },
  {
    id: 'mouth-cat-w',
    name: 'Cat Cute :3',
    category: 'mouths',
    type: 'svg',
    defaultColor: '#1E293B',
    defaultScale: 0.8,
    depth: 5,
    viewBox: '0 0 160 80',
    content: `
      <g fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round">
        <path d="M35 30 Q55 60 80 40 Q105 60 125 30" />
      </g>
    `
  },
  {
    id: 'mouth-teeth-grimace',
    name: 'Teeth Grin',
    category: 'mouths',
    type: 'svg',
    defaultColor: '#FFFFFF',
    defaultScale: 0.85,
    depth: 6,
    viewBox: '0 0 180 80',
    content: `
      <g>
        <rect x="20" y="20" width="140" height="40" rx="15" fill="white" stroke="#1E293B" stroke-width="8" />
        <line x1="20" y1="40" x2="160" y2="40" stroke="#1E293B" stroke-width="5" />
        <line x1="55" y1="20" x2="55" y2="60" stroke="#1E293B" stroke-width="5" />
        <line x1="90" y1="20" x2="90" y2="60" stroke="#1E293B" stroke-width="5" />
        <line x1="125" y1="20" x2="125" y2="60" stroke="#1E293B" stroke-width="5" />
      </g>
    `
  },

  // ================= EXTRAS =================
  {
    id: 'extra-pink-blush',
    name: 'Rosy Cheeks (Blush)',
    category: 'extras',
    type: 'svg',
    defaultColor: '#FCA5A5',
    defaultScale: 0.9,
    depth: 4,
    viewBox: '0 0 240 60',
    content: `
      <g fill="currentColor" opacity="0.75">
        <ellipse cx="40" cy="30" rx="30" ry="18" />
        <ellipse cx="200" cy="30" rx="30" ry="18" />
      </g>
    `
  },
  {
    id: 'extra-sparkles',
    name: 'Magic Sparkles ✨',
    category: 'extras',
    type: 'svg',
    defaultColor: '#FACC15',
    defaultScale: 0.8,
    depth: 5,
    viewBox: '0 0 160 160',
    content: `
      <g fill="currentColor">
        <path d="M80 15 Q80 65 30 65 Q80 65 80 115 Q80 65 130 65 Q80 65 80 15 Z" />
        <path d="M125 90 Q125 115 100 115 Q125 115 125 140 Q125 115 150 115 Q125 115 125 90 Z" />
      </g>
    `
  },
  {
    id: 'extra-tears-joy',
    name: 'Tears of Joy 💧',
    category: 'extras',
    type: 'svg',
    defaultColor: '#60A5FA',
    defaultScale: 0.8,
    depth: 5,
    viewBox: '0 0 240 100',
    content: `
      <g fill="currentColor">
        <path d="M20 30 C20 15 5 5 5 5 C5 5 0 20 0 35 C0 50 10 60 20 60 C30 60 40 50 40 35 C40 20 20 30 20 30 Z" transform="translate(10, 10)" />
        <path d="M20 30 C20 15 35 5 35 5 C35 5 40 20 40 35 C40 50 30 60 20 60 C10 60 0 50 0 35 C0 20 20 30 20 30 Z" transform="translate(180, 10)" />
      </g>
    `
  },
  {
    id: 'extra-crown',
    name: 'Golden Crown 👑',
    category: 'extras',
    type: 'svg',
    defaultColor: '#FACC15',
    defaultScale: 0.9,
    depth: 9,
    viewBox: '0 0 200 120',
    content: `
      <g fill="currentColor" stroke="#EAB308" stroke-width="4">
        <polygon points="20,100 180,100 190,40 145,70 100,20 55,70 10,40" />
        <circle cx="10" cy="35" r="8" fill="#EF4444" stroke="none" />
        <circle cx="100" cy="15" r="9" fill="#3B82F6" stroke="none" />
        <circle cx="190" cy="35" r="8" fill="#10B981" stroke="none" />
      </g>
    `
  },
  {
    id: 'extra-angel-halo',
    name: 'Angel Halo 😇',
    category: 'extras',
    type: 'svg',
    defaultColor: '#FDE047',
    defaultScale: 0.9,
    depth: 6,
    viewBox: '0 0 220 80',
    content: `
      <g fill="none" stroke="currentColor" stroke-width="16">
        <ellipse cx="110" cy="40" rx="90" ry="25" />
      </g>
    `
  },
  {
    id: 'extra-fire',
    name: 'Flame Hair 🔥',
    category: 'extras',
    type: 'svg',
    defaultColor: '#F97316',
    defaultScale: 0.9,
    depth: 8,
    viewBox: '0 0 160 160',
    content: `
      <g>
        <path d="M80 10 C50 50 30 80 30 110 C30 140 50 155 80 155 C110 155 130 140 130 110 C130 75 105 45 80 10 Z" fill="#EA580C" />
        <path d="M80 50 C65 75 50 95 50 120 C50 140 65 150 80 150 C95 150 110 140 110 120 C110 95 95 75 80 50 Z" fill="#FACC15" />
      </g>
    `
  },
  {
    id: 'extra-bandaid',
    name: 'Bandaid Cheek 🩹',
    category: 'extras',
    type: 'svg',
    defaultColor: '#FDBA74',
    defaultScale: 0.7,
    depth: 4,
    viewBox: '0 0 120 60',
    content: `
      <g transform="rotate(-15 60 30)">
        <rect x="10" y="15" width="100" height="30" rx="10" fill="#FDBA74" stroke="#FB923C" stroke-width="3" />
        <rect x="42" y="15" width="36" height="30" fill="#FED7AA" />
        <circle cx="50" cy="30" r="2.5" fill="#EA580C" />
        <circle cx="60" cy="30" r="2.5" fill="#EA580C" />
        <circle cx="70" cy="30" r="2.5" fill="#EA580C" />
      </g>
    `
  },
  {
    id: 'extra-party-hat',
    name: 'Party Hat 🥳',
    category: 'extras',
    type: 'svg',
    defaultColor: '#A855F7',
    defaultScale: 0.85,
    depth: 8,
    viewBox: '0 0 160 160',
    content: `
      <g>
        <polygon points="80,20 20,140 140,140" fill="#A855F7" />
        <circle cx="80" cy="18" r="14" fill="#FACC15" />
        <path d="M40 100 L120 100" stroke="#EC4899" stroke-width="12" />
        <path d="M55 70 L105 70" stroke="#38BDF8" stroke-width="10" />
      </g>
    `
  },

  // ================= SHAPES =================
  {
    id: 'shape-star-badge',
    name: '5-Point Star ⭐',
    category: 'shapes',
    type: 'svg',
    defaultColor: '#FACC15',
    defaultScale: 0.8,
    depth: 7,
    viewBox: '0 0 120 120',
    content: `
      <g fill="currentColor">
        <polygon points="60,10 74,44 110,48 83,72 91,107 60,89 29,107 37,72 10,48 46,44" />
      </g>
    `
  },
  {
    id: 'shape-lightning',
    name: 'Thunder Bolt ⚡',
    category: 'shapes',
    type: 'svg',
    defaultColor: '#FACC15',
    defaultScale: 0.8,
    depth: 6,
    viewBox: '0 0 100 140',
    content: `
      <g fill="currentColor">
        <polygon points="55,10 15,75 50,75 35,130 85,60 52,60" />
      </g>
    `
  },
  {
    id: 'shape-speech-bubble',
    name: 'Comic Bubble 💬',
    category: 'shapes',
    type: 'svg',
    defaultColor: '#FFFFFF',
    defaultScale: 0.85,
    depth: 6,
    viewBox: '0 0 180 130',
    content: `
      <g fill="currentColor" stroke="#1E293B" stroke-width="6">
        <path d="M20 20 L160 20 Q170 20 170 30 L170 90 Q170 100 160 100 L70 100 L40 125 L45 100 L20 100 Q10 100 10 90 L10 30 Q10 20 20 20 Z" />
      </g>
    `
  },
  {
    id: 'shape-diamond',
    name: 'Diamond Crystal 💎',
    category: 'shapes',
    type: 'svg',
    defaultColor: '#38BDF8',
    defaultScale: 0.8,
    depth: 8,
    viewBox: '0 0 140 120',
    content: `
      <g fill="currentColor">
        <polygon points="40,20 100,20 130,50 70,110 10,50" />
        <polygon points="40,20 70,50 100,20" fill="white" opacity="0.3" />
        <polygon points="10,50 70,110 70,50" fill="black" opacity="0.15" />
      </g>
    `
  },
  {
    id: 'shape-music-note',
    name: 'Music Note 🎵',
    category: 'shapes',
    type: 'svg',
    defaultColor: '#EC4899',
    defaultScale: 0.8,
    depth: 6,
    viewBox: '0 0 120 120',
    content: `
      <g fill="currentColor">
        <ellipse cx="35" cy="90" rx="20" ry="15" transform="rotate(-20 35 90)" />
        <ellipse cx="95" cy="75" rx="20" ry="15" transform="rotate(-20 95 75)" />
        <rect x="46" y="20" width="10" height="70" />
        <rect x="106" y="10" width="10" height="65" />
        <polygon points="46,20 116,10 116,25 46,35" />
      </g>
    `
  }
];

export const UNICODE_EMOJIS: { char: string; name: string; category: ItemCategory }[] = [
  // Bases
  { char: '😀', name: 'Grinning Face', category: 'bases' },
  { char: '😎', name: 'Cool Face', category: 'bases' },
  { char: '🥳', name: 'Party Face', category: 'bases' },
  { char: '🥺', name: 'Pleading Face', category: 'bases' },
  { char: '🤖', name: 'Robot', category: 'bases' },
  { char: '👽', name: 'Alien', category: 'bases' },
  { char: '🐱', name: 'Cat', category: 'bases' },
  { char: '🎃', name: 'Pumpkin', category: 'bases' },
  { char: '👻', name: 'Ghost', category: 'bases' },
  { char: '💩', name: 'Poop', category: 'bases' },
  
  // Eyes & Faces
  { char: '👀', name: 'Eyes', category: 'eyes' },
  { char: '👁️', name: 'Eye', category: 'eyes' },
  { char: '🕶️', name: 'Sunglasses', category: 'eyes' },
  { char: '👓', name: 'Glasses', category: 'eyes' },
  { char: '🧐', name: 'Monocle', category: 'eyes' },
  { char: '😍', name: 'Heart Eyes', category: 'eyes' },
  { char: '🤩', name: 'Star-Struck', category: 'eyes' },
  
  // Mouths
  { char: '👄', name: 'Mouth Lips', category: 'mouths' },
  { char: '👅', name: 'Tongue', category: 'mouths' },
  { char: '💋', name: 'Kiss Mark', category: 'mouths' },
  { char: '😋', name: 'Yum Smile', category: 'mouths' },
  { char: '🤪', name: 'Zany Face', category: 'mouths' },
  
  // Extras
  { char: '👑', name: 'Crown', category: 'extras' },
  { char: '🧢', name: 'Cap', category: 'extras' },
  { char: '🎩', name: 'Top Hat', category: 'extras' },
  { char: '🎧', name: 'Headphones', category: 'extras' },
  { char: '🎀', name: 'Ribbon', category: 'extras' },
  { char: '🔥', name: 'Fire', category: 'extras' },
  { char: '✨', name: 'Sparkles', category: 'extras' },
  { char: '💥', name: 'Collision', category: 'extras' },
  { char: '💯', name: 'Hundred', category: 'extras' },
  { char: '❤️', name: 'Red Heart', category: 'extras' },
  
  // Shapes
  { char: '⭐', name: 'Star', category: 'shapes' },
  { char: '⚡', name: 'Lightning', category: 'shapes' },
  { char: '💎', name: 'Gem', category: 'shapes' },
  { char: '💬', name: 'Speech Bubble', category: 'shapes' },
  { char: '💫', name: 'Dizzy Star', category: 'shapes' },
  { char: '🎉', name: 'Party Popper', category: 'shapes' },
  { char: '🌈', name: 'Rainbow', category: 'shapes' },
];

export const INITIAL_DEFAULT_LAYERS: EmojiPiece[] = [
  EMOJI_LIBRARY[0], // base-classic-circle
  EMOJI_LIBRARY[8], // eyes-capsule-stitch
  EMOJI_LIBRARY[17], // mouth-stitch-smile
];
