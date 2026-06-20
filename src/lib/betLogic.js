export function isLocked(match) {
  return new Date() >= new Date(match.dl);
}

export function getResult(match) {
  return match.res || null;
}

export function isExactWinner(bet, res) {
  if (!res) return null;
  return bet === res;
}

// bets are stored per-player as an array of scores so one person can place
// more than one bet on the same match. Legacy single-string data is treated
// as an array of length 1.
export function betsOf(bets, matchId, name) {
  const raw = bets?.[matchId]?.[name];
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
}

export function totalBetsInMatch(bets, players, matchId) {
  const obj = bets?.[matchId] || {};
  return Object.keys(obj)
    .filter((name) => players.includes(name))
    .reduce((acc, name) => acc + betsOf(bets, matchId, name).length, 0);
}

export function totalBetsAllMatches(bets, players, matches) {
  return matches.reduce((acc, m) => acc + totalBetsInMatch(bets, players, m.id), 0);
}

export function valorPalpite(bolao) {
  return bolao?.valor || 10;
}
