import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/Home';
import ArticlePage from './pages/ArticlePage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import DynamicPage from './pages/public/DynamicPage';
import NotFound from './pages/NotFound';
import AccessDenied from './pages/AccessDenied';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Pages
import Profile from './pages/Profile';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import ManageArticles from './pages/admin/ManageArticles';
import ManageCategories from './pages/admin/ManageCategories';
import ManageUsers from './pages/admin/ManageUsers';
import ManageComments from './pages/admin/ManageComments';
import ManageMessages from './pages/admin/ManageMessages';
import BulkPostUpload from './pages/admin/BulkPostUpload';
import ManageSettings from './pages/admin/ManageSettings';
import ManageThemes from './pages/admin/ManageThemes';
import ManageNavigation from './pages/admin/ManageNavigation';
import ManageAds from './pages/admin/ManageAds';
import ManagePolls from './pages/admin/ManagePolls';
import ManageNewsletter from './pages/admin/ManageNewsletter';
import ManagePages from './pages/admin/ManagePages';
import ManagePagesForm from './pages/admin/ManagePagesForm';

import ScrollToTop from './components/ScrollToTop';

// Static Pages
import About from './pages/About';
import Contact from './pages/Contact';
import Advertise from './pages/Advertise';
import { Privacy, Terms } from './pages/Legal';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <ThemeProvider>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                fontSize: '14px',
              },
            }}
          />
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about-us" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/advertise" element={<Advertise />} />
              <Route path="/privacy-policy" element={<Privacy />} />
              <Route path="/terms-of-service" element={<Terms />} />
              <Route path="/article/:slug" element={<ArticlePage />} />
              <Route path="/page/:slug" element={<DynamicPage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/access-denied" element={<AccessDenied />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="articles" element={<ManageArticles />} />
              <Route path="categories" element={<ManageCategories />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="comments" element={<ManageComments />} />
              <Route path="messages" element={<ManageMessages />} />
              <Route path="newsletters" element={<ManageNewsletter />} />
              <Route path="polls" element={<ManagePolls />} />
              <Route path="ads" element={<ManageAds />} />
              <Route path="bulk-upload" element={<BulkPostUpload />} />
              <Route path="navigation" element={<ManageNavigation />} />
              <Route path="themes" element={<ManageThemes />} />
              <Route path="settings" element={<ManageSettings />} />
              <Route path="pages" element={<ManagePages />} />
              <Route path="pages/create" element={<ManagePagesForm />} />
              <Route path="pages/edit/:id" element={<ManagePagesForm />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
