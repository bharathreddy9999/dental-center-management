# 🦷 Dental Center Management System - ENTNT Assignment

A comprehensive, professional dental practice management solution built with React for the ENTNT Technical Assignment, featuring role-based access, patient management, appointment scheduling, and financial tracking.

## 🌟 Project Overview

This modern dental management system is developed specifically for ENTNT's technical assessment requirements. It provides a complete digital solution for dental practices with separate interfaces for administrators and patients, emphasizing clean code architecture, user experience, and professional design with a gold-themed UI, dark mode support, and fully responsive layouts.

## � Key Features

### 👨‍⚕️ **Administrator Features**

#### **Dashboard & Analytics**
- **Real-time Overview**: Monitor practice performance with live statistics
- **Patient Metrics**: Track total patients, active cases, and growth trends
- **Financial Insights**: View daily, weekly, and monthly revenue with interactive charts
- **Appointment Analytics**: Monitor booking patterns and schedule efficiency
- **Quick Stats**: At-a-glance view of today's appointments and pending tasks

#### **Patient Management**
- **Complete Patient Profiles**: Store detailed patient information including personal details, medical history, and emergency contacts
- **Advanced Search & Filtering**: Quickly find patients using multiple criteria
- **Patient History Tracking**: Comprehensive view of all treatments, visits, and interactions
- **Health Information Management**: Securely store allergies, medical conditions, and treatment preferences
- **Insurance & Billing Information**: Track insurance details and billing preferences

#### **Appointment Scheduling**
- **Interactive Calendar**: Visual appointment scheduling with drag-and-drop functionality
- **Appointment Management**: Create, modify, reschedule, and cancel appointments
- **Status Tracking**: Monitor appointment progress (Scheduled, In Progress, Completed, Cancelled)
- **Treatment Planning**: Link appointments to specific treatments and procedures
- **Reminder System**: Built-in appointment reminders and notifications

#### **Treatment & Incident Management**
- **Treatment Records**: Detailed documentation of all dental procedures
- **Progress Tracking**: Monitor treatment progress from consultation to completion
- **Cost Management**: Track treatment costs and payment status
- **File Attachments**: Upload and manage X-rays, photos, treatment plans, and invoices
- **Clinical Notes**: Secure storage of doctor notes and treatment observations

#### **Financial Management**
- **Revenue Tracking**: Monitor income from treatments and procedures
- **Cost Breakdown**: Detailed view of treatment costs and patient payments
- **Payment Status**: Track pending, partial, and completed payments
- **Financial Reports**: Generate comprehensive financial reports
- **Currency Support**: All amounts displayed in Indian Rupees (₹)

### 👤 **Patient Features**

#### **Personal Dashboard**
- **Welcome Experience**: Personalized greeting with patient name and status
- **Appointment Overview**: Quick view of upcoming and past appointments
- **Treatment Summary**: Overview of completed treatments and associated costs
- **Account Status**: Clear indication of account standing and any pending items

#### **Appointment Management**
- **My Appointments**: View all scheduled, completed, and cancelled appointments
- **Appointment History**: Comprehensive history of all dental visits
- **Treatment Details**: Access detailed information about each treatment received
- **Appointment Filtering**: Easily filter appointments by status (upcoming, completed, cancelled)
- **Date & Time Information**: Clear display of appointment schedules

#### **Treatment History**
- **Complete Treatment Records**: Access to all past dental procedures
- **Treatment Costs**: Transparent view of all treatment expenses
- **Progress Tracking**: See the progression of ongoing treatments
- **Doctor's Notes**: View clinical observations and treatment recommendations
- **Treatment Outcomes**: Review results and follow-up requirements

#### **Document Access**
- **Medical Files**: Access to X-rays, treatment plans, and medical images
- **Invoices & Receipts**: Download treatment invoices and payment receipts
- **File Management**: Organized storage of all patient-related documents
- **Secure Download**: Safe and secure file access with proper authentication

## 🎨 **User Experience Features**

### **Visual Design**
- **Professional Gold Theme**: Elegant gold and amber color scheme that conveys trust and professionalism
- **Dark Mode Support**: Complete dark mode implementation for comfortable viewing in any lighting
- **Responsive Design**: Seamlessly adapts to desktop, tablet, and mobile devices
- **Modern UI Components**: Clean, contemporary interface elements with smooth animations
- **Intuitive Navigation**: Logical menu structure and clear visual hierarchy

### **Special Welcome Experience**
- **ENTNT Team Greeting**: 5-second "Welcome ENTNT Team" animation on first load
- **Landscape Login Form**: Professional two-panel login interface with branding
- **Smooth Transitions**: Elegant animations between login states

### **Accessibility & Usability**
- **Role-Based Interface**: Customized experience based on user role (Admin vs Patient)
- **Smooth Animations**: Professional transitions and hover effects for enhanced interaction
- **Loading States**: Clear feedback during data loading and processing
- **Error Handling**: Comprehensive error messages and graceful failure handling
- **Keyboard Navigation**: Full keyboard accessibility support

## � **Security & Access Control**

