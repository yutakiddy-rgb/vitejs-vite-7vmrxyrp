import BottomTabBar from "./components/ui/BottomTabBar";
import InputTab from "./components/InputTab";
import RecordTab from "./components/RecordTab";
import SettingsTab from "./components/SettingsTab";
import { useState, useEffect } from "react";

export default function App() {
  const [activeTab, setActiveTab] = useState("input");

  const [logs, setLogs] = useState([]);
  const [dailySummary, setDailySummary] = useState({});
  const [brandsMaster, setBrandsMaster] = useState(() => {
    const saved = localStorage.getItem("brandsMaster");
    return saved
      ? JSON.parse(saved)
      : [
          { id: "iqos", name: "クリアシルバー", price: 560 },
          { id: "vape", name: "ベイプ", price: 1000 }
        ];
  });

  // 初期読み込み
  useEffect(() => {
    const saved = localStorage.getItem("tobacco-app");
    if (saved) {
      const parsed = JSON.parse(saved);

      if (parsed.logs) {
        const fixedLogs = parsed.logs.map((l) => {
          if (!l.nameAtThatTime) {
            const brand = brandsMaster.find((b) => b.id === l.brandId);
            return {
              ...l,
              nameAtThatTime: brand ? brand.name : ""
            };
          }
          return l;
        });
        setLogs(fixedLogs);
      }

      if (parsed.dailySummary) setDailySummary(parsed.dailySummary);
    }
  }, []);

  // 保存
  useEffect(() => {
    localStorage.setItem(
      "tobacco-app",
      JSON.stringify({ logs, dailySummary })
    );
  }, [logs, dailySummary]);

  useEffect(() => {
    localStorage.setItem("brandsMaster", JSON.stringify(brandsMaster));
  }, [brandsMaster]);

  // 画面切り替え
  const renderContent = () => {
    switch (activeTab) {
      case "input":
        return (
          <InputTab
            logs={logs}
            setLogs={setLogs}
            dailySummary={dailySummary}
            setDailySummary={setDailySummary}
            brandsMaster={brandsMaster}
          />
        );
      case "record":
        return (
          <RecordTab
            dailySummary={dailySummary}
            logs={logs}
            brandsMaster={brandsMaster}
          />
        );
      case "settings":
        return (
          <SettingsTab
            brandsMaster={brandsMaster}
            setBrandsMaster={setBrandsMaster}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-black">

      {/* コンテンツ部分 */}
      <div className="w-full max-w-[390px] mx-auto px-4 pb-24">
        {renderContent()}
      </div>

      {/* 下タブバー（画面全体に固定） */}
      <BottomTabBar activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
  
}
