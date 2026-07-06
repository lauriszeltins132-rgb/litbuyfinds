# Cursed Chest

A fast mobile-first instant casino game. Open treasure chests, grow your multiplier, and cash out before the curse strikes.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## How to play

1. Set your bet and tap **Place Bet & Start**
2. Select a chest, then tap **Open Chest**
3. Safe treasure increases your multiplier — **Cash Out** or open another chest
4. Hit the cursed chest and you lose the round
5. Sometimes you find a **Golden Key** — risk the bonus vault for bigger rewards

## Game rules (v1)

- 5 chests per round, 1 is cursed
- Multiplier progression: 1.15x → 1.50x → 2.00x → 7.00x
- Max win cap: 50× bet
- Play-money demo with €1,000 starting balance (persisted in session)

## RTP simulation

```bash
npm run simulate:rtp
```

Tune weights in `src/lib/game/constants.ts` to target ~96% RTP.

## Project structure

```
src/
  app/              # Next.js pages + API routes
  components/game/  # Game UI
  lib/game/         # Server-side math + round engine
scripts/
  simulate-rtp.mjs  # Monte Carlo RTP validation
```

## Tech stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/game/round` | Start a new round |
| POST | `/api/game/pick` | Open a chest |
| POST | `/api/game/cashout` | Cash out current winnings |
| POST | `/api/game/bonus/accept` | Enter Golden Key bonus |
| POST | `/api/game/bonus/pick` | Pick a bonus chest |
| POST | `/api/game/bonus/skip` | Skip bonus, keep current multiplier |
