# MedVault – Secure Medical Record Management System

MedVault is a premium, responsive web application designed for the modern healthcare era. It empowers patients to securely store, manage, and share their medical history with doctors instantly, while also providing robust tools for managing the health records of their entire family.

![ShieldPlus Icon](frontend/public/favicon.svg)

## 🚀 Key Features

### 🏢 Healthcare Hub
- **Premium Dashboards**: 
  - **Patients**: Features a visual **Medical Timeline**, auto-categorized record vault, and health activity summaries.
  - **Doctors**: A powerful **Clinical Directory** with real-time patient search and quick overview cards.
- **One-Click Invitations**: Doctors can generate secure, shareable links for WhatsApp or Email to connect with patients instantly.
- **Smart Onboarding**: Automated redirection system that remembers patient intent after login/signup for a friction-free experience.
- **Unique Doctor IDs**: Automatic, non-repeating identifier generation (e.g., `DOC-A1B2C`) for professional verification.
- **Enhanced Auth Experience**: Modern Login/Signup pages featuring **Glassmorphism**, decorative background blobs, and instant logout accessibility.

### 👨‍👩‍👧‍👦 Family Profile Management
- **Dependent Profiles**: Create and manage medical profiles for family members (children, spouses, parents).
- **Targeted Uploads**: Link medical records specifically to individuals during the upload process.
- **Member-Specific Filtering**: Effortlessly filter the entire medical library by family member to find records in seconds.

### 🛡️ Security & Privacy
- **Role-Based Access Control (RBAC)**: Strict separation between `Patient` and `Doctor` environments.
- **Selective Sharing**: Patients maintain total ownership—grant or revoke access to any doctor with one click.
- **JWT & Bcrypt**: Enterprise-grade security for passwords and session management.

### ⚡ Advanced UX
- **Custom Toast System**: App-wide real-time feedback for all clinical actions.
- **Visual Chronology**: Automatically generated medical timeline for better clinical context.
- **Cloudinary Storage**: Secure, encrypted storage for medical reports, scans, and prescriptions.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide React, Framer-inspired animations.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Storage**: Cloudinary (Secure File Management).
- **Communication**: Axios (API Client), Global Context API (Auth & Toasts).

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Cloudinary Account

### 2. Backend Configuration
1. Navigate to `/backend`
2. Install dependencies: `npm install`
3. Configure your `.env` file:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   ```
4. Start server: `npm run dev`

### 3. Frontend Configuration
1. Navigate to `/frontend`
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Access at `http://localhost:5173`

---

## 📈 Real-Time & Future Roadmap

- [x] **Custom Toast System**: Implemented app-wide.
- [x] **Family Management**: Full backend and frontend integration.
- [x] **Unique Doctor IDs**: Secure, non-repeating identifier generation.
- [x] **One-Click Invitations**: WhatsApp/Email shareable connect links.
- [ ] **Emergency QR ID**: Generate a secure scan-to-view card for emergencies.
- [ ] **Instant Notifications (Socket.io)**: Real-time alerts when a doctor views a record.
- [ ] **AI Summarization**: Automated analysis of uploaded medical reports.
- [ ] **Dark Mode**: High-contrast theme for nighttime clinical use.

---

## 🛡️ Security Best Practices
MedVault uses **Industry Standard Security**:
- Passwords hashed with **bcryptjs**.
- API routes protected with **JWT verification**.
- Files piped directly to Cloudinary buffers (no local temporary storage).
- Multi-layer middleware to prevent unauthorized data access between patients and doctors.

---
© {new Date().getFullYear()} MedVault Inc. Built with care for a healthier future.
