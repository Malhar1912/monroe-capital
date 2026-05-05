import { useEffect, useState } from "react";
import { api } from "../api";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/dashboard");
      setData(res.data);
    };

    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  if (!data) return <div>Monroe is watching...</div>;

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Monroe</h1>
      <p>Presence: {data.presence}</p>
      <p>Mood: {data.mood}</p>
      <p>Poise: {data.poise}/5</p>
      <p>Selectivity: {data.selectivity}</p>
      <p>Action: {data.action}</p>
      <p>Price: ${data.price.toFixed(2)}</p>
    </div>
  );
}
