@echo off
REM Installation and Setup Script for HabitGuard (Windows)
REM Run this script to automatically set up the project

echo.
echo ================================
echo HabitGuard Setup Script (Windows)
echo ================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [X] Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js is installed: %NODE_VERSION%
echo.

REM Check if MongoDB is available
where mongod >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [!] MongoDB doesn't appear to be in PATH.
    echo     Please ensure MongoDB is running on localhost:27017
    echo     Or update MONGODB_URI in .env for remote connection
    echo.
)

REM Install dependencies
echo [*] Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [X] Failed to install dependencies
    pause
    exit /b 1
)

echo [OK] Dependencies installed successfully
echo.

REM Create .env if it doesn't exist
if not exist ".env" (
    echo [*] Creating .env file...
    (
        echo PORT=5000
        echo MONGODB_URI=mongodb://localhost:27017/habitguard
        echo NODE_ENV=development
    ) > .env
    echo [OK] .env file created
) else (
    echo [i] .env file already exists
)

echo.
echo ================================
echo Setup Complete! ^^!
echo ================================
echo.
echo Next steps:
echo 1. Ensure MongoDB is running
echo 2. Start the server: npm start
echo 3. Test API: GET http://localhost:5000/api/health
echo 4. See API_EXAMPLES.md for test cases
echo.
echo Documentation:
echo - README.md - Full API documentation
echo - QUICK_START.md - Detailed setup guide
echo - ARCHITECTURE.md - Architecture and design
echo - API_EXAMPLES.md - Test cases and examples
echo.
pause
