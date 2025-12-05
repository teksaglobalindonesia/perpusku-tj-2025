import React from 'react';
import { cn } from '@/lib/utils';

type CustomContainerProps = React.PropsWithChildren<{
  className?: string;
}>;

const CustomContainer = React.forwardRef<HTMLDivElement, CustomContainerProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('max-w-[395px] p-0 container mx-auto', className)} {...props}>
        {children}
      </div>
    );
  }
);

CustomContainer.displayName = 'CustomContainer';

export default CustomContainer;
