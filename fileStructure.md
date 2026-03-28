# File Tree: stealth

**Root Path:** `c:\Users\USER\OneDrive\Documents\GitHub\stealth`

```
├── 📁 .github
│   └── 📁 appmod
│       └── 📁 appcat
├── 📁 backend
│   ├── 📁 api
│   │   ├── 📁 auth
│   │   │   ├── 🐍 activate.py
│   │   │   ├── 🐍 login.py
│   │   │   ├── 🐍 logout.py
│   │   │   ├── 🐍 me.py
│   │   │   ├── 🐍 refreshToken.py
│   │   │   └── 🐍 signup.py
│   │   ├── 📁 cloudinary
│   │   │   ├── 🐍 deleteCloudinaryFile.py
│   │   │   └── 🐍 getCloudinarySignature.py
│   │   ├── 📁 doctor
│   │   ├── 📁 patients
│   │   │   ├── 🐍 getPatientByPatientId.py
│   │   │   ├── 🐍 getPatients.py
│   │   │   └── 🐍 getVisitByVisitId.py
│   │   ├── 📁 profile
│   │   │   ├── 🐍 completeProfile.py
│   │   │   └── 🐍 updateProfile.py
│   │   ├── 📁 session
│   │   │   ├── 🐍 getAllSessions.py
│   │   │   ├── 🐍 logoutAllDeviceBYUserId.py
│   │   │   └── 🐍 logoutDeviceBySessionId.py
│   │   ├── 🐍 __init__.py
│   │   └── 🐍 createConsulation.py
│   ├── 📁 db
│   │   ├── 🐍 __init__.py
│   │   ├── 🐍 mongo_client.py
│   │   └── 🐍 users.py
│   ├── 📁 llm
│   │   ├── 🐍 __init__.py
│   │   ├── 🐍 gemini_client.py
│   │   ├── 🐍 prompts.py
│   │   └── 🐍 soap_generator.py
│   ├── 📁 schemas
│   │   ├── 🐍 __init__.py
│   │   ├── 🐍 auth.py
│   │   ├── 🐍 schema.py
│   │   └── 🐍 sessions.py
│   ├── 📁 stt
│   │   ├── 🐍 parse_transcription.py
│   │   └── 🐍 transcribe.py
│   ├── 📁 utils
│   │   ├── 🐍 __init__.py
│   │   ├── 🐍 cloudinary.py
│   │   ├── 🐍 email_helper.py
│   │   ├── 🐍 get_device_info.py
│   │   ├── 🐍 jwt_helper.py
│   │   ├── 🐍 security.py
│   │   └── 🐍 uniqueid.py
│   ├── ⚙️ .env.example
│   ├── ⚙️ .gitignore
│   ├── 🐍 main.py
│   └── 📄 requirements.txt
├── 📁 frontend
│   ├── 📁 public
│   │   └── 🖼️ vite.svg
│   ├── 📁 src
│   │   ├── 📁 components
│   │   │   ├── 📁 audioRecorder
│   │   │   │   └── 📄 NewConsultationCard.tsx
│   │   │   ├── 📁 home
│   │   │   │   ├── 📄 benefits.tsx
│   │   │   │   ├── 📄 hero.tsx
│   │   │   │   ├── 📄 process.tsx
│   │   │   │   └── 📄 workFlowDemo.tsx
│   │   │   ├── 📁 ui
│   │   │   │   ├── 📄 alert.tsx
│   │   │   │   ├── 📄 animated-theme-toggler.tsx
│   │   │   │   ├── 📄 badge.tsx
│   │   │   │   ├── 📄 button.tsx
│   │   │   │   ├── 📄 card.tsx
│   │   │   │   ├── 📄 checkbox.tsx
│   │   │   │   ├── 📄 dialog.tsx
│   │   │   │   ├── 📄 dropdown-menu.tsx
│   │   │   │   ├── 📄 input.tsx
│   │   │   │   ├── 📄 label.tsx
│   │   │   │   ├── 📄 radio-group.tsx
│   │   │   │   ├── 📄 scroll-area.tsx
│   │   │   │   ├── 📄 select.tsx
│   │   │   │   ├── 📄 separator.tsx
│   │   │   │   ├── 📄 table.tsx
│   │   │   │   └── 📄 tabs.tsx
│   │   │   ├── 📄 AudioRecorder.tsx
│   │   │   ├── 📄 Footer.tsx
│   │   │   ├── 📄 ManageSessions.tsx
│   │   │   ├── 📄 ModeToggle.tsx
│   │   │   ├── 📄 Navbar.tsx
│   │   │   ├── 📄 PatientDetailsModal.tsx
│   │   │   ├── 📄 ProtectedRoute.tsx
│   │   │   ├── 📄 RecordingConsultationCard.tsx
│   │   │   ├── 📄 Stepper.tsx
│   │   │   ├── 📄 Waveform.tsx
│   │   │   └── 📄 theme-provider.tsx
│   │   ├── 📁 context
│   │   │   └── 📄 AuthContext.tsx
│   │   ├── 📁 layouts
│   │   │   ├── 📄 DoctorLayout.tsx
│   │   │   └── 📄 PublicLayout.tsx
│   │   ├── 📁 lib
│   │   │   └── 📄 utils.ts
│   │   ├── 📁 pages
│   │   │   ├── 📁 doctor
│   │   │   │   ├── 📄 RC.tsx
│   │   │   │   ├── 📄 dashboard.tsx
│   │   │   │   ├── 📄 patients.tsx
│   │   │   │   ├── 📄 profile.tsx
│   │   │   │   ├── 📄 setting.tsx
│   │   │   │   ├── 📄 viewPatientDetails.tsx
│   │   │   │   └── 📄 viewPatientVisitDetails.tsx
│   │   │   ├── 📁 public
│   │   │   │   ├── 📄 NotFound.tsx
│   │   │   │   ├── 📄 about.tsx
│   │   │   │   ├── 📄 forgotPassword.tsx
│   │   │   │   ├── 📄 getActivationToken.tsx
│   │   │   │   ├── 📄 home.tsx
│   │   │   │   ├── 📄 login.tsx
│   │   │   │   ├── 📄 register.tsx
│   │   │   │   └── 📄 resetPassword.tsx
│   │   │   └── 📄 test.tsx
│   │   ├── 📁 routes
│   │   │   └── 📄 AppRoutes.tsx
│   │   ├── 📄 App.tsx
│   │   ├── 📄 main.tsx
│   │   ├── 🎨 style.css
│   │   └── 🖼️ typescript.svg
│   ├── ⚙️ .env.example
│   ├── ⚙️ .gitignore
│   ├── ⚙️ components.json
│   ├── 🌐 index.html
│   ├── ⚙️ package-lock.json
│   ├── ⚙️ package.json
│   ├── ⚙️ tsconfig.json
│   └── 📄 vite.config.ts
└── ⚙️ .gitignore
```


