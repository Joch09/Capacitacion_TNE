const { TableClient } = require("@azure/data-tables");

const tableName = process.env.RESULTADOS_TABLE || "ResultadosTNE";

function getTableClient() {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

  if (!connectionString) {
    throw new Error("Falta AZURE_STORAGE_CONNECTION_STRING.");
  }

  return TableClient.fromConnectionString(connectionString, tableName);
}

function escapeCsv(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

module.exports = async function (context, req) {
  try {
    const client = getTableClient();

    const rows = [];

    for await (const entity of client.listEntities({
      queryOptions: {
        filter: `PartitionKey eq 'TNE'`
      }
    })) {
      rows.push(entity);
    }

    rows.sort((a, b) => new Date(b.fechaEnvio || 0) - new Date(a.fechaEnvio || 0));

    const headers = [
      "fechaEnvio",
      "nombre",
      "correo",
      "entidad",
      "unidad",
      "cargo",
      "score",
      "totalQuestions",
      "percent",
      "diagnosticScore",
      "diagnosticTotal",
      "modulesReviewed"
    ];

    const csvLines = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((header) => escapeCsv(row[header]))
          .join(",")
      )
    ];

    const csv = "\uFEFF" + csvLines.join("\n");

    context.res = {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=resultados_tne.csv"
      },
      body: csv
    };
  } catch (error) {
    context.log.error(error);

    context.res = {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        ok: false,
        message: "Error al generar CSV.",
        detail: error.message
      }
    };
  }
};