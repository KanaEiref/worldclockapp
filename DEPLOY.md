# Deploy World Clock to GitHub

Your code is committed and ready to push. Follow these steps:

## 1. Create a new repository on GitHub

1. Go to [github.com/new](https://github.com/new)
2. Set **Repository name** to `worldclockapp` (or any name you prefer)
3. Choose **Public**
4. **Do not** initialize with README, .gitignore, or license (the repo already has content)
5. Click **Create repository**

## 2. Push your code

Run these commands (replace `YOUR_USERNAME` with your GitHub username):

```bash
cd /Users/kana2017/aiwork/worldclockapp

# Add your GitHub repo as remote
git remote add origin https://github.com/YOUR_USERNAME/worldclockapp.git

# Push to GitHub
git push -u origin main
```

If you use SSH instead:
```bash
git remote add origin git@github.com:YOUR_USERNAME/worldclockapp.git
git push -u origin main
```

## 3. Deploy to Vercel (optional, for a live URL)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New** → **Project**
3. Import your `worldclockapp` repository
4. Click **Deploy** (Vercel auto-detects Next.js)

Your app will be live at `https://worldclockapp-xxx.vercel.app` in about a minute.