### **Authentication System**
- **Secure Login**: Email and password-based authentication
- **Role-Based Access**: Separate interfaces and permissions for Admin and Patient roles
- **Session Management**: Secure session handling with automatic timeout
- **Data Privacy**: Patients can only access their own information

### **Data Protection**
- **Secure Data Storage**: Encrypted storage of sensitive patient information
- **Access Logging**: Track user access and system usage
- **Privacy Compliance**: Designed with healthcare privacy regulations in mind
- **Backup & Recovery**: Automatic data backup and recovery mechanisms

## 🚀 **Getting Started**

### **Demo Credentials**

#### **Administrator Access**
- **Email**: admin@entnt.in
- **Password**: admin123
- **Access**: Full system administration with all features

#### **Patient Access**
- **Email**: john@entnt.in
- **Password**: patient123
- **Access**: Personal patient portal with appointment and treatment history

### **First-Time Setup**
1. **Welcome Screen**: Experience the 5-second "Welcome ENTNT Team" greeting
2. **Login**: Use the provided demo credentials to explore the system
3. **Data Reset**: Use the "Reset Data" button to restore sample data if needed
4. **Exploration**: Navigate through different sections to experience all features

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dental-center-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## 👥 Demo Credentials

### Admin Access
- **Email**: admin@entnt.in
- **Password**: admin123
- **Access**: Full administrative privileges

### Patient Access
- **Patient 1**: john@entnt.in / patient123
- **Patient 2**: jane@entnt.in / patient123  
- **Patient 3**: mike@entnt.in / patient123
- **Access**: Limited to personal data only

## 🏗️ Project Architecture

### Folder Structure
```
src/
├── components/          # Reusable UI components
│   ├── Dashboard.jsx           # Main dashboard with analytics
│   ├── PatientsTable.jsx      # Patient management interface
│   ├── IncidentManagement.jsx # Appointment management
│   ├── CalendarPage.jsx       # Calendar views
│   ├── PatientForm.jsx        # Patient creation/editing form
│   ├── IncidentForm.jsx       # Appointment creation/editing form
│   ├── MainLayout.jsx         # Layout wrapper with sidebar
│   ├── Sidebar.jsx            # Navigation sidebar
│   ├── RevenueChart.jsx       # Revenue visualization
│   └── TopPatientsCard.jsx    # Top patients widget
├── context/             # Global state management
│   ├── AuthContext.jsx        # Authentication state
│   └── AppDataContext.jsx     # Application data state
├── App.js              # Main application component
├── index.js            # Application entry point
└── index.css           # Global styles
```

### State Management Architecture

#### AuthContext
- User authentication state
- Login/logout functionality
- Role-based access control
- Session persistence

#### AppDataContext
- Patient data management (CRUD operations)
- Appointment/incident management
- File upload handling
- Analytics and reporting functions
- LocalStorage integration

### Key Components

#### Dashboard
- Real-time KPI metrics
- Revenue analytics with charts
- Today's schedule and upcoming appointments
- Quick insights and completion rates
- Responsive grid layout

#### Patient Management
- Comprehensive patient profiles
- Advanced search and filtering
- Sortable data tables
- CRUD operations with validation
- Statistics and analytics

#### Appointment Management
- Full appointment lifecycle management
- File attachment support
- Status tracking and updates
- Patient-specific views
- Treatment history

#### Calendar System
- Monthly and weekly views
- Appointment visualization
- Interactive date selection
- Quick appointment creation
- Status-based color coding

## 💾 Data Structure

### Patient Schema
```javascript
{
  id: string,
  name: string,
  dob: string,
  contact: string,
  email: string,
  address: string,
  emergencyContact: string,
  healthInfo: string,
  bloodGroup: string,
  medicalHistory: string,
  insurance: string,
  createdAt: string
}
```

### Appointment/Incident Schema
```javascript
{
  id: string,
  patientId: string,
  title: string,
  description: string,
  comments: string,
  appointmentDate: string,
  cost: number,
  treatment: string,
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'Rescheduled',
  nextAppointmentDate: string,
  files: Array<{
    name: string,
    url: string,
    type: string,
    size: number,
    uploadedAt: string
  }>,
  createdAt: string,
  completedAt: string
}
```

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Blue-based theme with semantic colors
- **Typography**: System fonts with clear hierarchy
- **Spacing**: Consistent 8px grid system
- **Shadows**: Layered shadow system for depth
- **Border Radius**: Rounded corners for modern feel

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: Responsive across all screen sizes
- **Touch Friendly**: Large tap targets for mobile
- **Grid System**: CSS Grid and Flexbox for layouts

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Semantic HTML and ARIA labels
- **Color Contrast**: WCAG compliant color combinations
- **Focus Management**: Clear focus indicators

## 📊 Analytics & Reporting

### Dashboard Metrics
- Total patients and new registrations
- Appointment statistics and completion rates
- Revenue tracking and growth metrics
- Today's schedule and upcoming appointments
- Patient visit patterns and top patients

