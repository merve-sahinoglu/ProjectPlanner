import MenuItemProps from 'src/features/authentication/props/menu-item-props';

/* eslint-disable import/prefer-default-export */
type UserAuthorization = {
  menuItems: MenuItemProps[];
  authorizations: string[];
  routes: string[];
};

export type { UserAuthorization };
