import React, {forwardRef} from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    isLoading?: boolean;
    disabled?: boolean;
    size?: "sm" | "md" | "lg";
    variant: "primary" | "secondary" | "tertiary";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, variant, disabled = false, isLoading = false, size = "md", ...props }: ButtonProps, ref) => {
        const sizeClassName = {
            sm: "8",
            md: "10",
            lg: "11.5",
        };

        const variantClasses = {
            primary: `inline-flex items-center justify-center space-x-2 h-${sizeClassName[size]} 
                py-2.5 px-5 rounded-lg text-neutral-500 bg-amber-300 border-2 border-neutral-500
                disabled:opacity-50 hover:text-black hover:border-black
                hover:cursor-pointer disabled:cursor-not-allowed ${isLoading && "cursor-progress"}`,
            secondary: `inline-flex items-center justify-center space-x-2 h-${sizeClassName[size]}
                py-2.5 px-5 rounded-lg text-gray-900
                bg-white border border-gray-200
                hover:bg-gray-100 hover:border-gray-400 disabled:opacity-50 
                hover:cursor-pointer disabled:cursor-not-allowed ${isLoading && "cursor-progress"}`,
            tertiary: `inline-flex items-center justify-center space-x-2 h-${sizeClassName[size]}
                py-2.5 px-5 rounded-lg
                text-blue-400 disabled:opacity-50 
                hover:cursor-pointer disabled:cursor-not-allowed ${isLoading && "cursor-progress"}`,
        };

        return (
            <button ref={ref} type="button" disabled={disabled} {...props} className={variantClasses[variant]}>
                {children}
            </button>
        );
    });

Button.displayName = "Button";
export default Button;