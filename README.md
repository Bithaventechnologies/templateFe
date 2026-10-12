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
  App.tsx                 page layout and state
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
