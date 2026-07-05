import { cn } from "@/lib/utils";

export function Button({ className, ...props }) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-md bg-neutral-900 text-white hover:bg-neutral-800",
        className
      )}
      {...props}
    />
  );
}
