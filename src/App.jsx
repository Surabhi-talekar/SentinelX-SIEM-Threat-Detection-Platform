import { useState } from "react";
import axios from "axios";

function App() {

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);

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

    } catch (error) {

      console.error(error);

      setMessage("Upload Failed");

    }

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