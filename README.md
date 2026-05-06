# 🏥 Local Clinic Management System

A full‑stack web application for small clinics to manage appointments, patients, doctors, prescriptions, and billing. The system supports three user roles: **Patients**, **Doctors**, and **Administrators**, each with a tailored dashboard and functionality.

---

## 📋 Table of Contents
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
  - [1. Clone the repository](#1-clone-the-repository)
  - [2. Backend setup](#2-backend-setup)
  - [3. Frontend setup](#3-frontend-setup)
  - [4. Environment variables](#4-environment-variables)
  - [5. Start MongoDB](#5-start-mongodb)
  - [6. Seed the database (optional)](#6-seed-the-database-optional)
  - [7. Run the application](#7-run-the-application)
- [API Documentation](#api-documentation)
- [User Roles & Permissions](#user-roles--permissions)
- [Features by Role](#features-by-role)
- [Workflow Examples](#workflow-examples)
  - [Patient books an appointment](#patient-books-an-appointment)
  - [Doctor writes a prescription](#doctor-writes-a-prescription)
  - [Admin generates a report](#admin-generates-a-report)
- [Development Guidelines](#development-guidelines)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## 💻 Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React (Vite) + Tailwind CSS         |
| Backend     | Node.js + Express                    |
| Database    | MongoDB (local)                      |
| Authentication | JWT (JSON Web Tokens)               |
| Real‑time   | Socket.IO (appointment notifications) |
| PDF Generation | jsPDF                               |
| Charts      | Chart.js / react‑chartjs‑2          |

---

## 🏗 System Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   React Client  │ ───► │   Express API   │ ───► │   MongoDB       │
│   (Port 5173)   │ ◄─── │   (Port 5000)   │ ◄─── │   (local)       │
└─────────────────┘      └─────────────────┘      └─────────────────┘
         │                       │
         └───── Socket.IO ───────┘
```

- The frontend communicates with the backend via RESTful APIs.
- Real‑time updates (new appointment, status change) are pushed via Socket.IO.
- JWT tokens are used for authentication and role‑based access control.
- All data is stored in a local MongoDB instance.

---

## 📁 Folder Structure

```
clinic-management/
├── backend/
│   ├── server.js                 # Entry point
│   ├── .env                      # Environment variables
│   ├── models/                    # Mongoose schemas
│   │   ├── User.js
│   │   ├── Patient.js
│   │   ├── Doctor.js
│   │   ├── Appointment.js
│   │   ├── Prescription.js
│   │   └── Bill.js
│   ├── routes/                    # API route handlers
│   │   ├── auth.js
│   │   ├── appointments.js
│   │   ├── patients.js
│   │   ├── doctors.js
│   │   └── prescriptions.js
│   ├── middleware/                 # Custom middleware
│   │   └── auth.js                 # JWT verification & role check
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx     # Authentication state
│   │   ├── components/              # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   ├── AppointmentForm.jsx
│   │   │   ├── PatientList.jsx
│   │   │   ├── DoctorSchedule.jsx
│   │   │   └── PrescriptionViewer.jsx
│   │   ├── pages/                   # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── PatientDashboard.jsx
│   │   │   ├── DoctorDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Appointments.jsx
│   │   │   ├── Patients.jsx
│   │   │   ├── Doctors.jsx
│   │   │   └── doctor/
│   │   │       ├── DoctorSchedule.jsx
│   │   │       └── DoctorPatients.jsx
│   │   ├── utils/                   # Helpers and API client
│   │   │   ├── api.js
│   │   │   ├── socket.js
│   │   │   ├── helpers.js
│   │   │   ├── validators.js
│   │   │   ├── constants.js
│   │   │   └── exportPDF.js
│   │   └── index.css
│   └── package.json
└── README.md
```

---

## ⚙️ Prerequisites

- **Node.js** v16 or higher
- **MongoDB** installed and running locally (default port 27017)
- **npm** or **yarn**

---

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/clinic-management.git
cd clinic-management
```

### 2. Backend setup
```bash
cd backend
npm install
```

### 3. Frontend setup
```bash
cd ../frontend
npm install
```

### 4. Environment variables

**Backend** – create a `.env` file inside `backend/`:
```env
MONGODB_URI=mongodb://localhost:27017/clinic_db
JWT_SECRET=your_super_secret_key_change_this
PORT=5000
```

**Frontend** – create a `.env` file inside `frontend/`:
```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=ClinicPro
```

### 5. Start MongoDB

**Windows** (Command Prompt as Administrator):
```cmd
net start MongoDB
```
Or run the mongod process:
```cmd
"C:\Program Files\MongoDB\Server\X.X\bin\mongod.exe" --dbpath "C:\data\db"
```

**macOS** (with Homebrew):
```bash
brew services start mongodb-community
```

**Linux** (systemd):
```bash
sudo systemctl start mongod
```

### 6. Seed the database (optional)
Populate with sample data:
```bash
cd backend
node seed.js
```

### 7. Run the application

**Backend** (from `backend/`):
```bash
npm run dev
# Server will run on http://localhost:5000
```

**Frontend** (from `frontend/` in another terminal):
```bash
npm run dev
# Client will run on http://localhost:5173
```

Open your browser at `http://localhost:5173`.

---

## 📚 API Documentation

Key endpoints (prefix `/api`). All protected routes require a valid JWT in the `Authorization` header: `Bearer <token>`.

### Authentication (`/auth`)
- `POST /register` – Register new user (patient, doctor, or admin)
- `POST /login` – Login, returns JWT and user profile
- `GET /me` – Get current logged‑in user

### Appointments (`/appointments`)
- `GET /` – List all appointments (filtered by user role)
- `POST /` – Create a new appointment
- `GET /:id` – Get appointment details
- `PUT /:id` – Update appointment (status, notes, etc.)
- `DELETE /:id` – Delete appointment (admin only)
- `GET /today/schedule` – Get today’s appointments

### Patients (`/patients`)
- `GET /` – List all patients (admin/doctor)
- `GET /:id` – Get patient details + appointment history
- `PUT /:id` – Update patient info
- `GET /search/:query` – Search patients by name/phone

### Doctors (`/doctors`)
- `GET /` – List all doctors (public)
- `GET /:id` – Get doctor profile
- `PUT /:id` – Update doctor profile (self or admin)
- `GET /profile/me` – Get own doctor profile (for logged‑in doctor)
- `PATCH /:id/availability` – Update available slots
- `GET /:id/appointments` – Get doctor’s appointments
- `GET /stats/overview` – Statistics (admin only)

### Prescriptions (`/prescriptions`)
- `POST /` – Create a prescription (doctor only)
- `GET /patient/:patientId` – Get all prescriptions for a patient
- `GET /doctor/:doctorId` – Get prescriptions written by a doctor
- `GET /:id` – Get single prescription
- `PUT /:id` – Update prescription (doctor only)

---

## 👥 User Roles & Permissions

| Role    | Capabilities                                                                 |
|---------|------------------------------------------------------------------------------|
| Patient | View own appointments, book new appointments, view prescriptions & bills.   |
| Doctor  | View today’s schedule, manage own appointments, write prescriptions, access patient records. |
| Admin   | Full CRUD on users (patients/doctors), view all appointments, manage billing, generate reports. |

---

## ✨ Features by Role

### Patients
- ✅ Online appointment booking
- ✅ View appointment history and status
- ✅ Access past prescriptions and lab results
- ✅ Receive appointment reminders (planned)
- ✅ Digital payments (placeholder)

### Doctors
- ✅ Daily schedule overview
- ✅ Instant access to patient medical history
- ✅ Digital prescription writing
- ✅ Track patient visits over time
- ✅ Manage personal availability slots

### Admins
- ✅ Approve/cancel appointments
- ✅ Manage patient and doctor records
- ✅ Generate daily/monthly reports
- ✅ Track clinic revenue
- ✅ Manage doctor schedules

---

## 🔁 Workflow Examples

### Patient books an appointment
1. Patient logs in → redirected to **Patient Dashboard**.
2. Clicks “Book New Appointment” → fills form (doctor, date, time, reason).
3. Frontend sends `POST /api/appointments` with JWT.
4. Backend validates and stores appointment (status = `scheduled`).
5. Socket.IO broadcasts `new-appointment` to all connected doctors/admins.
6. Patient sees appointment in “Upcoming Appointments” list.

### Doctor writes a prescription
1. Doctor logs in → sees today’s schedule.
2. Clicks “Start” on a patient → opens consultation page.
3. After consultation, doctor fills prescription form (diagnosis, medications, advice).
4. Frontend sends `POST /api/prescriptions` with appointment ID.
5. Backend saves prescription and updates appointment status to `completed`.
6. Prescription is now visible in patient’s history and can be downloaded as PDF.

### Admin generates a report
1. Admin logs in → sees dashboard with revenue chart and stats.
2. Clicks “Generate Reports” → selects date range.
3. Frontend requests `/api/reports` (custom endpoint).
4. Backend aggregates data from appointments and bills.
5. PDF report is generated (jsPDF) and downloaded.

---

## 🛠 Development Guidelines

- **Code style**: Use ESLint + Prettier (optional). Follow existing patterns.
- **State management**: React hooks + Context (AuthContext). For more complex state, consider Redux.
- **Styling**: Tailwind utility classes; use `@apply` sparingly in CSS files.
- **API calls**: Centralized in `src/utils/api.js` using axios interceptors for token injection.
- **Real‑time events**: Use socket.io client from `src/utils/socket.js`.
- **New features**: Add model in `backend/models/`, route handlers in `backend/routes/`, and corresponding frontend pages/components.
- **Environment variables**: Never commit `.env` files. Use `.env.example` for reference.

---

## ❗ Troubleshooting

### Backend fails to start with “argument handler must be a function”
- Make sure all route files export a valid `express.Router()`.
- Check for syntax errors in route files (run `node routes/filename.js` individually).
- Verify that all required middleware (e.g., `auth`) is properly exported and imported.
- Clear `node_modules` and reinstall: `rm -rf node_modules package-lock.json && npm install`.

### Frontend build fails with “Cannot find module”
- Ensure all imports are correct (relative paths may need `../` or `./`).
- Run `npm install` inside `frontend/` to install all dependencies.
- Check that `vite.config.js` is present and correctly configured.

### MongoDB connection error
- Ensure MongoDB is running (`mongod` process).
- Verify the connection string in `.env` matches your MongoDB instance.
- On Windows, start MongoDB as a service or run `mongod` manually.

### Socket.IO not connecting
- Confirm backend server is running.
- Check CORS settings in `server.js` – allow frontend origin (`http://localhost:5173`).
- In frontend, ensure socket connection is established after authentication.

---

## 📄 License

This project is open‑source and available under the [MIT License](LICENSE). Feel free to use and modify for your own clinic or learning purposes.

---

