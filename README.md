# IoT Smart Warehouse Management System

Hệ thống quản lý kho thông minh tích hợp IoT, sử dụng:
- ESP32 (Sensor / RFID / Actuator / Gateway)
- ESP-NOW + MQTT
- NestJS (Backend)
- MongoDB
- Next.js (Frontend)
- WebSocket Realtime

---

## 1. Requirements

Trước khi chạy project, đảm bảo máy đã cài:

- **Node.js** >= 18  
  Kiểm tra:
  ```bash
  node -v

pnpm >= 8
Cài pnpm:

npm install -g pnpm


MongoDB

Local: mongodb://localhost:27017

Hoặc MongoDB Atlas

Internet (để dùng MQTT broker)

2. Clone project
git clone <repository-url>
cd <project-folder>

3. Install dependencies
pnpm install

4. Environment variables (.env)
4.1. Tạo file .env

Tạo file .env tại thư mục gốc của project.

# =========================
# Database
# =========================
# MongoDB connection string
# Example: mongodb://localhost:27017/iot-warehouse
MONGO_URI=

# =========================
# Backend Server
# =========================
# Port for NestJS backend
PORT=5001

# =========================
# MQTT Configuration
# =========================
# MQTT broker URL
# Example: mqtt://broker.emqx.io:1883
MQTT_ULR=http://broker.emqx.io:1883

# MQTT credentials
MQTT_USERNAME=
MQTT_PASSWORD=

# MQTT client IDs (must be unique)
MQTT_CLIENT_ID_1=
MQTT_CLIENT_ID_2=

# =========================
# JWT Authentication
# =========================
# Secret key for access token
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=3600

# Secret key for refresh token
REFRESH_JWT_SECRET=your_refresh_jwt_secret
REFRESH_JWT_EXPIRES_IN=604800

# =========================
# Mail Service
# =========================
# Resend API key or SMTP configuration
RESEND_API_KEY=

# Sender email
MAIL_FROM=

# Receiver email for alerts
MAIL_TO=

# SMTP login (if used)
MAIL_USER=
MAIL_PASS=

# =========================
# Frontend Configuration
# =========================
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001

# WebSocket URL for realtime data
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:5002

# =========================
# Session
# =========================
# Secret for session encryption
SESSION_SECRET_KEY=