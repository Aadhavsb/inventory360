# Inventory360 - Wildlife SOS Conservation Asset Management 🌿

A comprehensive asset management system designed for Wildlife SOS rescue centers across India. Track medical supplies, equipment, and resources for wildlife conservation with real-time updates and advanced filtering capabilities.

![Wildlife SOS Logo](public/download%20(2).jpg)

## 🚀 Features

### Core Functionality
- **Asset Management**: Add, view, edit, and track conservation assets
- **Real-time Updates**: Automatic table refresh after asset operations
- **Location-based Filtering**: Filter assets by Wildlife SOS rescue centers
- **Asset Type Filtering**: Filter by long-term equipment, medical supplies, or perishable items
- **Search Functionality**: Search assets by name, description, or details
- **CSV Export**: Export filtered asset data with summary statistics

### Authentication & Security
- **Google OAuth Integration**: Secure login with Google accounts
- **Session Management**: NextAuth.js-based authentication
- **User Tracking**: "Logged By" field tracks who added/updated assets
- **Protected Routes**: Middleware-based route protection

### Data Management
- **MongoDB Integration**: Mongoose-based database operations
- **Data Validation**: Zod schema validation for all inputs
- **Error Handling**: Comprehensive error handling and user feedback
- **Database Health Monitoring**: API endpoints for system diagnostics

### User Experience
- **Responsive Design**: Mobile-first design using Tailwind CSS
- **Wildlife SOS Branding**: Custom theme with organization colors and branding
- **Loading States**: Smooth loading animations and feedback
- **Form Validation**: Real-time form validation with helpful error messages
- **Toast Notifications**: Success and error feedback for user actions

## 🛠 Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Custom Wildlife SOS theme
- **Authentication**: NextAuth.js with Google Provider
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Zod schema validation
- **Form Handling**: React Hook Form with Zod resolver
- **Deployment**: Vercel-ready with environment configuration

## 🏥 Wildlife SOS Centers Supported

The system supports asset tracking across all major Wildlife SOS facilities:
- Elephant Conservation and Care Centre
- Agra Bear Rescue Facility
- Bannerghatta Bear Rescue Centre
- Manikdoh Leopard Rescue Centre
- Elephant Hospital
- Dachigam Rescue Centre
- Pahalgam Rescue Centre
- Elephant Rehabilitation Centre
- Wildlife SOS Transit Facility
- Human Primate Conflict Mitigation Centre
- Van Vihar Bear Rescue Facility
- West Bengal Bear Rescue Centre

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB database (local or Atlas)
- Google OAuth credentials

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Aadhavsb/inventory360.git
cd inventory360
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
```bash
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# NextAuth.js
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build
```bash
npm run build
npm start
```

## 📁 Project Structure

```
inventory360/
├── app/
│   ├── api/                    # API routes
│   │   ├── asset/             # Asset CRUD operations
│   │   ├── auth/              # NextAuth configuration
│   │   └── debug/             # System diagnostics
│   ├── inventory/             # Main inventory dashboard
│   │   ├── AssetForm.tsx      # Asset creation/editing form
│   │   ├── AssetTable.tsx     # Asset display and management
│   │   └── ui.tsx             # Main dashboard UI
│   ├── login/                 # Authentication pages
│   └── globals.css            # Global styles and Wildlife SOS theme
├── lib/
│   ├── models/                # MongoDB/Mongoose models
│   ├── auth.ts                # NextAuth configuration
│   ├── mongodb.ts             # Database connection
│   └── validation.ts          # Zod schemas
├── public/                    # Static assets and logo
└── middleware.ts              # Route protection and rate limiting
```

## 🔧 API Endpoints

### Assets
- `GET /api/asset` - Fetch all assets
- `POST /api/asset` - Create new asset
- `PUT /api/asset` - Update existing asset

### Authentication
- `POST /api/auth/signin` - Google OAuth signin
- `POST /api/auth/signout` - User signout

### System
- `GET /api/debug` - System health check
- `GET /api/test-db` - Database connectivity test

## 🎨 Customization

The application uses a custom Wildlife SOS theme defined in `tailwind.config.js`:
- **Primary Green**: `#2D5016` (wildlife-green)
- **Background**: `#F8F6F0` (wildlife-ivory)
- **Accent Colors**: Various shades for different UI elements
- **Typography**: Poppins font family for modern, clean appearance

## 🔒 Security Features

- **Environment Variable Protection**: Sensitive data in environment variables
- **Git History Cleaning**: Removed any accidentally committed secrets
- **Rate Limiting**: API endpoint protection against abuse
- **Input Validation**: Comprehensive client and server-side validation
- **Session Security**: Secure JWT-based session management

## 📊 Asset Data Structure

Each asset contains:
- **Basic Information**: Name, type, status, acquisition method
- **Location Data**: Wildlife SOS center assignment
- **Temporal Data**: Acquisition date, creation/update timestamps
- **User Tracking**: Who logged/updated the asset
- **Additional Details**: Optional description field

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
Ensure all environment variables are properly set in your deployment platform:
- `MONGODB_URI`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is built for Wildlife SOS conservation efforts. Please respect the organization's mission and use responsibly.

## 🆘 Support

For support or questions:
- Create an issue in the GitHub repository  
- Contact the Wildlife SOS technical team
- Check the documentation for common solutions

---

**Built with ❤️ for Wildlife Conservation**

*Inventory360 helps Wildlife SOS rescue centers efficiently manage their conservation assets, ensuring better care for rescued wildlife across India.*
