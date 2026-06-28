import { useState } from "react";

export default function InputTab({
  logs,
  setLogs,
  dailySummary,
  setDailySummary,
  brandsMaster
}) {
  const [brandId, setBrandId] = useState("iqos");
  const [customAmount, setCustomAmount] = useState(1);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  
  // 今月のサマリー計算（logs から計算する）
    const getMonthSummary = () => {
      let totalPlus = 0;
      let totalMinus = 0;
      let totalPrice = 0;

      logs.forEach((l) => {
        const d = new Date(l.date);
        const now = new Date();

        if (d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()) {
          if (l.type === "plus") {
            totalPlus += l.amount;
            totalPrice += l.amount * l.priceAtThatTime; // ← 当時の価格
          } else {
            totalMinus += l.amount;
          }
        }
      });

      return { totalPlus, totalMinus, totalPrice };
    };


  const { totalPlus, totalMinus, totalPrice } = getMonthSummary();


 // ログ追加（生ログ + 日別集計）
    const addLog = (type, amount) => {
      const id = crypto.randomUUID();
      const date = selectedDate;

      // 今のブランド情報を取得
      const brand = brandsMaster.find((b) => b.id === brandId);

      // 生ログ追加（当時の価格を保存）
        const newLog = {
        id,
        date,
        brandId,
        type,
        amount,
        priceAtThatTime: brand ? brand.price : 0,
        nameAtThatTime: brand ? brand.name : ""
      };

      setLogs((prev) => [newLog, ...prev]);

      // 日別集計更新（集計は箱数だけでOK）
        setDailySummary((prev) => {
        const day = prev[date] || {};
        const brandSummary = day[brandId] || { plus: 0, minus: 0 };

        return {
          ...prev,
          [date]: {
           ...day,
           [brandId]: {
              ...brandSummary,
             [type]: brandSummary[type] + amount
           }
          }
        };
      });
  };

  // 削除（生ログから削除 → 日別集計を再計算）
  const deleteLog = (log) => {
    setLogs((prev) => prev.filter((l) => l.id !== log.id));

    setDailySummary((prev) => {
      const newSummary = { ...prev };
      const date = log.date;

      const dayLogs = logs.filter(
        (l) => l.date === date && l.id !== log.id
      );

      const summary = {};

      dayLogs.forEach((l) => {
        if (!summary[l.brandId])
          summary[l.brandId] = { plus: 0, minus: 0 };
        summary[l.brandId][l.type] += l.amount;
      });

      newSummary[date] = summary;
      return newSummary;
    });
  };

  const handlePlus = () => addLog("plus", customAmount);
  const handleMinus = () => addLog("minus", customAmount);

  const recentLogs = logs.slice(0, 5);

  return (
    <div style={{ padding: 16 }}>
      {/* 銘柄 */}
      <label>
        銘柄：
        <select
          value={brandId}
          onChange={(e) => setBrandId(e.target.value)}
          style={{ marginLeft: 8 }}
        >
          {brandsMaster.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </label>

      {/* 日付 */}
      <div style={{ marginTop: 20 }}>
        <label>
          登録日付：
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ marginLeft: 8, padding: 6 }}
          />
        </label>
      </div>

      {/* 数量 */}
      <div style={{ marginTop: 20 }}>
        <input
          type="number"
          min="1"
          value={customAmount}
          onChange={(e) => setCustomAmount(Number(e.target.value))}
          style={{ padding: 8, width: 120, marginRight: 8 }}
        />
        箱
      </div>

      {/* ボタン */}
      <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
        <button
          onClick={handlePlus}
          style={{ padding: "12px 20px", fontSize: 16 }}
        >
          ＋{customAmount}箱購入
        </button>

        <button
          onClick={handleMinus}
          style={{ padding: "12px 20px", fontSize: 16 }}
        >
          −{customAmount}箱消費
        </button>
      </div>

      {/* 履歴 */}
      <div style={{ marginTop: 20 }}>
        <h3>直近履歴</h3>
        <ul style={{ fontSize: "0.85rem", paddingLeft: 16 }}>
          {recentLogs.map((l) => (
            <li
              key={l.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <span>
                {l.date} {l.nameAtThatTime}{" "}
                {l.type === "plus" ? "+" : "-"}
                {l.amount}
              </span>

              <button
                onClick={() => deleteLog(l)}
                style={{
                  marginLeft: 8,
                  padding: "2px 6px",
                  fontSize: 12,
                  color: "white",
                  background: "#ff7f7f",
                  border: "none",
                  borderRadius: 4
                }}
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 月サマリー */}
      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <h3>今月のサマリー</h3>
        <p>購入箱数：{totalPlus}箱</p>
       <p>消費箱数：{totalMinus}箱</p>
       <p>購入金額：{totalPrice.toLocaleString()}円</p>
      </div>

    </div>
  );
}
