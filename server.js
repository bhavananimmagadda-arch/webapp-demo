const express = require("express");
const sql = require("mssql");

const app = express();
const port = process.env.PORT || 3000;

// Connection string will come from App Service → Configuration → Application settings
// Name: DB_CONNECTION
const connectionString = process.env.DB_CONNECTION;

app.get("/", async (req, res) => {
  if (!connectionString) {
    return res.status(500).send("❌ DB_CONNECTION not set in App Service");
  }

  try {
    // Connect using connection string
    let pool = await sql.connect(connectionString);

    // Simple test query
    let result = await pool.request().query("SELECT GETDATE() as CurrentTime");

    res.send(`
      <h1>✅ Azure Web App Connected to SQL Database</h1>
      <p><strong>Database Time:</strong> ${result.recordset[0].CurrentTime}</p>
      <p><strong>Database:</strong> SQS</p>
      <p><strong>SQL Server:</strong> rajco.database.windows.net</p>
      <p><strong>Web App:</strong> ${process.env.WEBSITE_SITE_NAME || "Local Dev"}</p>
    `);
  } catch (err) {
    res.status(500).send("❌ DB Connection Failed: " + err.message);
  }
});

app.listen(port, () =>
  console.log(`🚀 App running on http://localhost:${port}`)
);
