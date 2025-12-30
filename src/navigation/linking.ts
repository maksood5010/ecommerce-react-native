import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { RootTabParamList } from '../types';
import { DEEP_LINK_CONFIG } from '../constants';

const prefix = Linking.createURL('/');

export const linkingConfig: LinkingOptions<RootTabParamList> = {
  prefixes: [prefix, `${DEEP_LINK_CONFIG.SCHEME}://`, ...DEEP_LINK_CONFIG.WEB_PREFIXES],
  config: {
    screens: {
      ProductsTab: {
        screens: {
          List: '',
          Details: 'product/:productId',
        },
      },
      FavoritesTab: {
        screens: {
          Favorites: 'favorites',
          FavoriteDetails: 'favorites/product/:productId',
        },
      },
      CartTab: {
        screens: {
          Cart: 'cart',
          CartProductDetails: 'cart/product/:productId',
        },
      },
    },
  },
};
