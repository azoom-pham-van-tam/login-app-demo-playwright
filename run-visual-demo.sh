#!/bin/bash

# Script chạy Visual Demo Tests với Chrome hiển thị
# Tự động bật Chrome, điền thông tin, và chụp ảnh kết quả

echo "🎬 Khởi chạy Visual Demo Tests"
echo "================================="

# Colors for output
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[NOTE]${NC} $1"
}

# Tạo thư mục cho screenshots
mkdir -p test-results

print_info "Chuẩn bị chạy demo tests với Chrome hiển thị..."
print_warning "Chrome sẽ tự động mở và thực hiện các thao tác"
print_warning "Vui lòng không đóng cửa sổ browser trong khi test chạy"

echo ""
read -p "Nhấn Enter để bắt đầu demo..." -r

# Chạy demo tests với Chrome hiển thị
print_info "Đang chạy demo tests..."

# Chỉ chạy trên Chrome với headed mode
npx playwright test e2e/visual-demo.spec.ts \
  --project=chromium \
  --headed \
  --reporter=line \
  --workers=1

if [ $? -eq 0 ]; then
    print_success "Demo tests hoàn thành!"
    echo ""
    print_info "Screenshots đã được lưu trong thư mục: test-results/"
    echo ""
    print_info "Danh sách ảnh chụp:"
    ls -la test-results/demo-*.png 2>/dev/null || echo "Không tìm thấy ảnh demo"
    echo ""
    print_warning "Mở thư mục test-results để xem các ảnh chụp màn hình"
    
    # Mở thư mục test-results (macOS)
    if command -v open &> /dev/null; then
        print_info "Đang mở thư mục test-results..."
        open test-results/
    fi
else
    echo "❌ Demo tests thất bại!"
    exit 1
fi