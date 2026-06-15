import type { ButtonHTMLAttributes, JSX } from "react";

export type ButtonVariant = "primary" | "secondary" | "approve" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: "bg-[#185FA5] text-white hover:bg-[#134a82] disabled:bg-[#185FA5]/60",
  secondary:
    "border border-gray-300 bg-transparent text-gray-600 hover:bg-gray-50 disabled:opacity-60",
  approve: "bg-[#9FE1CB] font-medium text-[#085041] hover:bg-[#8bd4ba] disabled:opacity-60",
  danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-600/60",
};

export default function Button({
  variant = "primary",
  isLoading = false,
  disabled = false,
  type = "button",
  children,
  className,
  ...rest
}: ButtonProps): JSX.Element {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs transition-colors disabled:cursor-not-allowed ${VARIANT_STYLES[variant]} ${className ?? ""}`}
      {...rest}
    >
      {isLoading && (
        <span className="h-2.5 w-2.5 animate-spin rounded-full border-2 border-current/40 border-t-current" />
      )}
      {children}
    </button>
  );
}
