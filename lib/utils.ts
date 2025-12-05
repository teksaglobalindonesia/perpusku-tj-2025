import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {}
) {
  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate' ? accurateSizes[i] ?? 'Bytest' : sizes[i] ?? 'Bytes'
  }`;
}

export function readableDate(date: Date) {
  return format(date, 'd MMM yyyy');
}

export function systemDate(date: Date) {
  return format(date, 'yyyy-MM-dd');
}

export function generateImageUrl(imagePath: string) {
  const host = process.env.NEXT_PUBLIC_BE_URL || process.env.BE_URL;
  if (imagePath.startsWith('/')) {
    return `${host}${imagePath}`;
  }
  return imagePath;
}

export function showPagination({ pageCount }: { pageCount?: number }) {
  return pageCount && pageCount > 1 && pageCount !== 0;
}
