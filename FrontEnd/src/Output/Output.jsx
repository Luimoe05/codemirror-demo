import React from "react";

const OutputBox = ({ output, error, loading }) => {
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Output</h3>

      {loading ? (
        <p style={styles.loading}>Running your code...</p>
      ) : error ? (
        <pre style={styles.error}>{error}</pre>
      ) : (
        <pre style={styles.output}>{output || "No output yet."}</pre>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#1e1e1e",
    color: "#ffffff",
    padding: "16px",
    borderRadius: "8px",
    minHeight: "150px",
    marginTop: "16px",
    overflowY: "auto",
    whiteSpace: "pre-wrap",
  },
  title: {
    margin: "0 0 10px 0",
    fontSize: "1.2rem",
  },
  loading: {
    color: "#ffa500",
  },
  output: {
    color: "#00ff90",
  },
  error: {
    color: "#ff4d4d",
  },
};

export default OutputBox;
