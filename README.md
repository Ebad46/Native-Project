# Brake Time - React Native Mobile App

A complete role-based access control system for managing stores, markets, and market managers built with React Native and TypeScript.

## 📦 Technology Stack

- **React Native** - Cross-platform mobile development
- **Expo** - Development framework and build service
- **TypeScript** - Type-safe development
- **Supabase** - Backend database and authentication
- **React Navigation** - Mobile navigation
- **AsyncStorage** - Persistent local storage

## ✨ Features

✅ Native mobile app for iOS and Android
✅ Admin dashboard with full control
✅ Manager portal with data isolation
✅ Store-to-manager assignment management
✅ Real-time database synchronization
✅ Offline-capable with AsyncStorage
✅ Professional mobile UI
✅ Role-based access control

## 📋 Project Structure

```
brake-time-app/
├── App.tsx                      # Main navigation component
├── src/
│   ├── screens/
│   │   ├── LoginScreen.tsx      # Login page
│   │   ├── AdminDashboardScreen.tsx
│   │   └── ManagerDashboardScreen.tsx
│   ├── context/
│   │   └── AuthContext.tsx      # Auth state management
│   ├── lib/
│   │   ├── supabase.ts          # Supabase client
│   │   └── db.ts                # Database services
│   └── types/
│       └── index.ts             # TypeScript types
├── package.json
├── app.json                     # Expo config
├── tsconfig.json
└── .env.local                   # Environment variables
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Supabase account with database created

### Step 1: Setup Supabase

1. Create a Supabase project at https://supabase.com
2. Get your Project URL and Anon Key
3. In SQL Editor, run `supabase_schema.sql`

### Step 2: Install Dependencies

```bash
# Navigate to project directory
cd brake-time-app

# Install dependencies
npm install

# Or with yarn
yarn install
```

### Step 3: Configure Environment Variables

```bash
# Edit .env.local with your Supabase credentials
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Step 4: Run the App

```bash
# Start Expo development server
npm start

# Or with yarn
yarn start

# Then choose:
# - Press 'i' for iOS simulator (Mac only)
# - Press 'a' for Android emulator
# - Scan QR code with Expo Go app on physical device
```

## 📱 Running on Devices

### iOS
```bash
npm run ios
# Requires Mac with Xcode installed
```

### Android
```bash
npm run android
# Requires Android Studio and Android SDK
```

### Expo Go (Easiest)
1. Install Expo Go app on your phone (iOS App Store or Google Play)
2. Run `npm start`
3. Scan the QR code with your phone's camera
4. App opens in Expo Go

## 🔐 Default Login Credentials

**Admin User:**
- Username: `admin`
- Password: `admin`

## 📖 Usage Guide

### Admin Features

1. **Login** with admin credentials
2. **Manage Markets**
   - Create new markets
   - Delete markets
   - View market statistics

3. **Manage Stores**
   - Create stores and assign to markets
   - Select stores to assign managers
   - Delete stores

4. **Manage Managers**
   - Add market managers with email
   - Assign managers to markets
   - Delete managers

5. **Assign Stores to Managers**
   - Tap on a store
   - Toggle manager switches to assign/unassign
   - Changes save immediately

### Manager Features

1. **Login** with manager credentials
2. **View Profile**
   - See manager name and email
   - View assigned market

3. **View Assigned Stores**
   - See only stores assigned by admin
   - View store details

## 🗄️ Database Schema

All tables are the same as the web version:

```
users
├── id
├── username
├── password
├── role ('admin' or 'market_manager')
└── manager_id (FK)

markets
├── id
└── name

market_managers
├── id
├── name
├── email
└── market_id

stores
├── id
├── store_name
└── market_id

market_manager_stores
├── manager_id
└── store_id
```

## ⚙️ Build and Distribution

### Build APK (Android)
```bash
eas build --platform android
```

### Build IPA (iOS)
```bash
eas build --platform ios
```

### Building Locally
```bash
# Android
npm run android

# iOS (Mac only)
npm run ios
```

## ⚠️ Security Notes

### Current Implementation
- Plaintext passwords (for demo only)
- AsyncStorage for session persistence

### Production Requirements
1. **Add Password Hashing**
   ```bash
   npm install bcryptjs
   ```

2. **Enable Supabase RLS**
   - Set up Row Level Security policies
   - Restrict data access by role

3. **Secure Storage**
   ```bash
   npm install react-native-keychain
   ```
   - Store sensitive data in secure enclave

4. **SSL/TLS**
   - Ensure all API calls use HTTPS

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| `Supabase connection failed` | Check EXPO_PUBLIC_SUPABASE_URL and ANON_KEY in .env.local |
| `Tables don't exist` | Run supabase_schema.sql in Supabase SQL Editor |
| `npm install fails` | Delete node_modules and package-lock.json, reinstall |
| `Expo Go won't load` | Ensure phone and computer are on same WiFi network |
| `Login fails` | Verify admin user exists in database |
| `Stores not showing for manager` | Check if stores are assigned to the manager_id in database |

## 📚 Dependencies Explained

```json
{
  "react-native": "Cross-platform mobile framework",
  "expo": "Development and building platform",
  "@react-navigation/native": "Navigation between screens",
  "@react-navigation/bottom-tabs": "Tab navigation (if needed)",
  "@react-navigation/stack": "Stack navigation",
  "@react-native-async-storage/async-storage": "Persistent storage",
  "@supabase/supabase-js": "Database and backend",
  "react-native-paper": "Material Design UI components",
  "zustand": "State management (optional, ready to use)"
}
```

## 🔄 Data Flow

```
Login Screen
    ↓
[Enter credentials]
    ↓
[Query users table in Supabase]
    ↓
[Save to AsyncStorage]
    ↓
[Route to Admin or Manager Dashboard]
    ↓
[Fetch data from Supabase in real-time]
    ↓
[Display and manage data]
```

## 🚀 Deployment

### Option 1: Expo Hosting
```bash
eas build --platform all
eas submit --platform ios --latest
eas submit --platform android --latest
```

### Option 2: Custom Build
```bash
# Generate native project
expo prebuild

# Build with Xcode or Android Studio
```

### Option 3: APK Only (Android)
```bash
eas build --platform android --local
```

## 📞 Support

- **Expo Docs:** https://docs.expo.dev
- **React Native Docs:** https://reactnative.dev
- **Supabase Docs:** https://supabase.com/docs
- **React Navigation:** https://reactnavigation.org

## 📝 License

This project is open source and available for use.

---

## Quick Commands Reference

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Build for production
eas build --platform all

# View logs
npm start -- --verbose

# Clear Expo cache
expo start -c
```

---

**Version:** 1.0.0
**Last Updated:** December 20, 2025
**Status:** Production Ready (Add Security Enhancements)
