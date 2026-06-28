import { useState, useEffect } from "react";
import InputTab from "./components/InputTab";
import RecordTab from "./components/RecordTab";
import SettingsTab from "./components/SettingsTab";

export default function App() {
  const [logs, setLogs] = useState([]); // 生ログ
  const [dailySummary, setDailySummary] = useState({}); // 日別集計
  const [brandsMaster, setBrandsMaster] = useState(() => {
    const saved = localStorage.getItem("brandsMaster");
    return saved
      ? JSON.parse(saved)
      : [
          { id: "iqos", name: "クリアシルバー", price: 560 },
          { id: "vape", name: "ベイプ", price: 800 }
        ];
  });//マスタ
  const [tab, setTab] = useState("input");

  // 初期読み込み
  useEffect(() => {
    const saved = localStorage.getItem("tobacco-app");
    if (saved) {
      const parsed = JSON.parse(saved);
  
      if (parsed.logs) {
        const fixedLogs = parsed.logs.map(l => {
          if (!l.nameAtThatTime) {
            const brand = brandsMaster.find(b => b.id === l.brandId);
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
    localStorage.setItem(
      "brandsMaster",
      JSON.stringify(brandsMaster)
    );
  }, [brandsMaster]);
  
  return (
    <div>
      <div style={{ display: "flex", gap: 16, padding: 16 }}>
        <button onClick={() => setTab("input")}>入力</button>
        <button onClick={() => setTab("record")}>記録</button>
        <button onClick={() => setTab("settings")}>設定</button>
      </div>

      {tab === "input" && (
        <InputTab
          logs={logs}
          setLogs={setLogs}
          dailySummary={dailySummary}
          setDailySummary={setDailySummary}
          brandsMaster={brandsMaster}
        />
      )}

      {tab === "record" && (
        <RecordTab
          dailySummary={dailySummary}
          logs={logs}
          brandsMaster={brandsMaster}
        />
      )}

      {tab === "settings" && (
        <SettingsTab
          brandsMaster={brandsMaster}
          setBrandsMaster={setBrandsMaster}
        />
      )}

    </div>
  );
}
