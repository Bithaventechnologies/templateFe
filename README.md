# Email Studio

Pick an email template, fill in the details, preview it, and send.

Built with React, Vite, TypeScript and Tailwind CSS v4.

## Run it

```bash
npm install
npm run dev
```

Open the address Vite prints (usually http://localhost:5173).

## Project structure

```
src/
  App.tsx                 router and auth provider
  routes/routes.tsx       public, protected, and nested dashboard routes
  layouts/                shared authenticated navigation layout
  pages/                  dashboard, templates, composer, settings, and states
  context/AuthContext.tsx  single session state and unauthorized handling
  types.ts                EmailData and Template types
  templates/index.ts      local presentation details for email templates
  lib/html.ts             helpers for email-safe HTML
  lib/api.ts              shared Axios client and owner token storage
  lib/auth.ts             login, session verification and logout
  lib/emails.ts           email template, preview and send API calls
  lib/send.ts             HTML copying
  components/             TemplateList, EmailForm, Preview, Field
  hooks/useLocalStorage.ts
```

## Add a new template

Add an object to the `templates` array in `src/templates/index.ts`:

- `id`, `icon`, `label`, `desc`, `tint` describe how it shows in the sidebar
- `defaults` are the pre-filled subject, headline and message
- `fields` picks extra inputs: `"code"`, `"detail"`, `"btn"`
- `build(d)` returns the email HTML. Use tables and inline styles, because email apps ignore most CSS.

## API configuration

Set `VITE_API_URL` to the backend API base URL. The deployed API uses:

```dotenv
VITE_API_URL=https://templatebe.onrender.com/api
```

Copy `.env.example` to `.env` for local configuration. The owner password and email provider credentials belong on the backend and must not be added to frontend environment variables.

The composer authenticates with the owner password, loads the backend email template definitions, previews via `/emails/preview`, and sends via `/emails/send`. The local `templates/index.ts` contains presentation details used to display known templates; the API controls which ones are available.

## Routes

- `/login` — owner sign in
- `/dashboard` — overview and quick actions
- `/templates` — templates returned by `GET /emails/templates`
- `/templates/new` — explains that creation needs a confirmed backend API
- `/templates/:id/edit` — explains that editing needs a confirmed backend API
- `/compose` — preview and send email
- `/history` — explains that no history endpoint is available
- `/settings` — browser-local business and sender names

The repository includes no backend source or confirmed create, update, delete, or history endpoint. Those operations are intentionally not submitted until the backend contract is available. Template listing, preview, and sending use the existing `/emails/templates`, `/emails/preview`, and `/emails/send` API functions.

## Verify

```bash
npm run build
```

The build runs TypeScript checking and creates the production bundle. There is no lint or test script configured in `package.json`.
