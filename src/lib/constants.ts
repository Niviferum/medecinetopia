export const DISCORD_WHITELIST = [
  "335809984749240320", // Jade
  "388356301199245313", // Adrien
] as const;

export const SPOTIFY_SCOPES = [
  "streaming",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
].join(" ");

// Matières par défaut proposées à la première connexion de Jade
export const DEFAULT_SUBJECTS = [
  { name: "Anatomie",       icon: "🦴", color: "#f9a875" },
  { name: "Physiologie",    icon: "🫀", color: "#f07878" },
  { name: "Biochimie",      icon: "🧪", color: "#b090e8" },
  { name: "Sémiologie",     icon: "🩺", color: "#78b8f8" },
  { name: "Pharmacologie",  icon: "💊", color: "#80d898" },
  { name: "Immunologie",    icon: "🛡️", color: "#f0c060" },
  { name: "Histologie",     icon: "🔬", color: "#f898c8" },
  { name: "Neurologie",     icon: "🧠", color: "#a8d8a8" },
];

// Couleurs disponibles pour les post-it
export const POSTIT_COLORS = [
  { label: "Jaune",  value: "#fde99a" },
  { label: "Rose",   value: "#ffd6e0" },
  { label: "Vert",   value: "#c8f0d8" },
  { label: "Bleu",   value: "#c8dff8" },
  { label: "Pêche",  value: "#ffd8b8" },
  { label: "Lilas",  value: "#e8d8f8" },
];
