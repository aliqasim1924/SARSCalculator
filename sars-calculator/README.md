# SARS Salary Calculator

A comprehensive web application for calculating South African Revenue Service (SARS) compliant salary calculations, including PAYE tax, UIF contributions, and net salary computations.

## 🚀 Features

- **SARS 2025 Compliant**: Uses the latest tax tables and rates
- **Real-time Calculations**: Instant salary breakdowns as you type
- **Age-based Tax Relief**: Automatic rebates for different age categories
- **Comprehensive Deductions**: Medical aid, pension fund, and other deductions
- **User Management**: Authentication and profile management
- **Subscription Tiers**: Free, Business, and Enterprise plans
- **Export Capabilities**: Save and export calculation results
- **Mobile Responsive**: Works seamlessly on all devices

## 🛠️ Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Supabase (Database, Auth, API)
- **Forms**: React Hook Form with Zod validation
- **State Management**: Zustand + React Query
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Charts**: Recharts
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account and project
- Modern web browser

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sars-calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your actual values:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GITHUB_CLIENT_ID=your_github_oauth_client_id
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Set up Supabase database**
   
   Run the following SQL in your Supabase SQL editor:
   
   ```sql
   -- Create profiles table
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
     full_name TEXT,
     company_name TEXT,
     subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'business', 'enterprise')),
     subscription_status TEXT DEFAULT 'active',
     calculations_used INTEGER DEFAULT 0,
     monthly_limit INTEGER DEFAULT 10,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create calculations table
   CREATE TABLE calculations (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES profiles(id),
     employee_name TEXT,
     gross_salary DECIMAL(12,2),
     net_salary DECIMAL(12,2),
     paye_tax DECIMAL(12,2),
     uif_contribution DECIMAL(12,2),
     age_category TEXT,
     deductions JSONB,
     additions JSONB,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create SARS tax tables
   CREATE TABLE sars_tax_tables (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     tax_year INTEGER,
     bracket_min DECIMAL(12,2),
     bracket_max DECIMAL(12,2),
     rate DECIMAL(5,4),
     cumulative_tax DECIMAL(12,2),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create subscription plans
   CREATE TABLE subscription_plans (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT UNIQUE,
     price DECIMAL(8,2),
     monthly_calculations INTEGER,
     features JSONB,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable RLS
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE calculations ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
   CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
   CREATE POLICY "Users can view own calculations" ON calculations FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can insert own calculations" ON calculations FOR INSERT WITH CHECK (auth.uid() = user_id);

   -- Create triggers
   CREATE OR REPLACE FUNCTION handle_new_user()
   RETURNS TRIGGER AS $$
   BEGIN
     INSERT INTO profiles (id, full_name)
     VALUES (new.id, new.raw_user_meta_data->>'full_name');
     RETURN new;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── forms/          # Form components
│   ├── layout/         # Layout components (Header, Footer, etc.)
│   └── ui/             # Base UI components
├── contexts/           # React contexts (Auth, etc.)
├── data/              # Static data (SARS tax tables, etc.)
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and configurations
├── pages/             # Page components
├── store/             # Zustand store configurations
├── types/             # TypeScript type definitions
└── styles/            # Global styles and Tailwind config
```

## 💰 Subscription Plans

### Free Plan (R0/month)
- 10 calculations per month
- Basic SARS calculations
- Email support

### Business Plan (R89/month)
- 100 calculations per month
- Advanced features
- Export capabilities
- Priority support

### Enterprise Plan (R199/month)
- Unlimited calculations
- All premium features
- API access
- Dedicated support

## 🧮 SARS Tax Calculation Features

### 2025 Tax Year Compliance
- **Tax Brackets**: 18% to 45% progressive rates
- **Primary Rebate**: R17,235 (under 65)
- **Secondary Rebate**: R9,444 (65-75)
- **Tertiary Rebate**: R3,145 (over 75)

### Supported Calculations
- PAYE (Pay As You Earn) tax
- UIF (Unemployment Insurance Fund) contributions
- Medical aid tax credits
- Pension fund contributions
- Age-based tax rebates
- Net salary computation

## 🔐 Authentication

The application supports:
- Email/password authentication
- GitHub OAuth (optional)
- Email verification
- Password reset functionality
- Profile management

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

## 📱 API Usage

The application uses Supabase for all backend operations:

### Database Operations
- User profiles and authentication
- Salary calculations storage
- Subscription management
- Usage tracking

### Real-time Features
- Live calculation updates
- User session management
- Subscription status changes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Email: support@sarscalculator.co.za
- Documentation: [Link to docs]
- GitHub Issues: [Create an issue](../../issues)

## 🏆 Acknowledgments

- SARS for providing official tax tables and rates
- React and TypeScript communities
- Supabase for the excellent backend platform
- Tailwind CSS for the design system

---

**Made with ❤️ for South African businesses and HR professionals**
