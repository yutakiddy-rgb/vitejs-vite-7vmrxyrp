import { useState } from "react";

export default function SettingsTab({ brandsMaster, setBrandsMaster }) {
  if (!Array.isArray(brandsMaster)) {
    return <div style={{ padding: 16 }}>マスタを読み込み中...</div>;
  }

  const updatePrice = (id, newPrice) => {
    setBrandsMaster(prev =>
      prev.map(b =>
        b.id === id ? { ...b, price: Number(newPrice) } : b
      )
    );
  };

  const updateName = (id, newName) => {
    setBrandsMaster(prev =>
      prev.map(b =>
        b.id === id ? { ...b, name: newName } : b
      )
    );
  };

 // 追加用の state
    const [newName, setNewName] = useState("");
    const [newPrice, setNewPrice] = useState("");

  // 追加処理
    const addBrand = () => {
      if (!newName || !newPrice) return;
      const newBrand = {
        id: crypto.randomUUID(),
        name: newName,
        price: Number(newPrice)
      };

      setBrandsMaster(prev => [...prev, newBrand]);
      setNewName("");
     setNewPrice("");
    };

    return (
      <div style={{ padding: 16 }}>
        <h2>銘柄マスタ設定</h2>
    
        {/* 銘柄追加 */}
        <h3>銘柄追加</h3>
        <div style={{ marginBottom: 20 }}>
          <input
            type="text"
            placeholder="銘柄名"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={{ marginRight: 8 }}
          />
          <input
            type="number"
            placeholder="単価"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            style={{ width: 100, marginRight: 8 }}
          />
          <button onClick={addBrand}>追加</button>
        </div>
    
        {brandsMaster.map((b) => (
  <div
    key={b.id}
    style={{
      border: "1px solid #ccc",
      padding: 12,
      borderRadius: 8,
      marginBottom: 16
    }}
  >
    {/* 銘柄名 + 削除ボタンを横並び */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: 8
      }}
    >
      <label style={{ marginRight: 8 }}>銘柄名：</label>

      <input
        type="text"
        value={b.name}
        onChange={(e) => updateName(b.id, e.target.value)}
        style={{ width: "60%", marginRight: 8 }}
      />

      {/*  右側に削除ボタン */}
      <button
        onClick={() =>
          setBrandsMaster(prev => prev.filter(x => x.id !== b.id))
        }
        style={{
          background: "#ff7f7f",
          color: "white",
          border: "none",
          padding: "6px 12px",
          borderRadius: 4
        }}
      >
        -
      </button>
    </div>

    {/* 単価入力欄（縦に配置） */}
    <div>
      <label>単価：</label>
      <input
        type="number"
        value={b.price}
        onChange={(e) => updatePrice(b.id, e.target.value)}
        style={{ width: 100 }}
      />
      円
    </div>
  </div>
))}
      </div>
    );    
}
