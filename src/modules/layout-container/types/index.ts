export interface ILayoutSiderSubMenu {
  name: string;
  path: string;
  value: string;
}

export interface ILayoutSiderMenu {
  icon: any;
  name: string;
  path: string;
  value: string;
  subMenus?: ILayoutSiderSubMenu[];
}

export interface IAdminInfo {
  name: string;
  phone: string;
}

export function isSiderMenu(
  data: ILayoutSiderMenu | ILayoutSiderSubMenu
): data is ILayoutSiderMenu {
  return !!(<ILayoutSiderMenu>data)?.subMenus;
}
