# 🌹 Rose Café eMenu

An interactive digital menu system built for **Rose Café**, designed to provide a modern, user-friendly, and mobile-friendly way to browse food and drinks.  
The project consists of **three main parts**:  

1. **📱 App & Dashboard** – The main menu and management dashboard.  
2. **🌐 Static Version** – A fallback static menu that works when the database connection fails (e.g., in regions like Iran where Firebase is filtered).  
3. **🔥 Backend / Database Setup** – Firestore, Firebase Hosting, and GraphQL DataConnect.  

---

## 🚀 Features
- Modern responsive design (Tailwind CSS + React)
- Customer-facing app with digital menu
- Dashboard for café staff to manage items
- Firebase Firestore for dynamic data
- GraphQL DataConnect for structured queries
- Static fallback version to ensure access without Firebase
- PWA support for mobile and offline use
- Custom icons, splash screens, and Farsi font (Yekan Bakh)

---

## 🛠️ Tech Stack
- [React](https://react.dev/) (with TypeScript)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/) (Firestore, Hosting, Auth, Storage)
- [GraphQL](https://graphql.org/) (Firebase DataConnect)
- [Expo](https://expo.dev/) (for app development)

---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/emenu.git
cd emenu-main
```

### 2. Install dependencies
```bash
cd emenu-app-dashboard
npm install
```

### 3. Run the app
```bash
npm start
```

### 4. Build for production
```bash
npm run build
```

### 5. Deploy to Firebase
```bash
firebase deploy
```

---

## 🌐 Static Version
The static fallback menu is located in the `emenu-static/` folder.  
It is a lightweight version of the menu that works without Firebase.  

This is especially useful in **Iran**, where Firebase filtering sometimes prevents the app from connecting to the database. Customers can still access the menu seamlessly.

---

## 🔒 Firebase Setup
1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable Firestore, Authentication, and Hosting.
3. Replace Firebase config in your project.
4. Apply Firestore rules from `firestore.rules`.
5. Set up GraphQL DataConnect if needed.

---

## 📜 License
This project is licensed under the MIT License.  
Feel free to use and adapt for your own café or restaurant projects.

---

## 👨‍💻 Author
Developed by **Ali Abdollahzadeh** for **Rose Café**.
