import { FileArchive, FileSearch, FileText, Twitter, UserPlus, Users } from 'lucide-react';


export const Icons = {
  Twitter,
  UserPlus,
  Users
};


export const FileIcons = {
  FileArchive,
  FileSearch,
  FileText
};

export type Icon = keyof typeof Icons
export type FileIcon = keyof typeof FileIcons