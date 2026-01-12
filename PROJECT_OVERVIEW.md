# Demo App - Booking & Service Management Platform

## Project Summary

A full-stack mobile application built with React Native and Expo for both customer and business users to manage service bookings, appointments, and service listings.

## Key Features

### For Customers:

- 🔐 User authentication (Email verification with Turkish ID check)
- 📅 Browse and search available services
- 📝 Book appointments with date/time selection
- 💬 Business day selection for service booking
- 🔔 Push notifications
- 👤 Profile management

### For Businesses:

- 📊 Business dashboard
- ➕ Add and manage services
- 📅 Manage appointments and bookings
- 🖼️ Upload service images
- 📱 Device-based customer management

### Multi-Language Support:

- English (en)
- Arabic (ar)
- RTL support for Arabic

## Tech Stack

### Frontend

- **React Native** (0.76.9) - Cross-platform mobile framework
- **Expo** (52.0.46) - React Native development platform
- **Expo Router** (4.0.20) - Navigation and routing
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first styling (React Native)

### Backend & Services

- **Supabase** - Backend-as-a-Service (Authentication & Database)
- **PostgreSQL** - Database (via Supabase)
- **React Context** - State management

### UI Components

- **React Native Paper** - Material Design components
- **React Native Vector Icons** - Icon library
- **React Native Modal** - Modal dialogs
- **React Native Calendars** - Calendar component
- **Date Pickers** - Date/time selection
- **React Navigation** - Tab and stack navigation

### Development Tools

- **Jest** - Testing framework
- **Expo Lint** - Code linting
- **Babel** - JavaScript compiler

## Project Structure

```
├── app/
│   ├── _layout.tsx              # Root layout
│   ├── components/              # Reusable components
│   │   ├── BusinessDaysPicker.tsx
│   │   ├── CustomPicker.tsx
│   │   ├── DatePicker.tsx
│   │   ├── LanguageSelector.tsx
│   │   ├── TimePicker.tsx
│   │   └── css/                 # Component styles
│   ├── context/
│   │   └── UserContext.js       # User state management
│   ├── navigation/              # Navigation stacks
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── CustomerBookingNavigator.tsx
│   │   ├── HomeTabs.tsx
│   │   └── ProfileNavigator.tsx
│   ├── screens/                 # Screen components
│   │   ├── auth/                # Authentication screens
│   │   ├── bussinssScreen/      # Business screens
│   │   ├── customerScreen/      # Customer screens
│   │   ├── editProfileScreen.tsx
│   │   ├── notification.tsx
│   │   └── ProfileScreen.tsx
│   ├── supabase/                # Backend integration
│   │   ├── auth.js              # Authentication logic
│   │   ├── busuniss.js          # Business operations
│   │   ├── customer.js          # Customer operations
│   │   ├── supabase.js          # Supabase configuration
│   │   └── utils/
│   └── utils/
│       └── lang/                # Internationalization
│           ├── i18n.js
│           └── locales/         # Translation files (en.json, ar.json)
├── assets/                      # Images, fonts, icons
├── package.json
├── app.json                     # Expo configuration
├── eas.json                     # Expo Application Services config
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm
- Expo CLI: `npm install -g expo-cli`
- A Supabase account with configured project

### Installation

```bash
# Install dependencies
npm install

# Configure Supabase
# Update app/supabase/supabase.js with your Supabase URL and API key

# Start development server
npm start

# Run on different platforms:
npm run android      # Android emulator
npm run ios         # iOS simulator
npm run web         # Web browser
```

### Environment Setup

1. Create a Supabase project at https://supabase.com
2. Set up authentication with email verification
3. Create database tables for:
   - Users (with Turkish ID validation)
   - Services
   - Bookings/Appointments
   - Customers
4. Update Supabase credentials in `app/supabase/supabase.js`

## Available Scripts

```bash
npm start          # Start Expo dev server
npm run android    # Open Android emulator
npm run ios        # Open iOS simulator
npm run web        # Open web browser
npm test           # Run tests
npm run lint       # Run linter
```

## Key Functionalities

### Authentication

- Email/password registration and login
- Turkish ID number validation
- Email verification
- Profile creation for customers and businesses

### Booking System

- Browse available services
- Select date and time
- Choose business days
- Appointment confirmation
- Booking history

### Service Management

- Create and edit services
- Upload service images
- Manage pricing and availability
- Track customer bookings

### Notifications

- Push notifications for bookings
- Appointment reminders
- Status updates

## Deployment

### Mobile Apps (EAS Build)

```bash
# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

### Web

The app includes web support via Expo web. Deploy the bundled build to any static hosting (Vercel, Netlify, etc.)

## Code Quality

- TypeScript for type safety
- ESLint configuration
- Jest testing setup
- Responsive design for multiple screen sizes

## Support & Customization

This project can be:

- Extended with additional features
- Customized with your branding
- Integrated with payment systems
- Connected to different backend services

## License

0BSD

---

**Ready to launch your service booking platform!**
