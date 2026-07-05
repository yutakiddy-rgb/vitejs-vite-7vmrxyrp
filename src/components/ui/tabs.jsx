import { useState } from "react";

export function Tabs({ tabs }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="flex gap-2 border-b mb-4">
        {tabs.map((t, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={
              "px-3 py-2 " +
              (active === i
                ? "border-b-2 border-neutral-900 font-bold"
                : "text-neutral-500")
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      <div>{tabs[active].content}</div>
    </div>
  );
}
