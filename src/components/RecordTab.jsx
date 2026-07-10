import { useState } from "react";

export default function RecordTab({ dailySummary, logs, brandsMaster }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0=Jan

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // 今月のサマリー計算（logs から計算する）
  const getMonthSummary = () => {
    let totalPlus = 0;
    let totalMinus = 0;
    let totalPrice = 0;
  
    logs.forEach((l) => {
      const d = new Date(l.date);
  
      // ★ 表示中の year / month を使う
      if (d.getFullYear() === year && d.getMonth() === month) {
        if (l.type === "plus") {
          totalPlus += l.amount;
          totalPrice += l.amount * l.priceAtThatTime;
        } else {
          totalMinus += l.amount;
        }
      }
    });
  
    return { totalPlus, totalMinus, totalPrice };
  };
  

  const { totalPlus, totalMinus, totalPrice } = getMonthSummary();
  
  // 月初の曜日（0=日, 1=月, ... 6=土）
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  // カレンダー用セル（空白 + 日付）
  const calendarCells = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array(daysInMonth).fill(0).map((_, i) => i + 1)
  ];

  const getDaySummary = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  
    const dayData = dailySummary[dateStr];
    if (!dayData) return { plus: 0, minus: 0 };
  
    let plus = 0;
    let minus = 0;
  
    Object.values(dayData).forEach((v) => {
      plus += v.plus;
      minus += v.minus;
    });
  
    return { plus, minus };
  };

  const goPrevMonth = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
  };

  const goNextMonth = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  };

  const weekLabels = ["日", "月", "火", "水", "木", "金", "土"];

  return (
    <div style={{ padding: 16 }}>
      {/* 月移動 */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <button onClick={goPrevMonth}>← 前の月</button>
        <h2>
          {year}年 {month + 1}月
        </h2>
        <button onClick={goNextMonth}>次の月 →</button>
      </div>

      {/* 曜日ヘッダー */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          textAlign: "center",
          marginBottom: 8,
          fontWeight: "bold"
        }}
      >
        {weekLabels.map((w, i) => (
          <div
            key={i}
            style={{
              color: i === 0 ? "#ff7f7f" : i === 6 ? "#7f7fff" : "#333"
            }}
          >
            {w}
          </div>
        ))}
      </div>

      {/* カレンダー本体 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 8
        }}
      >
        {calendarCells.map((day, index) => {
          if (day === null) {
            return <div key={index}></div>; // 空白セル
          }

          const { plus, minus } = getDaySummary(day);

          return (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                padding: 8,
                textAlign: "center",
                borderRadius: 4
              }}
            >
              <div>{day}</div>

              {plus > 0 && (
                <div style={{ color: "#ff7f7f", fontSize: 12 }}>＋{plus}</div>
              )}

              {minus > 0 && (
                <div style={{ color: "#7f7fff", fontSize: 12 }}>−{minus}</div>
              )}
            </div>
          );
        })}
      </div>
      {/* 月サマリー */}
      <div className="
        bg-white/40 
        backdrop-blur-xl 
        rounded-2xl 
        shadow-[0_4px_20px_rgba(0,0,0,0.15)] 
        p-5
        ">
        <h3 className="font-bold text-gray-800 mb-3">今月のサマリー</h3>
        <div className="space-y-1 text-sm text-gray-800">
          <p>購入箱数：{totalPlus}箱</p>
          <p>消費箱数：{totalMinus}箱</p>
          <p>購入金額：{totalPrice.toLocaleString()}円</p>
        </div>

      </div>
      </div>
  );
}
