const { app } = require("@azure/functions");
const { TableClient } = require("@azure/data-tables");
const { randomUUID } = require("crypto");

const tableName = process.env.RESULTADOS_TABLE || "ResultadosTNE";

function getTableClient() {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

  if (!connectionString) {
    throw new Error("Falta AZURE_STORAGE_CONNECTION_STRING.");
  }

  return TableClient.fromConnectionString(connectionString, tableName);
}

async function ensureTable(client) {
  try {
    await client.createTable();
  } catch (error) {
    if (error.statusCode !== 409 && error.status !== 409) {
      throw error;
    }
  }
}

async function readJsonBody(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

app.http("resultados", {
  route: "resultados",
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const client = getTableClient();
      await ensureTable(client);

      if (request.method === "POST") {
        const body = await readJsonBody(request);
        const now = new Date();
        const rowKey = `${now.getTime()}-${randomUUID()}`;

        const entity = {
          partitionKey: "TNE",
          rowKey,

          nombre: body.nombre || "",
          correo: body.correo || "",
          entidad: body.entidad || "",
          unidad: body.unidad || "",
          cargo: body.cargo || "",

          score: Number(body.score || 0),
          totalQuestions: Number(body.totalQuestions || 0),
          percent: Number(body.percent || 0),

          diagnosticScore: Number(body.diagnosticScore || 0),
          diagnosticTotal: Number(body.diagnosticTotal || 0),
          modulesReviewed: Number(body.modulesReviewed || 0),

          fechaEnvio: body.fechaEnvio || now.toISOString(),
          userAgent: request.headers.get("user-agent") || ""
        };

        await client.createEntity(entity);

        return {
          status: 201,
          jsonBody: {
            ok: true,
            id: rowKey,
            message: "Resultado guardado correctamente."
          }
        };
      }

      const resultados = [];

      for await (const entity of client.listEntities({
        queryOptions: {
          filter: `PartitionKey eq 'TNE'`
        }
      })) {
        resultados.push({
          id: entity.rowKey,
          nombre: entity.nombre || "",
          correo: entity.correo || "",
          entidad: entity.entidad || "",
          unidad: entity.unidad || "",
          cargo: entity.cargo || "",
          score: entity.score || 0,
          totalQuestions: entity.totalQuestions || 0,
          percent: entity.percent || 0,
          diagnosticScore: entity.diagnosticScore || 0,
          diagnosticTotal: entity.diagnosticTotal || 0,
          modulesReviewed: entity.modulesReviewed || 0,
          fechaEnvio: entity.fechaEnvio || ""
        });
      }

      resultados.sort((a, b) => new Date(b.fechaEnvio) - new Date(a.fechaEnvio));

      return {
        status: 200,
        jsonBody: resultados
      };
    } catch (error) {
      context.error(error);

      return {
        status: 500,
        jsonBody: {
          ok: false,
          message: "Error en la API de resultados.",
          detail: error.message
        }
      };
    }
  }
});