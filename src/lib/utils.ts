import clsx, { ClassValue } from 'clsx';
import { Howl } from 'howler';
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

export const getLastItem = (path: string) => path.substring(path.lastIndexOf('/') + 1);


export function notifyMe(title: string, msg: string, icon: string, song?: string) {
  if (!('Notification' in window)) {
    alert('This browser does not support Desktop notifications');
  }
  if (Notification.permission === 'granted') {
    callNotify(title, msg, icon);
    return;
  }
  if (Notification.permission !== 'denied') {
    Notification.requestPermission((permission) => {
      if (permission === 'granted') {
        callNotify(title, msg, icon);
      }
    });
    return;
  }
}

function callNotify(title: any, msg: any, icon: any) {
  const sound = new Howl({
    src: ['/notification.m4a'],
    volume: 0.1,
    html5: true
  });
  new Notification(title, { body: msg, icon: icon });
  sound.play();
}
