import { useState } from "react";
import axios from "axios";


function App() {

  const [currentPage, setCurrentPage] = useState("upload");

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const [logs, setLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const [searchIP, setSearchIP] = useState("");
  const [searched, setSearched] = useState(false);

  const [dashboard, setDashboard] = useState({
    total_logs: 0,
    failed_logins: 0,
    successful_logins: 0,
    total_alerts: 0,
  });

  const handleUpload = async () => {

    if (!file) {
      alert("Please select a log file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {

      const response = await axios.post(
        "http://127.0.0.1:5000/upload",
        formData
      );

      setMessage(response.data.message);
      setLogs(response.data.logs);
      setAlerts(response.data.all_alerts || response.data.alerts);
      setDashboard(response.data.dashboard);

      setCurrentPage("dashboard");

    } catch (error) {

      console.error(error);

      setMessage("Upload Failed");

    }

  };
  const cardStyle = {
  border: "1px solid #444",
  borderRadius: "10px",
  padding: "20px",
  backgroundColor: "#1e293b",
  color: "white",
  textAlign: "center",
};
const tableHeader = {
  border: "1px solid #ddd",
  padding: "10px",
};

const tableCell = {
  border: "1px solid #ddd",
  padding: "10px",
  textAlign: "center",
};
const filteredAlerts = alerts.filter((alert) =>
  alert.ip.toLowerCase().includes(searchIP.toLowerCase())
);
const filteredLogs = logs.filter((log) =>
  log.ip.toLowerCase().includes(searchIP.toLowerCase())
);
const getSeverityStyle = (severity) => {
  switch (severity) {
    case "High":
      return {
        backgroundColor: "#dc2626",
        color: "white",
      };

    case "Medium":
      return {
        backgroundColor: "#f59e0b",
        color: "white",
      };

    case "Low":
      return {
        backgroundColor: "#22c55e",
        color: "white",
      };

    default:
      return {
        backgroundColor: "#6b7280",
        color: "white",
      };
  }
};
return (
  <div
    style={{
      width: "900px",
      margin: "40px auto",
      fontFamily: "Arial",
    }}
  >

    {/* ================= UPLOAD PAGE ================= */}

    {currentPage === "upload" && (
      <div style={{ textAlign: "center" }}>

        <h1>🛡️ SentinelX</h1>

        <h2>SOC Log Analyzer</h2>

        <br />

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <br /><br />

        <button
          onClick={handleUpload}
          style={{
            padding: "12px 25px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Upload & Analyze
        </button>

        <h3>{message}</h3>

      </div>
    )}

    {/* ================= DASHBOARD ================= */}

    {currentPage === "dashboard" && (
      <>

        <h1 style={{ textAlign: "center" }}>
          📊 Dashboard
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: "20px",
            marginTop: "30px",
          }}
        >

          <div style={cardStyle}>
            <h3>📄 Total Logs</h3>
            <h1>{dashboard.total_logs}</h1>
          </div>

          <div style={cardStyle}>
            <h3>🚨 Total Alerts</h3>
            <h1>{dashboard.total_alerts}</h1>
          </div>

          <div style={cardStyle}>
            <h3>❌ Failed Logins</h3>
            <h1>{dashboard.failed_logins}</h1>
          </div>

          <div style={cardStyle}>
            <h3>✅ Successful Logins</h3>
            <h1>{dashboard.successful_logins}</h1>
          </div>

        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "40px",
          }}
        >

          <button
            onClick={() => setCurrentPage("investigation")}
            style={{
              padding: "12px 30px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            🔍 Investigate
          </button>

        </div>

      </>
    )}

    {/* ================= INVESTIGATION PAGE ================= */}

   {currentPage === "investigation" && (
  <>

    <h1 style={{ textAlign: "center" }}>
      🔍 Investigation
    </h1>

    <div
      style={{
        marginTop: "30px",
        marginBottom: "20px",
      }}
    >

      <input
        type="text"
        placeholder="Search IP Address..."
        value={searchIP}
        onChange={(e) => {
          setSearchIP(e.target.value);
          setSearched(false);
        }}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid gray",
          fontSize: "16px",
        }}
      />

      <br />
      <br />

      <button
        onClick={() => setSearched(true)}
        style={{
          padding: "10px 25px",
          cursor: "pointer",
        }}
      >
        🔍 Search
      </button>

    </div>

  </>
)}
{searched && (
  <>
    <h2 style={{ marginTop: "30px" }}>
      🚨 Recent Security Alerts
    </h2>

    {filteredAlerts.length === 0 ? (
      <p>No security alerts detected.</p>
    ) : (
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#1e293b", color: "white" }}>
            <th style={tableHeader}>Alert</th>
            <th style={tableHeader}>Severity</th>
            <th style={tableHeader}>Source IP</th>
            <th style={tableHeader}>Failed Attempts</th>
          </tr>
        </thead>

        <tbody>
          {filteredAlerts.map((alert, index) => (
            <tr key={index}>
              <td style={tableCell}>{alert.alert}</td>

              <td style={tableCell}>
                <span
                  style={{
                    ...getSeverityStyle(alert.severity),
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontWeight: "bold",
                    display: "inline-block",
                  }}
                >
                  {alert.severity}
                </span>
              </td>

              <td style={tableCell}>{alert.ip}</td>

              <td style={tableCell}>
                {alert.failed_attempts}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
    )}
  </>
)}


{searched && (
  <>
    <hr style={{ margin: "40px 0" }} />

    <h2>📄 Investigation Logs</h2>

    {filteredLogs.length === 0 ? (
      <p>No logs found for this IP.</p>
    ) : (
      <>
        <div style={{ marginTop: "20px" }}>
  {filteredLogs.map((log, index) => (
    <div
      key={index}
      style={{
        border: "1px solid #555",
        borderRadius: "8px",
        padding: "15px",
        marginBottom: "15px",
        backgroundColor: "#1f2937",
        textAlign: "left",
      }}
    >
      <p><strong>🕒 Time:</strong> {log.timestamp}</p>
      <p><strong>📌 Status:</strong> {log.status}</p>
      <p><strong>👤 User:</strong> {log.user}</p>
      <p><strong>🌐 IP:</strong> {log.ip}</p>
    </div>
  ))}
</div>
      </>
    )}
    <hr style={{ margin: "40px 0" }} />

<h2>🛡 Recommended Actions</h2>

<div
  style={{
    backgroundColor: "#1f2937",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "left",
    border: "1px solid #374151",
  }}
>
  <p>🚫 Block the source IP address.</p>
  <p>🔒 Reset the affected user's password.</p>
  <p>📋 Review authentication logs.</p>
  <p>📧 Notify the Security Team.</p>
</div>
  </>
)}
  </div>
  
  
);


}

export default App;
  
