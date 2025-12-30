import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProductsStackParamList } from '../types';
import { ListScreen } from '../screens/ListScreen';
import { DetailsScreen } from '../screens/DetailsScreen';
import { COLORS } from '../constants';

const Stack = createNativeStackNavigator<ProductsStackParamList>();

export const ProductsStackNavigator: React.FC = () => {
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
        name="List"
        component={ListScreen}
        options={{ title: 'Products' }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{ title: 'Product Details' }}
      />
    </Stack.Navigator>
  );
};

