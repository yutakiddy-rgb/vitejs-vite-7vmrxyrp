import {
  PlusIcon,
  ClipboardIcon,
  Cog6ToothIcon
} from "@heroicons/react/24/outline";

const tabs = [
  { id: "input", label: "入力", icon: PlusIcon },
  { id: "record", label: "記録", icon: ClipboardIcon },
  { id: "settings", label: "設定", icon: Cog6ToothIcon }
];

export default function BottomTabBar({ activeTab, onChange }) {
  return (
    <div className="
      fixed bottom-0 left-0 w-full 
      bg-white/40 backdrop-blur-xl 
      border-t border-white/30 
      shadow-[0_-6px_25px_rgba(0,0,0,0.18)]
    ">
      <div className="max-w-[390px] mx-auto flex justify-around py-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`
              flex flex-col items-center text-xs px-6 py-3 rounded-2xl transition-all
                ${activeTab === t.id
                  ? "bg-white shadow-[0_6px_15px_rgba(0,0,0,0.15)] text-blue-600 scale-105"
                  : "text-gray-700 opacity-70"
               }
            `}
          >
            <t.icon className="w-7 h-7 mb-1" />
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
