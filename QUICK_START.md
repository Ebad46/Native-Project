# ⚡ React Native Quick Setup (5 minutes)

## Step 1: Prerequisites ✅

Before starting, install:
- **Node.js** (https://nodejs.org) - v16 or higher
- **Expo CLI**: `npm install -g expo-cli`
- **Supabase Account** (https://supabase.com)

Check installations:
```bash
node --version
npm --version
expo --version
```

## Step 2: Supabase Database (2 minutes)

1. Create project at https://supabase.com
2. Copy **Project URL** and **Anon Key**
3. Go to **SQL Editor**
4. Create new query
5. Paste content from `supabase_schema.sql`
6. Click **Run**

✅ Database is ready!

## Step 3: Setup React Native Project (2 minutes)

```bash
# Extract the zip file
# Open terminal in project folder

# Install dependencies
npm install

# This may take 1-2 minutes...
```

## Step 4: Configure Supabase (1 minute)

```bash
# Edit .env.local file
# Add your credentials:

EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 5: Run the App!

```bash
# Start development server
npm start

# Then choose:
# - Press 'i' for iOS simulator (Mac only)
# - Press 'a' for Android emulator
# - Or scan QR code with Expo Go app on your phone
```

## 📱 Testing Quickly

### Using Expo Go (Easiest - No Setup)
1. Download **Expo Go** app on your phone
2. Run `npm start`
3. Scan the QR code
4. App loads instantly!

### Using Simulators
- **iOS:** Requires Mac with Xcode
- **Android:** Requires Android Studio

## 🔐 Login Credentials

```
Username: admin
Password: admin
```

## ✨ What You Can Do

✅ Create/delete markets
✅ Create/delete stores
✅ Create/delete managers
✅ Assign stores to managers
✅ Managers see only their stores
✅ Everything saves to Supabase

## 🐛 If Something Breaks

| Problem | Fix |
|---------|-----|
| "Supabase not connected" | Check .env.local has correct URL and key |
| "npm install fails" | Delete node_modules, run `npm install` again |
| "App won't load" | Make sure phone and computer on same WiFi |
| "Login fails" | Verify database was created with SQL schema |

## 🎯 Next Steps

1. ✅ Extract files
2. ✅ Setup Supabase database
3. ✅ Configure .env.local
4. ✅ Run `npm install`
5. ✅ Run `npm start`
6. ✅ Test admin features
7. ✅ Create managers and stores
8. ✅ Test manager login

## 📱 Building for Production

When ready to ship:

```bash
# Create native projects
expo prebuild

# Build for stores
eas build --platform all

# Or just Android APK
eas build --platform android
```

## 💡 Tips

- Use Expo Go for fastest development
- Changes hot-reload automatically
- Can test on real device instantly
- No iOS/Android setup needed initially

## 🚀 You're Ready!

Everything is installed and configured. Just run:

```bash
npm start
```

Then open the app on your phone or simulator! 🎉

---

**Stuck?** Check README.md for detailed documentation.
