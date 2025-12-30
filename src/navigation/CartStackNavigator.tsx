import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CartStackParamList } from '../types';
import { CartScreen } from '../screens/CartScreen';
import { DetailsScreen } from '../screens/DetailsScreen';
import { COLORS } from '../constants';

const Stack = createNativeStackNavigator<CartStackParamList>();

export const CartStackNavigator: React.FC = () => {
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
        name="Cart"
        component={CartScreen}
        options={{ title: 'My Cart' }}
      />
      <Stack.Screen
        name="CartProductDetails"
        component={DetailsScreen}
        options={{ title: 'Product Details' }}
      />
    </Stack.Navigator>
  );
};

