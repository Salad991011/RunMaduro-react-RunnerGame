# React Subway Runner — Starter (Jordanian Arabic + English)

## 1) كيف تنزل وتفتح المشروع (VS Code)
1. فك الضغط (Extract) للـ zip.
2. افتح VS Code.
3. File → Open Folder… واختر فولدر المشروع `subway-react-runner`.

## 2) تشغيل المشروع (Windows / Mac / Linux)
افتح Terminal داخل VS Code واكتب:

```bash
npm install
npm run dev
```

وبطلعلك رابط زي `http://localhost:5173`.

## 3) Controls
- A / D أو ← → : تبديل lanes
- W / ↑ أو Space : Jump
- S / ↓ : Roll

## 4) وين أغير الـ assets (بعد ما نبني النسخة الأساسية)
حط ملفاتك هون:
- `public/assets/sounds/`
- (لاحقاً) `public/assets/models/`

وبتغير المسارات من:
`src/game/assets/manifest.ts`

## 5) شو اللي بنبنيه سوا بعدين؟
- ✅ Chunk system زي Unity (spawn & recycle)
- ✅ Coins
- ⏭️ Obstacles collisions + game over
- ⏭️ Jump / Roll hitboxes
- ⏭️ Import 3D models (GLB)
- ⏭️ Better visuals + SFX + music

If you get stuck, ابعتلي screenshot للـ error وبنحلها.
