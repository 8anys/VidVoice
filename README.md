# VidVoice

VidVoice is a Vite + React web app for turning text into voice and simple image-based video scenes.

## Local Launch

1. Install Node.js 20 LTS or newer.
2. Copy `.env.example` to `.env` only if you want real Base44 auth and backend integration.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the local URL shown by Vite, usually `http://localhost:5173`.

## Local Dev Mode

If `.env` is missing, the app still starts in a safe local mode with a mock user so you can work on the UI and flow without backend credentials.

## Production Build

1. Run `npm run build`.
2. Run `npm run preview`.

## Notes

- `Go Live` is not the primary way to run this project because it is not a static HTML site.
- Use `Go Live` only for the built `dist` folder after `npm run build`.
