import { cn } from "@/lib/utils";

export function Button({ className, ...props }) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-xl bg-blue-500 text-white font-medium shadow-sm active:scale-95 transition",
        className
      )}
      {...props}
    />
  );
}
