import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FavoritesStackParamList } from '../types';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { DetailsScreen } from '../screens/DetailsScreen';
import { COLORS } from '../constants';

const Stack = createNativeStackNavigator<FavoritesStackParamList>();

export const FavoritesStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.surface },
        headerTintColor: COLORS.primary,
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: 'My Favorites' }}
      />
      <Stack.Screen
        name="FavoriteDetails"
        component={DetailsScreen}
        options={{ title: 'Product Details' }}
      />
    </Stack.Navigator>
  );
};

