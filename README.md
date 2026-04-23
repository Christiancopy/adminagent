# Assistant Administratif Citoyen

API REST Node.js/Express qui aide les citoyens a comprendre des demarches administratives au Benin, avec adaptation linguistique (fr, fon, yoruba, adja).

## Installation

```bash
npm install
```

## Lancement local

```bash
npm run dev
```

## Endpoints

- POST /agent
- POST /translate
- POST /procedure
- POST /audio/tts
- POST /audio/transcribe
- GET /health

## Test de deploiement Netlify

1. Connecter Netlify CLI (une fois):

```bash
npx netlify login
```

2. Lier ou initialiser le site:

```bash
npx netlify init
```

3. Configurer les variables d'environnement sur Netlify (UI ou CLI):

- AI_BASE_URL
- AI_API_KEY
- DEFAULT_TEXT_MODEL

4. Tester localement en mode Netlify Functions:

```bash
npm run netlify:dev
```

5. Deployer en preview:

```bash
npm run netlify:deploy
```

6. Deployer en production:

```bash
npm run netlify:deploy:prod
```

## Notes

- Le service IA utilise l'API LewisNote: https://build.lewisnote.com/v1
- En local, la base SQLite est `database/assistant.db`.
- Sur Netlify (serverless), SQLite ecrit dans `/tmp/assistant.db` (temporaire, non persistant entre executions).
