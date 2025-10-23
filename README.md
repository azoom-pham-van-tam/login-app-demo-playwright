# Demo đơn giản testing auto với Playwright

## 1. Yêu cầu dự án (Specs)

* **Trường hợp 1: Login thành công**
    * Input: `username: admin` / `password: 123`
    * Kết quả: Login thành công -> Chuyển sang màn thông báo login thành công.
* **Trường hợp 2: Login thất bại**
    * Input: Dùng thông tin khác (ví dụ: `username: user` / `password: 1234`)
    * Kết quả: Login thất bại -> Hiển thị thông báo login thất bại.

---

## 2. Testing với Playwright MCP Server

1.  Tạo file: `/.vscode/mcp.json` với nội dung:
    ```json
    {
      "servers": {
        "playwright": {
          "command": "npx",
          "args": ["@playwright/mcp@latest"]
        }
      }
    }
    ```

2.  Nhấn nút "Start" trong file `mcp.json` (thường trong VS Code) để bắt đầu Playwright MCP Server.

3.  Gõ lệnh để khởi tạo Playwright vào trong dự án:
    ```bash
    npm init playwright@latest
    ```
    *(Lệnh này sẽ tạo ra các file cấu hình như `e2e/example.spec.js` và `playwright.config.js`)*

4.  Thêm các file instruction prompt (ví dụ: `default-instruction.md`, `login-instruction.md`).

5.  Giao tiếp với Copilot để generate các file test code (thường chứa trong thư mục `e2e`).

6.  Chạy script để thực hiện testing:
    ```bash
    ./run-interactive-demo.sh
    ```
