const { app } = require("@azure/functions");

app.http("health", {
  route: "health",
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    return {
      status: 200,
      jsonBody: {
        ok: true,
        message: "API funcionando",
        hasStorageConnection: Boolean(process.env.AZURE_STORAGE_CONNECTION_STRING),
        hasResultsTable: Boolean(process.env.RESULTADOS_TABLE),
        tableName: process.env.RESULTADOS_TABLE || null
      }
    };
  }
});