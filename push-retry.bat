@echo off
echo DevNest GitHub Push Script (with retries)
echo ==========================================
echo.
echo This script will attempt to push to GitHub multiple times.
echo Press Ctrl+C to cancel at any time.
echo.

cd /d "%~dp0"

REM Configure git for large uploads
git config http.postBuffer 2147483648
git config core.compression 0
git config http.lowSpeedLimit 1000
git config http.lowSpeedTime 600

REM Try pushing up to 5 times
set MAX_RETRIES=5
set RETRY_COUNT=0

:retry
set /a RETRY_COUNT+=1
echo.
echo Attempt %RETRY_COUNT% of %MAX_RETRIES%...
echo.

git push -u origin main --verbose

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ==========================================
    echo SUCCESS! Code pushed to GitHub!
    echo ==========================================
    echo.
    echo Repository URL: https://github.com/ayushjha-dev/Devnest
    echo.
    echo Next steps:
    echo 1. Visit your repository on GitHub
    echo 2. Deploy to Vercel
    echo 3. Add Firebase environment variables to Vercel
    echo.
    pause
    exit /b 0
)

if %RETRY_COUNT% LSS %MAX_RETRIES% (
    echo.
    echo Push failed. Waiting 10 seconds before retry...
    timeout /t 10 /nobreak
    goto retry
)

echo.
echo ==========================================
echo FAILED after %MAX_RETRIES% attempts
echo ==========================================
echo.
echo The upload keeps timing out due to network issues.
echo.
echo Alternative solutions:
echo 1. Try again when you have a more stable internet connection
echo 2. Push the code without certificates first, then add them later
echo 3. Use Git LFS for large files
echo 4. Upload directly via GitHub web interface
echo.
pause
exit /b 1
