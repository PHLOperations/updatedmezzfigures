import React, { useEffect, useState } from "react";
import Papa from "papaparse";

export default function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vSs1te3K2GDZFmvXnV2dj_uLzlZpLQsLehdsGgDIVT2jYBQaebYQ-xxTL_cT3sot9TrU31cHWM8Xhz1/pub?gid=0&single=true&output=csv")
      .then((res) => res.text())
      .then((csvText) => {
        const parsed = Papa.parse(csvText, { header: true });
        setData(parsed.data);
      });
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#1e293b",
        color: "#e0e7ff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ marginBottom: 20 }}>Packing Dashboard</h1>
      <div
        style={{
          overflowX: "auto",
          maxWidth: "100%",
          flexGrow: 1,
          width: "100%",
        }}
      >
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            textAlign: "center",
            minWidth: 600,
          }}
        >
          <thead>
            <tr>
              {data[0] &&
                Object.keys(data[0]).map((col) => (
                  <th
                    key={col}
                    style={{
                      borderBottom: "2px solid #3b82f6",
                      padding: "10px 8px",
                      backgroundColor: "#2563eb",
                      color: "#f0f9ff",
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    {col}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={i}
                style={{
                  backgroundColor: i % 2 === 0 ? "#334155" : "#1e293b",
                }}
              >
                {Object.values(row).map((val, j) => (
                  <td
                    key={j}
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid #475569",
                    }}
                  >
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer style={{ marginTop: 20, fontSize: 14, color: "#94a3b8" }}>
        Last updated at: {new Date().toLocaleTimeString()}
      </footer>
    </div>
  );
}
