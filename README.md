# Sales CRM

A React + Vite Sales CRM application, configured for automatic deployment to GitHub Pages.

## ⚠️ Note about the App.jsx scaffold

The original code provided was **truncated mid-component** (inside `QuoteItemsEditor`). The truncated component was closed minimally so the project compiles. To finish the app:

1. Open `src/App.jsx`
2. Find: `▼▼▼ PASTE REMAINDER OF YOUR CODE HERE ▼▼▼`
3. Paste the rest of your code
4. Delete the placeholder `App` at the bottom and `export default` your real one

## Local development

```bash
npm install
npm run dev
```

Opens at http://localhost:5173

## Deploy to GitHub Pages (one-time setup)

### 1. Create an empty GitHub repo

Go to https://github.com/new and create a repo (e.g. `salescrm`). **Don't** add a README, .gitignore, or license — keep it empty.

### 2. Push this code to it

From inside this project folder:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git push -u origin main
```

Replace `YOUR-USERNAME` and `YOUR-REPO-NAME` with your actual values.

### 3. Enable GitHub Pages

On GitHub:

1. Go to your repo → **Settings** → **Pages**
2. Under **Build and deployment** → **Source**, select **GitHub Actions**
3. Save

### 4. That's it

Every push to `main` will now:
- Run the workflow in `.github/workflows/deploy.yml`
- Build the Vite app with the correct base path (auto-detected from your repo name)
- Publish to `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

The first deploy takes ~1–2 minutes. Watch progress at the **Actions** tab in your repo.

## How the base path works

Vite needs to know the URL prefix where the site is hosted. The workflow injects it automatically:

```yaml
env:
  VITE_BASE_PATH: /${{ github.event.repository.name }}/
```

So if you rename the repo, no config changes needed — it just works.

## Build for production locally

```bash
npm run build
npm run preview
```

## Project structure

```
salescrm/
├── .github/workflows/deploy.yml    # Auto-deploy to GitHub Pages
├── index.html
├── package.json
├── vite.config.js                  # Reads VITE_BASE_PATH at build time
└── src/
    ├── main.jsx
    └── App.jsx                     # ← Paste remainder of your code here
```
