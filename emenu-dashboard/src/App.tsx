import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import Login from './pages/Login';
import MenuItems from './pages/MenuItems';
import Categories from './pages/Categories';
import ImportData from './pages/ImportData';
import DashboardLayout from './components/DashboardLayout';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <MenuItems />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/categories"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Categories />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/import"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <ImportData />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
};

export default App;
