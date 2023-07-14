import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const toPusherKey = (key: string) => {
  return key.replace(/:/g, '__');
};

export const createImgUrl = (img: string) => {
  return img.startsWith('https://lh3.googleusercontent.com')
    ? img
    : `${process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL}${img}`;
};