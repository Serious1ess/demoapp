# Setup & Deployment Guide

## Quick Start (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

Edit `app/supabase/supabase.js`:

```javascript
const SUPABASE_URL = "your-supabase-url";
const SUPABASE_API_KEY = "your-api-key";
```

Get these from your Supabase project settings.

### 3. Start Development Server

```bash
npm start
```

### 4. Open on Device/Emulator

- **Android**: Press `a`
- **iOS**: Press `i`
- **Web**: Press `w`

---

## Database Setup

### Supabase Table Structure

#### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  user_type TEXT (customer/business),
  phone TEXT,
  full_name TEXT,
  turkish_id TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT now()
);
```

#### Services Table

```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES users(id),
  name TEXT,
  description TEXT,
  price DECIMAL,
  category TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

#### Bookings Table

```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES users(id),
  service_id UUID REFERENCES services(id),
  booking_date DATE,
  booking_time TIME,
  status TEXT (pending/confirmed/completed),
  created_at TIMESTAMP DEFAULT now()
);
```

---

## Deployment Options

### Option 1: Expo Application Services (EAS)

#### Install EAS CLI

```bash
npm install -g eas-cli
```

#### Build APK (Android)

```bash
eas build --platform android
```

#### Build IPA (iOS)

```bash
eas build --platform ios --auto-submit
```

#### Publish Update

```bash
eas update
```

### Option 2: Google Play Store

1. Create Google Play Developer account ($25 one-time)
2. Generate signing key:
   ```bash
   eas credentials
   ```
3. Submit APK:
   ```bash
   eas build --platform android --auto-submit
   ```

### Option 3: Apple App Store

1. Create Apple Developer account ($99/year)
2. Generate certificates:
   ```bash
   eas credentials
   ```
3. Submit IPA:
   ```bash
   eas build --platform ios --auto-submit
   ```

### Option 4: Web Deployment

Build for web:

```bash
expo export --platform web
```

Deploy to Vercel:

```bash
vercel deploy
```

Or use Netlify, GitHub Pages, etc.

---

## Environment Variables

Create `.env` file:

```
SUPABASE_URL=your_supabase_url
SUPABASE_API_KEY=your_api_key
EXPO_PUBLIC_API_URL=your_api_url
```

---

## Customization Examples

### Change App Name

Edit `app.json`:

```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug"
  }
}
```

### Add Payment Processing

#### Stripe Integration

```bash
npm install @stripe/stripe-react-native
```

#### PayPal Integration

```bash
npm install react-native-paypal
```

### Change Colors/Theme

Edit `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#your-color",
        secondary: "#your-color",
      },
    },
  },
};
```

### Add Notification Service

Update `app/supabase/supabase.js` with notification handlers.

---

## Testing Locally

### Test Authentication Flow

1. Sign up with test email
2. Verify email in Supabase dashboard
3. Login with credentials

### Test Booking Flow

1. Login as business user
2. Add a service
3. Logout and login as customer
4. Book the service
5. Check bookings in business dashboard

### Test on Multiple Devices

Use Expo Go:

1. Install Expo Go app
2. Scan QR code from terminal
3. App loads on your device

---

## Production Checklist

- [ ] Update app icon and splash screen
- [ ] Configure Supabase authentication methods
- [ ] Set up push notifications
- [ ] Test all user flows
- [ ] Configure payment processing
- [ ] Set up error tracking (Sentry)
- [ ] Create privacy policy
- [ ] Create terms of service
- [ ] Set up analytics
- [ ] Create app store listings
- [ ] Submit to app stores
- [ ] Monitor performance

---

## Troubleshooting

### Port Already in Use

```bash
lsof -i :8081
kill -9 <PID>
npm start
```

### Module Not Found

```bash
rm -rf node_modules
npm install
npm start
```

### Supabase Connection Issues

- Check URL and API key
- Verify network connectivity
- Check Supabase project status
- Review CORS settings

### Build Failures

```bash
expo prebuild --clean
npm install
npm start
```

---

## Performance Tips

1. Use React.memo for components
2. Optimize images before upload
3. Use pagination for lists
4. Enable code splitting
5. Monitor bundle size: `expo-env-info`

---

## Support Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [Supabase Docs](https://supabase.com/docs)
- [EAS Build Docs](https://docs.expo.dev/build/introduction/)

---

**Questions? Contact support or review the inline code comments.**
