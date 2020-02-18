@echo off
pushd src
call npm i
popd
electron-packager src nattube --platform=win32 --arch=x64 --overwrite