### Revenue Analytics
- Daily and weekly revenue charts
- Month-over-month growth comparison
- Average appointment value
- Revenue by treatment type
- Patient spending patterns

## 🔒 Security & Data Management

### Data Storage
- **Client-Side Storage**: LocalStorage for data persistence
- **No Backend Dependencies**: Fully frontend-based solution
- **Data Validation**: Input validation on all forms
- **Error Handling**: Comprehensive error management

### Role-Based Access
- **Admin Access**: Full system access and management
- **Patient Access**: Limited to personal data only
- **Route Protection**: Authenticated route access
- **Session Management**: Persistent login sessions

## 🚀 Deployment

The application is designed for easy deployment to static hosting platforms:

### Vercel Deployment
```bash
npm run build
vercel --prod
```

### Netlify Deployment
```bash
npm run build
# Upload dist folder to Netlify
```

### GitHub Pages
```bash
npm run build
# Configure GitHub Pages to serve from build folder
```

## 🐛 Known Issues & Limitations

### Current Limitations
- **No Backend**: All data stored in localStorage
- **No Real Authentication**: Simulated authentication system
- **File Storage**: Files stored as base64 in localStorage
- **No Data Backup**: Data loss on browser storage clear

### Potential Improvements
- Integration with backend API
- Real-time notifications
- Advanced reporting features
- Multi-clinic support
- Mobile app development

## 🔄 Development Workflow

### Git Workflow
- Feature branches for new development
- Meaningful commit messages
- Code review process
- Automated testing (when available)

### Code Standards
- ESLint configuration for code quality
- Prettier for code formatting
- Component-based architecture
- Functional programming patterns

## 📝 Technical Decisions

### Why React?
- Component reusability and maintainability
- Strong ecosystem and community support
- Excellent development tools
- Efficient rendering with virtual DOM

### Why Context API?
- Simpler than Redux for this application size
- Native React solution
- Good performance for medium-sized apps
- Easy to understand and maintain

### Why TailwindCSS?
- Rapid development with utility classes
- Consistent design system
- Smaller bundle size when purged
- Excellent responsiveness utilities

### Why LocalStorage?
- No backend requirements per assignment
- Instant data persistence
- Simple implementation
- Good for demo purposes

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make changes with proper testing
4. Submit a pull request

### Code Style
- Follow existing patterns and conventions
- Use meaningful variable and function names
- Comment complex logic
- Maintain consistent formatting

## 📄 License

This project is created for the ENTNT Technical Assignment and is intended for evaluation purposes.

## � ENTNT Assignment Submission

### **Live Demo**
- **Deployment URL**: https://bharathreddy9999.github.io/dental-center-management/
- **GitHub Repository**: https://github.com/bharathreddy9999/dental-center-management

### **Demo Credentials**
#### **Administrator Access**
- **Email**: admin@entnt.in
- **Password**: admin123
- **Features**: Full system access with patient management, appointments, calendar, file uploads, and analytics

#### **Patient Access**
- **Email**: john@entnt.in
- **Password**: patient123
- **Features**: Personal dashboard with appointment history and treatment records

### **Assignment Requirements Fulfilled**
✅ **Simulated Authentication**: Hardcoded users with role-based access  
✅ **Data Persistence**: All data stored in localStorage  
✅ **File Uploads**: Admin can upload files and invoices post-appointment  
✅ **Role-Based Access**: Admin vs Patient interfaces with proper restrictions  
✅ **Calendar Integration**: Interactive calendar with appointment visualization  
✅ **Dashboard KPIs**: Revenue, patients, appointments, and treatment metrics  
✅ **Patient Management**: Complete CRUD operations with search and filtering  
✅ **Incident/Appointment Management**: Full lifecycle management with status tracking  
✅ **Responsive Design**: Mobile-first design that works across all devices  
✅ **Professional UI/UX**: Gold theme with dark mode and smooth animations  
✅ **Form Validation**: Comprehensive input validation and error handling  
✅ **Reusable Components**: Modular architecture with context-based state management  

### **Technical Highlights**
- **Framework**: React 19+ with functional components and hooks
- **Styling**: TailwindCSS for responsive design and professional appearance
- **State Management**: Context API for global state with localStorage persistence
- **Routing**: React Router for SPA navigation with protected routes
- **Icons**: Lucide React for consistent iconography
- **Charts**: Recharts for revenue analytics and data visualization
- **Build**: Create React App with optimized production builds

### **Deployment Instructions**
```bash
# Clone and setup
git clone https://github.com/bharathreddy9999/dental-center-management.git
cd dental-center-management
npm install

# Development
npm start  # Runs on http://localhost:3000/dental-center-management

# Production Build
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 📞 Contact

**Submission Details**:
- **Email**: hr@entnt.in
- **GitHub**: https://github.com/bharathreddy9999/dental-center-management
- **Live Demo**: https://bharathreddy9999.github.io/dental-center-management/

---

**Note**: This is a demonstration project created for the ENTNT Technical Assignment. All patient data is fictional and for demonstration purposes only. The application demonstrates production-ready code quality, architecture, and user experience suitable for real-world dental practice management.
