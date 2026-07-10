import { useState } from "react";
import axios from "axios";

function App() {

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);
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
      setAlerts(response.data.alerts);
      setDashboard(response.data.dashboard);

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

  return (
  <div
    style={{
      width: "500px",
      margin: "60px auto",
      textAlign: "center",
    }}
  >
    <h1>🛡️ SentinelX</h1>

    <h2>Upload Security Log</h2>

    <input
      type="file"
      onChange={(e) => setFile(e.target.files[0])}
    />

    <br /><br />

    <button onClick={handleUpload}>
      Upload
    </button>

    <h3>{message}</h3>
    <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
    marginTop: "30px",
    marginBottom: "30px",
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

    {/* Parsed Logs */}
    {logs.length > 0 && (
      <div style={{ marginTop: "30px", textAlign: "left" }}>
        <h2>Parsed Logs</h2>

        {logs.map((log, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px"
            }}
          >
            <p><strong>Time:</strong> {log.timestamp}</p>
            <p><strong>Status:</strong> {log.status}</p>
            <p><strong>User:</strong> {log.user}</p>
            <p><strong>IP:</strong> {log.ip}</p>
          </div>
        ))}
      </div>
    )}

    {/* ADD THE ALERTS SECTION HERE 👇 */}
    {alerts.length > 0 && (
      <div style={{ marginTop: "30px" }}>
        <h2>🚨 Security Alerts</h2>

        {alerts.map((alert, index) => (
          <div
            key={index}
            style={{
              border: "2px solid red",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "15px",
              backgroundColor: "#2b1a1a"
            }}
          >
            <h3>{alert.alert}</h3>

            <p><strong>Severity:</strong> {alert.severity}</p>

            <p><strong>Source IP:</strong> {alert.ip}</p>

            <p><strong>Failed Attempts:</strong> {alert.failed_attempts}</p>

            <p><strong>Recommendation:</strong> {alert.recommendation}</p>
          </div>
        ))}
      </div>
    )}

  </div>
);

}

export default App;