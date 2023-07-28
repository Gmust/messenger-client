import { ButtonHTMLAttributes } from 'react';
import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@/lib';

export const inputVariants = cva(
  'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-m ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6  disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: '',
        ghost: ''
      },
      size: {
        default: '',
        sm: '',
        lg: ''
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {
  isLoading?: boolean;
}

export const Input = ({ className, children, variant, isLoading, size, ...props }: ButtonProps) =>
  <input className={cn(inputVariants({ variant, size, className }))} {...props} disabled={isLoading} />;


