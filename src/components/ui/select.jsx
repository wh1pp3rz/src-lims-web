import * as React from 'react';
import { cn } from '../../lib/utils.js';
import { ChevronDownIcon, CheckIcon } from 'lucide-react';

function Select({ value, onValueChange, children }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(value || '');
    const [selectedDisplayValue, setSelectedDisplayValue] = React.useState('');

    const selectRef = React.useRef(null);

    React.useEffect(() => {
        setSelectedValue(value || '');

        // Scan children for SelectItem with matching value
        let displayValue = '';
        React.Children.forEach(children, (child) => {
            if (React.isValidElement(child) && child.type === SelectContent) {
                React.Children.forEach(child.props.children, (item) => {
                    if (
                        React.isValidElement(item) &&
                        item.type === SelectItem &&
                        item.props.value === value
                    ) {
                        displayValue = item.props.children;
                    }
                });
            }
        });
        setSelectedDisplayValue(displayValue);
    }, [value, children]);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isOpen]);

    const handleValueSelect = (newValue, displayValue) => {
        setSelectedValue(newValue);
        setSelectedDisplayValue(displayValue);
        onValueChange?.(newValue);
        setIsOpen(false);
    };

    return (
        <div className='relative' ref={selectRef}>
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    if (child.type === SelectTrigger) {
                        return React.cloneElement(child, {
                            onClick: () => setIsOpen(!isOpen),
                            isOpen,
                            selectedValue,
                            selectedDisplayValue,
                        });
                    }
                    if (child.type === SelectContent) {
                        return React.cloneElement(child, {
                            isOpen,
                            onValueSelect: handleValueSelect,
                            selectedValue,
                        });
                    }
                }
                return child;
            })}
        </div>
    );
}

function SelectTrigger({ className, children, onClick, isOpen, selectedDisplayValue, ...props }) {
    return (
        <button
            type='button'
            className={cn(
                'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50',
                className
            )}
            onClick={onClick}
            {...props}
        >
            <span>{selectedDisplayValue || children}</span>
            <ChevronDownIcon
                className={cn('h-4 w-4 opacity-50 transition-transform', isOpen && 'rotate-180')}
            />
        </button>
    );
}

function SelectValue({ placeholder }) {
    return placeholder;
}

function SelectContent({ className, isOpen, children, onValueSelect, selectedValue, ...props }) {
    if (!isOpen) return null;

    return (
        <div
            className={cn(
                'absolute top-full left-0 z-50 w-full min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 text-gray-950 shadow-lg',
                className
            )}
            {...props}
        >
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, {
                        onValueSelect,
                        selectedValue,
                    });
                }
                return child;
            })}
        </div>
    );
}

function SelectItem({ className, children, value, onValueSelect, selectedValue, ...props }) {
    const isSelected = value === selectedValue;

    return (
        <div
            className={cn(
                'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                isSelected && 'bg-accent',
                className
            )}
            onClick={() => onValueSelect?.(value, children)}
            {...props}
        >
            <span>{children}</span>
            {isSelected && (
                <span className='absolute right-2 flex h-3.5 w-3.5 items-center justify-center'>
                    <CheckIcon className='h-4 w-4' />
                </span>
            )}
        </div>
    );
}

function SelectSeparator({ className, ...props }) {
    return <div className={cn('-mx-1 my-1 h-px bg-muted', className)} {...props} />;
}

export { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue };
