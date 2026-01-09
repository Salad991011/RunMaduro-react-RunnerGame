# Subway React Runner (Starter) 🏃‍♂️🚇

هاي نسخة **starter** لــ Subway Surfers–style endless runner بس مكتوبة **React + Three.js**.
الفكرة: نبلّش **structure clean** وبعدين نبدّل **assets / visuals / sounds** بسهولة.

## Tech Stack
- React + Vite (TypeScript)
- Three.js via @react-three/fiber
- Zustand (game state)
- Howler (sounds)

## How to run (بالـ VS Code)
1) Unzip المشروع
2) افتح VS Code → `File > Open Folder` → اختر folder المشروع
3) افتح Terminal جوّا VS Code واكتب:

```bash
npm install
npm run dev
```

4) افتح الرابط اللي بيطلعلك (عادةً `http://localhost:5173`)

## Controls
- Left/Right: `A/D` أو `←/→`
- Jump: `Space` أو `↑`
- Roll: `↓`
- Pause/Resume: `P`

## Where to change assets (بدّل الشكل والصوت)
### Sounds
الملفات هون:
- `public/assets/sounds/coin.wav`
- `public/assets/sounds/crash.wav`
- `public/assets/sounds/music.wav`

ولو بدك تغيّر المسارات، عدّل:
- `src/game/assets/manifest.ts`

### Models / Visuals
هسا اللعبة بتستخدم **placeholder geometry** (boxes/capsule/torus).
الخطوة الجاية (مع بعض): نضيف `.glb` models (player + chunks) تحت:
- `public/assets/models/`

وبعدين نربطهم بالـ code.

## Next build steps (رح نبنيها سوا)
1) Obstacle collision + gameover
2) Proper chunk prefabs (patterns like Unity)
3) Import GLB models + textures
4) Better animations / VFX
5) Mobile swipe controls

---
إذا بدك، ابعتلي صورة/هيكل الـ Unity project assets (أو قولّي شو الستايل الجديد) وبنعمل reskin كامل 🔥
