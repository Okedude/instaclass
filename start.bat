@echo off
echo =========================================================
echo Starting Local Development Server
echo This fixes the 'file:///' origin CORS errors and the Gemini 404!
echo =========================================================
start http://localhost:8000/
python -m http.server 8000
