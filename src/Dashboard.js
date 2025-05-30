import { useEffect, useState } from "react";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [ordersRemaining, setOrdersRemaining] = useState(0);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vSs1te3K2GDZFmvXnV2dj_uLzlZpLQsLehdsGgDIVT2jYBQaebYQ-xxTL_cT3sot9TrU31cHWM8Xhz1/pubhtml?gid=0&single=true");
      const csvText = await response.text();
      const rows = csvText.trim().split("\n").map(row => row.split(","));

      const headers = rows[0].slice(1);
      const parsedData = rows.slice(1).map(row => {
        const hour = row[0];
        const values = row.slice(1).map(val => (val === "" ? 0 : isNaN(Number(val)) ? val : Number(val)));
        const entry = { hour };
        headers.forEach((header, i) => {
          entry[header] = values[i];
        });
        return entry;
      });

      const lastRow = parsedData[parsedData.length - 1];
      const remaining = lastRow ? (lastRow["Orders Remaining"] || 0) : 0;

      setOrdersRemaining(remaining);
      setData(parsedData);
      setLastUpdated(new Date().toLocaleTimeString());
    }

    fetchData();
    const interval = setInterval(fetchData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const users = data.length > 0
    ? Object.keys(data[0]).filter(k => k !== "hour" && k !== "Orders Remaining")
    : [];

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 text-white flex flex-col items-center p-6">
      <h1 className="text-5xl font-extrabold mb-8 drop-shadow-lg">📦 Packing Dashboard</h1>

      <div className="bg-red-600 rounded-lg px-8 py-4 text-4xl font-bold shadow-lg mb-6 w-full max-w-7xl text-center">
        Orders Remaining: {ordersRemaining}
      </div>

      <div className="mb-6 text-lg opacity-75">Last updated at: {lastUpdated}</div>

      <div className="overflow-x-auto w-full max-w-7xl rounded-lg shadow-lg bg-white text-gray-900">
        <table className="table-auto w-full border-collapse">
          <thead className="bg-gray-900 text-white sticky top-0 z-10">
            <tr>
              <th className="border px-6 py-4 text-xl font-semibold text-left">Hour</th>
              {users.map((user, i) => (
                <th key={i} className="border px-6 py-4 text-xl font-semibold text-center">{user}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => {
              const isTotalRow = row.hour.toLowerCase().includes("running total");
              return (
                <tr
                  key={idx}
                  className={`border-b ${
                    idx % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } ${isTotalRow ? "font-bold bg-yellow-200" : ""}`}
                >
                  <td className="border px-6 py-4 text-left text-lg">{row.hour}</td>
                  {users.map((user, i) => (
                    <td key={i} className="border px-6 py-4 text-center text-lg">
                      {row[user]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
