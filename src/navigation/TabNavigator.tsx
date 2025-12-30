import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { RootTabParamList } from '../types';
import { ProductsStackNavigator } from './ProductsStackNavigator';
import { FavoritesStackNavigator } from './FavoritesStackNavigator';
import { CartStackNavigator } from './CartStackNavigator';
import { useAppSelector, selectFavoritesCount, selectCartItemCount } from '../store';
import { COLORS } from '../constants';

const Tab = createBottomTabNavigator<RootTabParamList>();

export const TabNavigator: React.FC = () => {
  const favoritesCount = useAppSelector(selectFavoritesCount);
  const cartItemCount = useAppSelector(selectCartItemCount);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.divider,
        },
      }}
    >
      <Tab.Screen
        name="ProductsTab"
        component={ProductsStackNavigator}
        options={{
          tabBarLabel: 'Products',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: 'Products tab',
        }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesStackNavigator}
        options={{
          tabBarLabel: 'Favorites',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
          tabBarBadge: favoritesCount > 0 ? favoritesCount : undefined,
          tabBarAccessibilityLabel: `Favorites tab, ${favoritesCount} items`,
        }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartStackNavigator}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
          tabBarBadge: cartItemCount > 0 ? cartItemCount : undefined,
          tabBarAccessibilityLabel: `Cart tab, ${cartItemCount} items`,
        }}
      />
    </Tab.Navigator>
  );
};
