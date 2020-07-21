export interface ILayoutSiderSubMenu {
  name: string;
  path: string;
  value: string;
}

export interface ILayoutSiderMenu {
  icon: string;
  name: string;
  path: string;
  value: string;
  subMenus?: ILayoutSiderSubMenu[];
}

export interface IAdminInfo {
  name: string;
  phone: string;
}
