interface CapabilityChildrenProps {
  children: React.ReactNode;
  label: string;
}

export interface MenuItemProps {
  id: number;
  label: string;
  route: string;
  icon: number;
  subItemList: MenuItemProps[];
  setSub?: (props: MenuItemProps[]) => void;
  showMenu?: (opened: boolean) => void;
  description: string;
  childrens?: CapabilityChildrenProps[];
}
