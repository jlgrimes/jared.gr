import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** shadcn's class helper — conditional classes in, conflicting Tailwind utilities resolved. */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
