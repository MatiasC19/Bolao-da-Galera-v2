export const TEAMS = [
  { c: 'ALG', n: 'Argélia', f: 'dz', e: '🇩🇿' },
  { c: 'ARG', n: 'Argentina', f: 'ar', e: '🇦🇷' },
  { c: 'AUS', n: 'Austrália', f: 'au', e: '🇦🇺' },
  { c: 'AUT', n: 'Áustria', f: 'at', e: '🇦🇹' },
  { c: 'BEL', n: 'Bélgica', f: 'be', e: '🇧🇪' },
  { c: 'BOL', n: 'Bolívia', f: 'bo', e: '🇧🇴' },
  { c: 'BRA', n: 'Brasil', f: 'br', e: '🇧🇷' },
  { c: 'CMR', n: 'Camarões', f: 'cm', e: '🇨🇲' },
  { c: 'CAN', n: 'Canadá', f: 'ca', e: '🇨🇦' },
  { c: 'CHI', n: 'Chile', f: 'cl', e: '🇨🇱' },
  { c: 'CIV', n: 'Costa do Marfim', f: 'ci', e: '🇨🇮' },
  { c: 'COL', n: 'Colômbia', f: 'co', e: '🇨🇴' },
  { c: 'KOR', n: 'Coreia do Sul', f: 'kr', e: '🇰🇷' },
  { c: 'CRO', n: 'Croácia', f: 'hr', e: '🇭🇷' },
  { c: 'DEN', n: 'Dinamarca', f: 'dk', e: '🇩🇰' },
  { c: 'ECU', n: 'Equador', f: 'ec', e: '🇪🇨' },
  { c: 'EGY', n: 'Egito', f: 'eg', e: '🇪🇬' },
  { c: 'ESC', n: 'Escócia', f: 'gb-sct', e: '🏴' },
  { c: 'ESP', n: 'Espanha', f: 'es', e: '🇪🇸' },
  { c: 'USA', n: 'Estados Unidos', f: 'us', e: '🇺🇸' },
  { c: 'FRA', n: 'França', f: 'fr', e: '🇫🇷' },
  { c: 'GER', n: 'Alemanha', f: 'de', e: '🇩🇪' },
  { c: 'GHA', n: 'Gana', f: 'gh', e: '🇬🇭' },
  { c: 'GRE', n: 'Grécia', f: 'gr', e: '🇬🇷' },
  { c: 'HTI', n: 'Haiti', f: 'ht', e: '🇭🇹' },
  { c: 'ENG', n: 'Inglaterra', f: 'gb-eng', e: '🏴' },
  { c: 'IRN', n: 'Irã', f: 'ir', e: '🇮🇷' },
  { c: 'IRQ', n: 'Iraque', f: 'iq', e: '🇮🇶' },
  { c: 'JPN', n: 'Japão', f: 'jp', e: '🇯🇵' },
  { c: 'MAR', n: 'Marrocos', f: 'ma', e: '🇲🇦' },
  { c: 'MEX', n: 'México', f: 'mx', e: '🇲🇽' },
  { c: 'NED', n: 'Holanda', f: 'nl', e: '🇳🇱' },
  { c: 'NGA', n: 'Nigéria', f: 'ng', e: '🇳🇬' },
  { c: 'NOR', n: 'Noruega', f: 'no', e: '🇳🇴' },
  { c: 'NZL', n: 'Nova Zelândia', f: 'nz', e: '🇳🇿' },
  { c: 'PAR', n: 'Paraguai', f: 'py', e: '🇵🇾' },
  { c: 'PER', n: 'Peru', f: 'pe', e: '🇵🇪' },
  { c: 'POL', n: 'Polônia', f: 'pl', e: '🇵🇱' },
  { c: 'POR', n: 'Portugal', f: 'pt', e: '🇵🇹' },
  { c: 'SAU', n: 'Arábia Saudita', f: 'sa', e: '🇸🇦' },
  { c: 'SEN', n: 'Senegal', f: 'sn', e: '🇸🇳' },
  { c: 'SRB', n: 'Sérvia', f: 'rs', e: '🇷🇸' },
  { c: 'SUI', n: 'Suíça', f: 'ch', e: '🇨🇭' },
  { c: 'SWE', n: 'Suécia', f: 'se', e: '🇸🇪' },
  { c: 'TUN', n: 'Tunísia', f: 'tn', e: '🇹🇳' },
  { c: 'TUR', n: 'Turquia', f: 'tr', e: '🇹🇷' },
  { c: 'UKR', n: 'Ucrânia', f: 'ua', e: '🇺🇦' },
  { c: 'URU', n: 'Uruguai', f: 'uy', e: '🇺🇾' },
  { c: 'VEN', n: 'Venezuela', f: 've', e: '🇻🇪' },
];

export const TEAMS_BY_CODE = Object.fromEntries(TEAMS.map((t) => [t.c, t]));

export function team(code) {
  return TEAMS_BY_CODE[code] || { c: code, n: code, f: '', e: code };
}

export const PHASES = [
  'Fase de Grupos – Grupo A', 'Fase de Grupos – Grupo B', 'Fase de Grupos – Grupo C',
  'Fase de Grupos – Grupo D', 'Fase de Grupos – Grupo E', 'Fase de Grupos – Grupo F',
  'Fase de Grupos – Grupo G', 'Fase de Grupos – Grupo H', 'Fase de Grupos – Grupo I',
  'Fase de Grupos – Grupo J', 'Fase de Grupos – Grupo K', 'Fase de Grupos – Grupo L',
  'Oitavas de Final', 'Quartas de Final', 'Semifinal', 'Disputa de 3º Lugar', 'Final',
];

export const AVATAR_COLORS = ['#0033A0', '#CC0000', '#0a7f44', '#b8922a', '#7c3aed', '#0891b2', '#db2777', '#ea580c', '#0f766e', '#b45309'];

export function avatarColor(name) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

export function initials(name) {
  return name.substring(0, 2).toUpperCase();
}
