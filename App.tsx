// App.tsx

import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LoginScreen } from './src/screens/LoginScreen';
import { AdminDashboardScreen } from './src/screens/AdminDashboardScreen';
import { ManagerDashboardScreen } from './src/screens/ManagerDashboardScreen';
import { ToastContainer, ConfirmationModal } from './src/components/NotificationSystem';

function RootNavigator() {
  const { isLoggedIn, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  if (isAdmin) {
    return <AdminDashboardScreen />;
  }

  return <ManagerDashboardScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
      <ToastContainer />
      <ConfirmationModal />
    </AuthProvider>
  );
}