function UploadPage({ file, setFile, handleUpload }) {
  return (
    <div style={{ textAlign: "center" }}>
      <h1>🛡️ SentinelX</h1>

      <h2>Upload Security Log</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={handleUpload}>
        Upload & Analyze
      </button>
    </div>
  );
}

export default UploadPage;