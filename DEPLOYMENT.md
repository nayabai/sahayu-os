# Sahayu OS - Zero-Configuration Deployment Guide (Render.com & Self-Hosted)

Sahayu is engineered to run **100% self-contained out-of-the-box with zero external API keys, zero cloud databases, and zero payment gateway merchant onboarding required**.

---

## ⚡ 1-Click Deploy on Render.com

1. Create a **New Web Service** connected to your GitHub repository (`sahayu-os`).
2. Set configuration:
   - **Environment**: `Node`
   - **Build Command**:
     ```bash
     yarn install; yarn build
     ```
   - **Start Command**:
     ```bash
     yarn start
     ```
3. **Environment Variables**: **None required!** The application starts immediately and runs with all features fully functional.

---

## 🛡️ Built-in Zero-Config Alternatives

| Feature | External API (Skipped) | Built-in Active Alternative | Status |
| :--- | :--- | :--- | :---: |
| **Database** | `DATABASE_URL` (PostgreSQL) | **Persistent Local File Database** (`data/sahayu_db.json`). Automatically saves & hydrates jobs, workers, applications, reviews, chat messages, and disputes across restarts. | ✅ Active |
| **Interactive Maps** | `GOOGLE_MAPS_API_KEY` (Google Maps) | **OpenStreetMap + Leaflet + Pune GPS Engine**. High-resolution street map with real Pune GPS coordinates across 30+ neighborhoods (Kharadi, Kothrud, Baner, Viman Nagar, Hinjewadi, Hadapsar, etc.), custom worker pins, and live filters. Free with zero quotas. | ✅ Active |
| **Payment Gateway** | `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET` | **Native Dynamic UPI QR Engine & Escrow Gateway**. Live dynamic UPI QR code generator (`upi://pay`), one-click mobile UPI intent (GPay, PhonePe, Paytm, BHIM), Cash on Hand, and instant digital tax invoice generator. | ✅ Active |
| **Alerts & Messages** | `WHATSAPP_BUSINESS_TOKEN` | **Real-Time In-App Alert Bell, Masked Phone Dialer, & Direct Chat**. Complete communication system with zero Meta approval requirements. | ✅ Active |

---

## 🔍 Verification Endpoints

Verify your live service:

- **Health Check & Service Status**:
  ```bash
  curl https://your-service.onrender.com/api/health
  ```
  Returns:
  ```json
  {
    "status": "ok",
    "service": "Sahayu Pune Local Services",
    "locality": "Pune, Maharashtra",
    "database": "Built-in Persistent Local Store (Active)",
    "integrations": {
      "database": "Built-in File Store (Zero-Config)",
      "maps": "Built-in OpenStreetMap & Local Pune GPS Geocoding (Zero-Config)",
      "payments": "Built-in Native UPI Dynamic QR & Instant Settlement (Zero-Config)"
    }
  }
  ```
