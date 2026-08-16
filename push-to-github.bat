@echo off
echo ========================================
echo Pushing DevNest to GitHub
echo ========================================
echo.
echo This may take 5-10 minutes due to large files...
echo Please wait and don't close this window.
echo.

cd /d "c:\Users\sanat\Downloads\Devnest-Web-Application-main\Devnest-Web-Application-main"

echo Pushing to GitHub...
git push -u origin main

echo.
echo ========================================
echo Done! Check above for any errors.
echo ========================================
echo.
pause
