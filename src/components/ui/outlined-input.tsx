import * as React from "react";
import { cn } from "@/lib/utils";

interface OutlinedInputProps extends React.ComponentProps<"input"> {
  label: string;
  error?: string;
}

const OutlinedInput = React.forwardRef<HTMLInputElement, OutlinedInputProps>(
  ({ className, label, error, ...props }, ref) => {
    const [focused, setFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    React.useEffect(() => {
      setHasValue(!!props.value || !!props.defaultValue);
    }, [props.value, props.defaultValue]);

    const shouldFloat = focused || hasValue;

    return (
      <div className="relative">
        <input
          {...props}
          ref={ref}
          className={cn(
            "flex h-14 w-full rounded-md border border-input bg-background px-3 pt-4 pb-2 text-base ring-offset-background transition-all duration-200 ease-in-out",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
            "placeholder:text-transparent",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:border-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          onChange={(e) => {
            setHasValue(!!e.target.value);
            props.onChange?.(e);
          }}
        />
        <label
          className={cn(
            "absolute left-3 text-muted-foreground pointer-events-none transition-all duration-200 ease-in-out",
            shouldFloat
              ? "top-0 text-xs -translate-y-1/2 bg-background px-1 text-primary"
              : "top-1/2 -translate-y-1/2 text-base",
            error && shouldFloat && "text-destructive"
          )}
        >
          {label}
        </label>
        {error && (
          <div className="mt-1 text-sm text-destructive">{error}</div>
        )}
      </div>
    );
  }
);

OutlinedInput.displayName = "OutlinedInput";

export { OutlinedInput };