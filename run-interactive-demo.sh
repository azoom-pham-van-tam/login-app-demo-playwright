#!/bin/bash

echo "🎬 Bắt đầu Interactive Demo với Screenshots..."

# Tạo thư mục cho screenshots
mkdir -p test-results

# Khởi động server trong background
echo "🚀 Khởi động server..."
node server.js &
SERVER_PID=$!

# Đợi server khởi động
sleep 3

# Chạy interactive demo với Chrome
echo "🎯 Chạy Interactive Demo..."
npx playwright test interactive-demo.spec.ts --headed --project=chromium --workers=1 --timeout=60000

# Dừng server
echo "🛑 Dừng server..."
kill $SERVER_PID

echo "✅ Demo hoàn thành!"
echo "📂 Xem screenshots trong thư mục test-results/"
echo "📋 Danh sách file được tạo:"
ls -la test-results/*.png 2>/dev/null || echo "Không có screenshot nào được tạo"