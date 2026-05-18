import { createBrowserRouter } from 'react-router-dom';

import PublicLayout from '../layouts/PublicLayout';
import BrokerLayout from '../layouts/BrokerLayout';

// Public Pages
import LandingPage from '../pages/LandingPage';
import SearchProperties from '../pages/SearchProperties';
import PropertyDetails from '../pages/PropertyDetails';
import About from '../pages/About';
import Contact from '../pages/Contact';
import FAQ from '../pages/FAQ';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsConditions from '../pages/TermsConditions';
import NotFoundPage from '../pages/NotFoundPage';

// Auth/User Pages
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import Notifications from '../pages/Notifications';
import Messages from '../pages/Messages';
import { OwnerLogin } from '../pages/auth/OwnerLogin';
import { BrokerLogin } from '../pages/auth/BrokerLogin';
import { AdminLogin } from '../pages/auth/AdminLogin';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { ResetPassword } from '../pages/auth/ResetPassword';

// Owner Dashboard
import OwnerLayout from '../layouts/OwnerLayout';
import { Overview as OwnerOverview, MyProperties, Analytics as OwnerAnalytics, Notifications as OwnerNotifications, Profile as OwnerProfile, Settings as OwnerSettings } from '../pages/owner/OwnerPages';

// Dashboards (now using Broker Layout)
import { 
  Overview, Approvals, Listings, Leads, Visits, Contacts, 
  Calendar, Analytics, Commission, Reports 
} from '../pages/broker/BrokerPages';

// Property Management
import AddProperty from '../pages/AddProperty';

// Broker Review Module
import { PendingApprovalsPage } from '../pages/broker/PendingApprovalsPage';
import { PropertyReviewPage } from '../pages/broker/PropertyReviewPage';
import { LeadDetailsPage } from '../pages/broker/LeadDetailsPage';

// Admin Dashboard
import AdminLayout from '../layouts/AdminLayout';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminProperties } from '../pages/admin/AdminProperties';
import { AdminApprovals } from '../pages/admin/AdminApprovals';
import { AdminBrokers } from '../pages/admin/AdminBrokers';
import { AdminPropertyOwners } from '../pages/admin/AdminPropertyOwners';
import { AdminLeads } from '../pages/admin/AdminLeads';
import { AdminVisits, AdminDeals } from '../pages/admin/AdminVisitsDeals';
import { AdminAnalytics } from '../pages/admin/AdminAnalytics';
import { AdminActivityLogs } from '../pages/admin/AdminActivityLogs';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'search', element: <SearchProperties /> },
      { path: 'property/:id', element: <PropertyDetails /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: 'faq', element: <FAQ /> },
      { path: 'privacy-policy', element: <PrivacyPolicy /> },
      { path: 'terms-conditions', element: <TermsConditions /> },
    ],
  },
  {
    path: '/dashboard',
    element: <BrokerLayout />,
    children: [
      { index: true, element: <Overview /> },
      { path: 'approvals', element: <Approvals /> },
      { path: 'pending-approvals', element: <PendingApprovalsPage /> },
      { path: 'review-property/:id', element: <PropertyReviewPage /> },
      { path: 'listings', element: <Listings /> },
      { path: 'leads', element: <Leads /> },
      { path: 'lead/:id', element: <LeadDetailsPage /> },
      { path: 'visits', element: <Visits /> },
      { path: 'contacts', element: <Contacts /> },
      { path: 'calendar', element: <Calendar /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'commission', element: <Commission /> },
      { path: 'reports', element: <Reports /> },
      { path: 'profile', element: <Profile /> },
      { path: 'settings', element: <Settings /> },
      { path: 'notifications', element: <Notifications /> },
      { path: 'messages', element: <Messages /> },
    ],
  },
  {
    path: '/login',
    children: [
      { path: 'owner', element: <OwnerLogin /> },
      { path: 'broker', element: <BrokerLogin /> },
    ],
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'properties', element: <AdminProperties /> },
      { path: 'approvals', element: <AdminApprovals /> },
      { path: 'brokers', element: <AdminBrokers /> },
      { path: 'property-owners', element: <AdminPropertyOwners /> },
      { path: 'leads', element: <AdminLeads /> },
      { path: 'visits', element: <AdminVisits /> },
      { path: 'deals', element: <AdminDeals /> },
      { path: 'analytics', element: <AdminAnalytics /> },
      { path: 'notifications', element: <Notifications /> }, // reusing existing
      { path: 'activity-logs', element: <AdminActivityLogs /> },
      { path: 'settings', element: <Settings /> }, // reusing existing
      { path: 'profile', element: <Profile /> }, // reusing existing
    ],
  },
  {
    path: '/dashboard/owner',
    element: <OwnerLayout />,
    children: [
      { index: true, element: <OwnerOverview /> },
      { path: 'properties', element: <MyProperties /> },
      { path: 'drafts', element: <MyProperties /> },
      { path: 'pending', element: <MyProperties /> },
      { path: 'approved', element: <MyProperties /> },
      { path: 'published', element: <MyProperties /> },
      { path: 'rejected', element: <MyProperties /> },
      { path: 'analytics', element: <OwnerAnalytics /> },
      { path: 'notifications', element: <OwnerNotifications /> },
      { path: 'profile', element: <OwnerProfile /> },
      { path: 'settings', element: <OwnerSettings /> },
    ]
  },
  {
    path: '/add-property',
    element: <AddProperty />,
  },
]);
