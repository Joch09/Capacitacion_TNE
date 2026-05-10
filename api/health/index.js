module.exports = async function (context, req) {
    context.res = {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        ok: true,
        message: "API funcionando",
        hasStorageConnection: Boolean(process.env.AZURE_STORAGE_CONNECTION_STRING),
        hasResultsTable: Boolean(process.env.RESULTADOS_TABLE),
        tableName: process.env.RESULTADOS_TABLE || null
      }
    };
  };