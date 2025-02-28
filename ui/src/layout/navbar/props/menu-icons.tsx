import { rem } from '@mantine/core';
import {
  BsArchive,
  BsBox,
  BsCardChecklist,
  BsCardList,
  BsFileBarGraph,
  BsFileEarmarkMedical,
  BsGear,
  BsKanban,
  BsLayoutTextWindowReverse,
  BsListUl,
  BsPcDisplayHorizontal,
  BsPeople,
  BsPersonAdd,
  BsPersonGear,
} from 'react-icons/bs';
import { MdOutlineLibraryAdd, MdOutlineMonitorHeart } from 'react-icons/md';
import { HiOutlineDocumentDownload } from 'react-icons/hi';

const iconSize = rem(23);

type MenuIcon = {
  iconCode: MenuIcons;
  icon: React.ReactNode;
};

export enum MenuIcons {
  SystemAdmin = 0,
  StationManagement = 1,
  PatientOperations = 2,
  UserManagement = 3,
  ReportsAndMonitoring = 4,
  Dashboard = 5,
  Definitions = 6,
  ItemManagement = 7,
  StationDefinitions = 8,
  StockCard = 9,
  OverrideListMatch = 10,
  UserDefinitions = 11,
  ProfileGroupDefinitions = 12,
  IndividualReports = 13,
  CountMatch = 14,
  Monitoring = 15,
}

export const menuIconList: MenuIcon[] = [
  { iconCode: 0, icon: <BsGear size={iconSize} /> },
  { iconCode: 1, icon: <BsPcDisplayHorizontal size={iconSize} /> },
  { iconCode: 2, icon: <BsPeople size={iconSize} /> },
  { iconCode: 3, icon: <BsPersonGear size={iconSize} /> },
  { iconCode: 4, icon: <BsFileBarGraph size={iconSize} /> },
  { iconCode: 5, icon: <BsKanban size={iconSize} /> },
  { iconCode: 6, icon: <MdOutlineLibraryAdd size={iconSize} /> },
  { iconCode: 7, icon: <BsBox size={iconSize} /> },
  { iconCode: 8, icon: <BsPcDisplayHorizontal size={iconSize} /> },
  { iconCode: 9, icon: <BsCardList size={iconSize} /> },
  { iconCode: 10, icon: <BsLayoutTextWindowReverse size={iconSize} /> },
  { iconCode: 11, icon: <BsPersonAdd size={iconSize} /> },
  { iconCode: 12, icon: <BsPersonGear size={iconSize} /> },
  { iconCode: 13, icon: <HiOutlineDocumentDownload size={iconSize} /> },
  { iconCode: 14, icon: <BsCardChecklist size={iconSize} /> },
  { iconCode: 15, icon: <MdOutlineMonitorHeart size={iconSize} /> },
];
