# Aeon Bank

**What it is:** A mock mobile banking app built with React Native and Expo.  
**The Test PIN:** `123456`

---

### Features (TL;DR)
* **Login:** Mock secure PIN screen.
* **Dashboard:** See transactions. 
* **Filters:** Sort by Date, Amount, Incoming, or Outgoing.
* **Receipts:** Tap a transaction to see details and share a text receipt.

---

### Android APK

**Download** the `.apk` or run it on expo *https://expo.dev/accounts/fadlizaini/projects/aeon-bank/builds/e81d96b8-c158-483c-83ce-b9ef17cd6942*.

---

### Run the code locally
**You need:** Node.js (>=v22) installed & the Expo Go app on your phone.

1. **Get the code:**
```bash
git clone https://github.com/fadlizaini/aeon-bank.git
cd aeon-bank
```

2. **Install the code:**
```bash
npm install
```

3. **Start the server:**
```bash
npx expo start -c
```

3. **Open the app:**
* Press **`i`** in the terminal for iOS Simulator.
* Press **`a`** for Android Emulator.
* **Or scan the QR code** with your phone's camera.

### Build the code
Want to generate your own `.apk` or iOS files? We use EAS (Expo Application Services).

1. **Install the builder:**
```bash
npm install -g eas-cli
```

2. **Install the npm:**
```bash
npm install
```

3. **Log in to Expo:**
```bash
eas login
```

4. **Build Android (Test APK):**
```bash
eas build -p android --profile preview
```

5. **Build iOS (Test Simulator):**
```bash
eas build -p ios --profile preview
```

6. **Build Android (Production AAB):**
```bash
eas build -p android --profile production
```