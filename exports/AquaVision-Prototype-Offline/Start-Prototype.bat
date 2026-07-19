@echo off
title AquaVision Prototype — Offline
cd /d "%~dp0"
echo.
echo  AquaVision Prototype (offline)
echo  Starting local server on http://localhost:4173 ...
echo  Close this window or press Ctrl+C to stop.
echo.
start "" "http://localhost:4173"
npx --yes serve -s . -l 4173
