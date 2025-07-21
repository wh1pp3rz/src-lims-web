import * as React from 'react';
import { cn } from '../../lib/utils.js';
import { XIcon } from 'lucide-react';
import { Button } from './button.jsx';

function Dialog({ open, onOpenChange, children }) {
    React.useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && open) {
                onOpenChange(false);
            }
        };

        if (open) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [open, onOpenChange]);

    if (!open) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
            <div className='fixed inset-0 bg-black/50' onClick={() => onOpenChange(false)} />
            <div className='relative'>{children}</div>
        </div>
    );
}

function DialogContent({ className, children, ...props }) {
    return (
        <div
            className={cn(
                'relative z-50 grid w-full max-w-lg gap-4 border border-gray-300 bg-white p-6 shadow-lg rounded-lg mx-4 max-h-[90vh] overflow-y-auto',
                className
            )}
            onClick={(e) => e.stopPropagation()}
            {...props}
        >
            {children}
        </div>
    );
}

function DialogHeader({ className, ...props }) {
    return (
        <div
            className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)}
            {...props}
        />
    );
}

function DialogTitle({ className, ...props }) {
    return (
        <h2
            className={cn('text-lg font-semibold leading-none tracking-tight', className)}
            {...props}
        />
    );
}

function DialogDescription({ className, ...props }) {
    return <p className={cn('text-sm text-muted-foreground', className)} {...props} />;
}

function DialogFooter({ className, ...props }) {
    return (
        <div
            className={cn(
                'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
                className
            )}
            {...props}
        />
    );
}

function DialogClose({ className, ...props }) {
    return (
        <Button
            variant='ghost'
            size='icon'
            className={cn(
                'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none',
                className
            )}
            {...props}
        >
            <XIcon className='h-4 w-4' />
            <span className='sr-only'>Close</span>
        </Button>
    );
}

export {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
};
