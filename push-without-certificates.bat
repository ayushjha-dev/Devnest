@echo off
echo DevNest GitHub Push (Without Certificates)
echo ==========================================
echo.
echo This script will push your code WITHOUT certificate images.
echo You can add certificates later via a separate commit.
echo.
echo This reduces upload size from ~100MB to ~10MB.
echo.
pause

cd /d "%~dp0"

REM Configure git for better performance
git config http.postBuffer 524288000
git config core.compression 0

REM Add certificates to .gitignore
echo. >> .gitignore
echo # Large certificate images - push separately >> .gitignore
echo public/certificates/**/*.png >> .gitignore

REM Remove certificates from git if already staged/committed
git rm -r --cached public/certificates/ 2>nul

REM Commit the change
git add .gitignore
git commit -m "Temporarily exclude certificate images from repo"

echo.
echo Pushing code to GitHub (without certificates)...
echo.

git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ==========================================
    echo SUCCESS! Code pushed to GitHub!
    echo ==========================================
    echo.
    echo Note: Certificate images are NOT included yet.
    echo.
    echo To add certificates later:
    echo 1. Remove the certificate exclusion from .gitignore
    echo 2. Run: git add public/certificates/
    echo 3. Run: git commit -m "Add certificate images"
    echo 4. Run: git push origin main
    echo.
    echo Repository URL: https://github.com/ayushjha-dev/Devnest
    echo.
) else (
    echo.
    echo Push failed. Check your internet connection.
    echo.
)

pause
