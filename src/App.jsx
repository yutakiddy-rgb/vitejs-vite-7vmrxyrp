import { Tabs } from "./components/ui/tabs";
import InputTab from "./components/InputTab";
import RecordTab from "./components/RecordTab";
import SettingsTab from "./components/SettingsTab";
import { useState, useEffect } from "react";

export default function App() {
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

  return (
    <div className="p-4 max-w-xl mx-auto">
      <Tabs
        tabs={[
          {
            label: "入力",
            content: (
              <InputTab
                logs={logs}
                setLogs={setLogs}
                dailySummary={dailySummary}
                setDailySummary={setDailySummary}
                brandsMaster={brandsMaster}
              />
            )
          },
          {
            label: "記録",
            content: (
              <RecordTab
                dailySummary={dailySummary}
                logs={logs}
                brandsMaster={brandsMaster}
              />
            )
          },
          {
            label: "設定",
            content: (
              <SettingsTab
                brandsMaster={brandsMaster}
                setBrandsMaster={setBrandsMaster}
              />
            )
          }
        ]}
      />
    </div>
  );
}
