#!/bin/bash
echo "🚀 Starting SpendSense Finance Tracker..."
echo ""

# Start backend
echo "📡 Starting backend server..."
cd backend
node server.js &
BACKEND_PID=$!
echo "✅ Backend running on http://localhost:3001 (PID: $BACKEND_PID)"
cd ..

sleep 1

# Start frontend
echo ""
echo "🌐 Starting frontend app..."
cd frontend
npm start &
FRONTEND_PID=$!
echo "✅ Frontend starting at http://localhost:3000"
cd ..

echo ""
echo "============================================"
echo "  💸 SpendSense is starting up!"
echo "  Open: http://localhost:3000"
echo "  Press Ctrl+C to stop both servers"
echo "============================================"

# Wait for both
wait $BACKEND_PID $FRONTEND_PID
