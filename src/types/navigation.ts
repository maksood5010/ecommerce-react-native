import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';

// Stack navigator params for Products tab
export type ProductsStackParamList = {
  List: undefined;
  Details: { productId: string };
};

// Stack navigator params for Favorites tab
export type FavoritesStackParamList = {
  Favorites: undefined;
  FavoriteDetails: { productId: string };
};

// Stack navigator params for Cart tab
export type CartStackParamList = {
  Cart: undefined;
  CartProductDetails: { productId: string };
};

// Bottom tab navigator params
export type RootTabParamList = {
  ProductsTab: NavigatorScreenParams<ProductsStackParamList>;
  FavoritesTab: NavigatorScreenParams<FavoritesStackParamList>;
  CartTab: NavigatorScreenParams<CartStackParamList>;
};

// Screen props for screens in Products stack
export type ProductsStackScreenProps<T extends keyof ProductsStackParamList> =
  NativeStackScreenProps<ProductsStackParamList, T>;

// Screen props for screens in Favorites stack
export type FavoritesStackScreenProps<T extends keyof FavoritesStackParamList> =
  NativeStackScreenProps<FavoritesStackParamList, T>;

// Screen props for screens in Cart stack
export type CartStackScreenProps<T extends keyof CartStackParamList> =
  NativeStackScreenProps<CartStackParamList, T>;

// Screen props for tab screens with nested navigation
export type RootTabScreenProps<T extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, T>,
    NativeStackScreenProps<ProductsStackParamList>
  >;

// Enable type checking for useNavigation hook
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}
