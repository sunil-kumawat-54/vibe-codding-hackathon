@echo off
echo ===================================================
echo   Pushing TableSync to GitHub (Team: S square)
echo ===================================================
echo.

echo [1/5] Initializing Git Repository...
git init

echo.
echo [2/5] Staging files...
git add .

echo.
echo [3/5] Committing changes...
git commit -m "feat: TableSync Restaurant Operations platform MVP with Digital Twin, waitlist, and Gemini AI suggestion"

echo.
echo [4/5] Aligning branch to main...
git branch -M main

echo.
echo [5/5] Hooking up remote URL...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/sunil-kumawat-54/vibe-codding-hackathon.git

echo.
echo Pushing codebase to main branch...
git push -u origin main

echo.
echo ===================================================
echo   Push complete!
echo ===================================================
pause
