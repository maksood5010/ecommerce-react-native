import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store, loadFavorites, loadCart, fetchProducts } from './src/store';
import { RootNavigator } from './src/navigation';

function AppContent() {
  useEffect(() => {
    // Load persisted data and fetch products on app start
    store.dispatch(loadFavorites());
    store.dispatch(loadCart());
    store.dispatch(fetchProducts());
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      <RootNavigator />
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </Provider>
  );
}
