export function Card({ className, ...props }) {
  return (
    <div
      className={
        "rounded-xl bg-white/80 backdrop-blur-sm border border-neutral-200 shadow-md p-3 w-full " +
        (className || "")
      }
      {...props}
    />
  );
}
