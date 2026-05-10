const { TableClient } = require("@azure/data-tables");
const { v4: uuidv4 } = require("uuid");

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
    if (error.statusCode !== 409) {
      throw error;
    }
  }
}

module.exports = async function (context, req) {
  try {
    const client = getTableClient();
    await ensureTable(client);

    if (req.method === "POST") {
      const body = req.body || {};
      const now = new Date();
      const rowKey = `${now.getTime()}-${uuidv4()}`;

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
        userAgent: req.headers["user-agent"] || ""
      };

      await client.createEntity(entity);

      context.res = {
        status: 201,
        headers: {
          "Content-Type": "application/json"
        },
        body: {
          ok: true,
          id: rowKey,
          message: "Resultado guardado correctamente."
        }
      };

      return;
    }

    if (req.method === "GET") {
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

      context.res = {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        },
        body: resultados
      };

      return;
    }

    context.res = {
      status: 405,
      body: {
        ok: false,
        message: "Método no permitido."
      }
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
        message: "Error en la API de resultados.",
        detail: error.message
      }
    };
  }
};