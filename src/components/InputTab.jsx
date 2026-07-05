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

  // 今月のサマリー計算
  const getMonthSummary = () => {
    let totalPlus = 0;
    let totalMinus = 0;
    let totalPrice = 0;

    logs.forEach((l) => {
      const d = new Date(l.date);
      const now = new Date();

      if (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth()
      ) {
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

  // ログ追加
  const addLog = (type, amount) => {
    const id = crypto.randomUUID();
    const date = selectedDate;

    const brand = brandsMaster.find((b) => b.id === brandId);

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

  const recentLogs = logs.slice(0, 8);

  return (
    <div className="space-y-6">

    {/* 入力カード（高級ガラス） */}
    <div className="
      bg-white/30 
      backdrop-blur-md 
      border border-white/20 
      rounded-2xl 
      shadow-lg 
      p-5
      space-y-5
    ">
  
      {/* 銘柄 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-800">銘柄</label>
        <select
          value={brandId}
          onChange={(e) => setBrandId(e.target.value)}
          className="
            w-full 
            rounded-xl 
            px-3 py-2 
            bg-white/60 
            backdrop-blur 
            border border-white/30 
            shadow-sm
          "
        >
          {brandsMaster.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>
  
      {/* 日付 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-800">登録日付</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="
            w-full 
            rounded-xl 
            px-3 py-2 
            bg-white/60 
            backdrop-blur 
            border border-white/30 
            shadow-sm
          "
        />
      </div>
  
      {/* 数量 */}
      <div className="space-y-2 mb-6">
        <label className="text-sm font-medium text-gray-800">数量</label>
        <input
          type="number"
          min="1"
          value={customAmount}
          onChange={(e) => setCustomAmount(Number(e.target.value))}
          className="
            w-full 
            rounded-xl 
            px-3 py-2 
            bg-white/60 
            backdrop-blur 
            border border-white/30 
            shadow-sm
          "
        />
      </div>
  
      {/* ボタン（高級感を損なわない太さ） */}
      <div className="flex gap-3">
        <button
          onClick={handlePlus}
          className="
            flex-1 
            bg-blue-500 
            text-white 
            py-4 
            rounded-xl 
            shadow 
            active:scale-95 
            transition
          "
        >
          ＋{customAmount}箱購入
        </button>
  
        <button
          onClick={handleMinus}
          className="
            flex-1 
            bg-red-500 
            text-white 
            py-4 
            rounded-xl 
            shadow 
            active:scale-95 
            transition
          "
        >
          −{customAmount}箱消費
        </button>
      </div>
  
    </div>
  
    {/* 直近履歴（ガラスカードに統一） */}
    <div className="
      bg-white/40 
      backdrop-blur-xl 
      rounded-2xl 
      shadow-[0_4px_20px_rgba(0,0,0,0.15)] 
      p-5
    ">
      <h3 className="font-bold text-gray-800 mb-3">直近履歴</h3>
      <ul className="space-y-3">
        {recentLogs.map((l) => (
          <li key={l.id} className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="flex-1 text-sm text-gray-800 break-all">
              {l.date} {l.nameAtThatTime} {l.type === "plus" ? "+" : "-"}{l.amount}
            </div>
            <button
              onClick={() => deleteLog(l)}
              className="text-white bg-red-400 px-2 py-1 rounded-md text-xs"
            >
              -
            </button>
          </li>
        ))}
      </ul>
    </div>
  
    {/* 月サマリー（ガラスカード） */}
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
