import React, { useEffect, useMemo, useState } from "react";

// Estilos globales de animación CSS
const GLOBAL_STYLE = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-content {
    animation: fadeIn 0.5s ease-out forwards;
  }
`;

const COLORS = {
  guinda: "#691C32",
  guindaClaro: "#9F2241",
  verde: "#235B4E",
  verdeOscuro: "#10312B",
  beige: "#DDC9A3",
  dorado: "#BC955C",
  gris: "#98989A",
  grisOscuro: "#6F7271",
  fondo: "#F3EFE6", // Crema del mockup
  tarjeta: "#FFFFFF",
  exito: "#DDEEE5",
  error: "#F7DDDD",
  texto: "#000000",
};

const STORAGE_KEY = "capacitacion_tne_v3_resultados";
const ADMIN_CODE = "IMSSB-TNE-2026";
const RESULTS_API_PATH = "/api/resultados";
const RESULTS_CSV_PATH = "/api/resultados-csv";

const MANUAL_PATH = "/34_Manual_Temp_Nats_Extremas.pdf";
const LOGO_SRC = "data:image/png;base64,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";

const welcomeText = {
  title: "Bienvenida(o) a tu capacitación",
  subtitle:
    "Vigilancia epidemiológica de daños a la salud por temperaturas naturales extremas",
  paragraphs: [
    "En IMSS-BIENESTAR, la vigilancia epidemiológica es una función esencial para la identificación oportuna de riesgos y para la generación de información útil en la prevención, el control y la toma de decisiones.",
    "En este curso revisarás los componentes básicos del sistema, desde la identificación y notificación de casos y defunciones hasta el análisis de la información, la retroalimentación entre niveles de conducción y el seguimiento del desempeño.",
    "La capacitación es autoguiada. Primero realiza tu registro y, enseguida, responde la evaluación diagnóstica inicial."
  ]
};

const closingText = {
  title: "Capacitación concluida",
  paragraphs: [
    "Has finalizado la capacitación sobre vigilancia epidemiológica de daños a la salud por temperaturas naturales extremas.",
    "En IMSS-BIENESTAR, la vigilancia epidemiológica es una función estratégica para generar información útil, oportuna y confiable que permita orientar acciones de prevención, control y respuesta en salud pública.",
    "Tu participación fortalece la capacidad institucional para identificar riesgos, mejorar la calidad del registro y sostener una respuesta técnica coordinada en beneficio de la población atendida.",
    "Continúa con la sección de lecturas recomendadas para profundizar en los contenidos revisados durante la capacitación."
  ]
};

const recommendedReadings = [
  {
    category: "Lectura base del curso",
    title:
      "Manual de procedimientos estandarizados para la vigilancia epidemiológica de daños a la salud por temperaturas naturales extremas (SVEDSTNE)",
    description: "Documento base de consulta para el desarrollo de la capacitación.",
    url: MANUAL_PATH,
    label: "Abrir manual"
  },
  {
    category: "Lecturas complementarias",
    title: "Naciones Unidas | ¿Qué es el cambio climático?",
    description: "Conceptos generales sobre cambio climático y su relevancia global.",
    url: "https://www.un.org/es/climatechange/what-is-climate-change",
    label: "Consultar"
  },
  {
    category: "Lecturas complementarias",
    title: "Lancet Countdown | Heat-related mortality",
    description: "Indicadores internacionales sobre mortalidad relacionada con calor.",
    url: "https://www.lancetcountdown.org/data-platform/health-hazards-exposures-and-impacts/1-1-health-and-heat/1-1",
    label: "Consultar"
  },
  {
    category: "Lecturas complementarias",
    title:
      "Zhao et al. 2021 | Global, regional, and national burden of mortality associated with non-optimal ambient temperatures",
    description: "Carga global, regional y nacional de mortalidad asociada a temperaturas no óptimas.",
    url: "https://pubmed.ncbi.nlm.nih.gov/34245712/",
    label: "Consultar"
  },
  {
    category: "Lecturas complementarias",
    title: "Heat-related mortality in Europe during the summer of 2022",
    description: "Análisis de mortalidad asociada a calor en Europa durante 2022.",
    url: "https://www.nature.com/articles/s41591-023-02419-z",
    label: "Consultar"
  },
  {
    category: "Lecturas complementarias",
    title: "The Lancet | Hot weather and heat extremes: health risks",
    description: "Revisión sobre riesgos para la salud asociados a calor extremo.",
    url: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(21)01208-3/fulltext",
    label: "Consultar"
  },
  {
    category: "Lecturas complementarias",
    title: "IPCC | Climate Change 2022: Mitigation of Climate Change",
    description: "Reporte del IPCC sobre mitigación del cambio climático.",
    url: "https://www.ipcc.ch/report/ar6/wg3/",
    label: "Consultar"
  }
];

const diagnosticQuestions = [
  {
    id: "d1",
    question:
      "¿Cuál es la finalidad principal del sistema de vigilancia epidemiológica de daños a la salud por temperaturas naturales extremas?",
    options: [
      "Registrar únicamente defunciones ocurridas por calor extremo",
      "Generar información estandarizada, oportuna y confiable sobre daños a la salud asociados a temperaturas naturales extremas",
      "Sustituir los registros clínicos de las unidades médicas",
      "Concentrar exclusivamente datos meteorológicos"
    ],
    correct: 1
  },
  {
    id: "d2",
    question:
      "¿Cuál de los siguientes eventos forma parte de los daños sujetos a vigilancia en el SVEDSTNE?",
    options: [
      "Neumonía adquirida en la comunidad",
      "Dengue con signos de alarma",
      "Hipotermia",
      "Influenza estacional"
    ],
    correct: 2
  },
  {
    id: "d3",
    question:
      "¿Qué documento se utiliza para ratificar o rectificar causas sujetas a vigilancia epidemiológica en una defunción?",
    options: [
      "Hoja diaria de consulta externa",
      "Anexo 8",
      "Resumen clínico hospitalario",
      "Estudio epidemiológico semanal"
    ],
    correct: 1
  },
  {
    id: "d4",
    question: "Si en una semana no se presentan casos ni defunciones, ¿qué debe emitirse?",
    options: [
      "Un aviso interno sin registro formal",
      "Un boletín especial",
      "Red negativa",
      "Un informe mensual acumulado"
    ],
    correct: 2
  },
  {
    id: "d5",
    question: "¿Cuál es uno de los propósitos del análisis de la información en este sistema?",
    options: [
      "Reemplazar la supervisión operativa",
      "Identificar riesgos, patrones y factores asociados para orientar acciones de prevención y control",
      "Limitar la difusión de la información a un solo nivel",
      "Registrar solo datos históricos sin uso operativo"
    ],
    correct: 1
  },
  {
    id: "d6",
    question:
      "¿Qué nivel realiza la captura de casos y defunciones en la plataforma informática de TNE, de acuerdo con el procedimiento general?",
    options: ["Nivel local", "Nivel jurisdiccional o equivalente", "Nivel estatal", "Nivel federal"],
    correct: 2
  },
  {
    id: "d7",
    question:
      "En el caso de golpe de calor, ¿cuál de los siguientes criterios es correcto para la vigilancia?",
    options: [
      "Solo se notifica si existe temperatura documentada mayor a 41 °C",
      "Puede notificarse si el cuadro clínico es compatible, aun sin evidencia documentada de temperatura ≥40 °C",
      "Se notifica solo si hay hospitalización",
      "Se notifica únicamente si hubo exposición laboral"
    ],
    correct: 1
  },
  {
    id: "d8",
    question: "¿Cuál es la utilidad principal de la red negativa dentro del sistema?",
    options: [
      "Confirmar que la unidad queda exenta de vigilancia esa semana",
      "Sustituir la notificación de casos leves",
      "Demostrar que se mantuvo la vigilancia aun en ausencia de casos y defunciones",
      "Reportar solo problemas administrativos"
    ],
    correct: 2
  },
  {
    id: "d9",
    question:
      "Cuando al momento de la notificación de una defunción aún no se cuenta con toda la documentación requerida, ¿qué procede?",
    options: [
      "Esperar hasta reunir todos los documentos antes de notificar",
      "Notificar como caso y actualizar posteriormente a defunción cuando se integre la documentación",
      "Cancelar el registro",
      "Notificar como defunción sin necesidad de soporte documental"
    ],
    correct: 1
  },
  {
    id: "d10",
    question: "¿Qué evalúa principalmente el indicador de oportunidad de notificación?",
    options: [
      "La gravedad clínica de los casos",
      "La calidad del tratamiento otorgado",
      "El cumplimiento del reporte semanal de casos, defunciones y/o red negativa",
      "El número de pacientes hospitalizados por entidad"
    ],
    correct: 2
  }
];

const finalQuestions = [
  {
    id: "f1",
    question:
      "¿Cuál de las siguientes afirmaciones describe mejor la relación entre cambio climático y salud pública?",
    options: [
      "El cambio climático solo afecta ecosistemas y agricultura, no la salud humana.",
      "El cambio climático incrementa la frecuencia e intensidad de eventos extremos que pueden aumentar riesgos y daños a la salud.",
      "El cambio climático únicamente modifica la temperatura promedio anual, sin alterar riesgos epidemiológicos.",
      "El cambio climático solo produce efectos sanitarios en países insulares."
    ],
    correct: 1
  },
  {
    id: "f2",
    question:
      "¿Por qué las temperaturas naturales extremas se consideran un problema relevante para la salud pública?",
    options: [
      "Porque solo generan molestias térmicas transitorias.",
      "Porque afectan exclusivamente a población sin acceso a servicios médicos.",
      "Porque pueden ocasionar enfermedad, agravar padecimientos previos y producir defunciones prevenibles.",
      "Porque su impacto es principalmente meteorológico y no sanitario."
    ],
    correct: 2
  },
  {
    id: "f3",
    question: "La finalidad principal del SVEDSTNE es:",
    options: [
      "Sustituir la atención clínica de urgencias por un sistema administrativo.",
      "Establecer vigilancia estandarizada, oportuna y confiable de daños a la salud asociados a temperaturas naturales extremas.",
      "Registrar únicamente defunciones asociadas a calor y frío.",
      "Concentrar información climatológica para uso exclusivo de protección civil."
    ],
    correct: 1
  },
  {
    id: "f4",
    question:
      "¿Cuál de los siguientes enunciados expresa mejor la utilidad de la información generada por el SVEDSTNE?",
    options: [
      "Sirve únicamente para integrar estadísticas históricas sin aplicación operativa.",
      "Permite elaborar análisis epidemiológico y orientar acciones preventivas y de control.",
      "Se utiliza solo para fines académicos y de investigación.",
      "Sustituye la necesidad de supervisión operativa."
    ],
    correct: 1
  },
  {
    id: "f5",
    question: "¿Cuál es el instrumento normativo específico citado como base de la vigilancia epidemiológica en México?",
    options: ["NOM-004-SSA3-2012", "NOM-017-SSA2-2012", "NOM-035-STPS-2018", "NOM-031-SSA2-1999"],
    correct: 1
  },
  {
    id: "f6",
    question:
      "De acuerdo con el flujo operativo del sistema, ¿quién realiza la captura en la plataforma informática de TNE?",
    options: ["El nivel local u operativo", "El nivel jurisdiccional o equivalente", "El nivel estatal", "El nivel federal"],
    correct: 2
  },
  {
    id: "f7",
    question: "¿Cuál de los siguientes eventos sí está sujeto a vigilancia dentro del SVEDSTNE?",
    options: ["Gastroenteritis infecciosa aguda", "Hipotermia", "Influenza estacional", "Dengue no grave"],
    correct: 1
  },
  {
    id: "f8",
    question:
      "En la definición operacional de golpe de calor, ¿qué criterio es correcto?",
    options: [
      "Solo puede notificarse si existe una temperatura documentada mayor a 41 °C.",
      "No debe notificarse si el paciente ya se encuentra hidratado al momento de la valoración.",
      "Puede notificarse si el cuadro clínico es compatible, aun cuando no se documente temperatura ≥40 °C.",
      "Solo se considera si existe quemadura solar asociada."
    ],
    correct: 2
  },
  {
    id: "f9",
    question:
      "¿Cuál de las siguientes situaciones no debe notificarse como intoxicación por monóxido de carbono dentro del componente de TNE?",
    options: [
      "Exposición por combustión inadecuada al intentar protegerse del frío.",
      "Paciente con cefalea, mareo y náusea tras usar brasero en habitación cerrada durante el frío.",
      "Intoxicación derivada de un incendio no relacionado con intento de protección contra el frío.",
      "Caso con antecedente de exposición a humo de anafre durante una noche fría."
    ],
    correct: 2
  },
  {
    id: "f10",
    question:
      "¿En qué plazo debe notificarse el caso al nivel técnico-administrativo inmediato superior según el manual?",
    options: [
      "En un plazo no mayor a 24 horas",
      "En un plazo no mayor a 3 días naturales",
      "En un plazo no mayor a 5 días hábiles",
      "En un plazo no mayor a 10 días hábiles"
    ],
    correct: 2
  },
  {
    id: "f11",
    question:
      "Si al momento de la notificación de una defunción aún no se cuenta con el certificado de defunción y el Anexo 8, ¿qué procede?",
    options: [
      "Esperar a reunir los documentos antes de hacer cualquier notificación",
      "Notificar directamente como defunción, aunque no exista soporte documental",
      "Notificar como caso y actualizar posteriormente a defunción cuando se integre la documentación",
      "Cancelar el registro hasta nuevo aviso"
    ],
    correct: 2
  },
  {
    id: "f12",
    question:
      "¿Cuáles son los dos documentos obligatorios para la notificación documental de una defunción por TNE?",
    options: [
      "Nota médica y hoja de egreso",
      "Certificado de defunción y Anexo 8",
      "Hoja diaria y resumen estadístico semanal",
      "Oficio jurisdiccional y acta de nacimiento"
    ],
    correct: 1
  },
  {
    id: "f13",
    question: "La red negativa semanal sirve para:",
    options: [
      "Confirmar que una unidad quedó exenta de vigilancia durante la semana",
      "Informar formalmente la ausencia de casos y/o defunciones y demostrar continuidad de la vigilancia",
      "Sustituir la notificación individual de casos",
      "Reportar únicamente inconsistencias administrativas"
    ],
    correct: 1
  },
  {
    id: "f14",
    question: "¿Qué evalúa principalmente el indicador de oportunidad de notificación?",
    options: [
      "La gravedad clínica de los casos registrados",
      "El apego terapéutico de los pacientes atendidos",
      "El cumplimiento de la notificación semanal de casos, defunciones y/o red negativa",
      "La calidad del tratamiento hospitalario"
    ],
    correct: 2
  },
  {
    id: "f15",
    question:
      "¿Cuál es la mejor descripción del análisis de la información dentro del SVEDSTNE?",
    options: [
      "Es una actividad exclusiva del nivel central y no involucra retroalimentación a otros niveles",
      "Consiste solo en sumar casos por semana epidemiológica",
      "Implica interpretar la información para identificar riesgos, factores, patrones y orientar acciones de prevención y control",
      "Se limita a la difusión pública de boletines sin uso operativo interno"
    ],
    correct: 2
  }
];

const modules = [
  {
    id: "m1",
    number: 1,
    title: "Contexto epidemiológico internacional y nacional",
    icon: "🌡️",
    topics: [
      {
        title: "Relación entre cambio climático y aumento del riesgo por temperaturas naturales extremas",
        objective:
          "Comprender cómo el cambio climático incrementa la frecuencia, intensidad y duración de eventos térmicos extremos y por qué eso importa para la vigilancia epidemiológica.",
        visualType: "climate_impact",
        sections: [
          {
            heading: "Cambio climático como amplificador del riesgo sanitario",
            text:
              "El cambio climático no se limita a un incremento gradual de la temperatura media del planeta. Su efecto más relevante para salud pública es que modifica la frecuencia, intensidad, duración y estacionalidad de múltiples eventos extremos. Esto incrementa la probabilidad de exposición a condiciones térmicas peligrosas y vuelve más frecuentes situaciones que antes podían considerarse extraordinarias."
          },
          {
            heading: "De calentamiento global a exposición térmica riesgosa",
            text:
              "El riesgo no depende solo de “hacer calor” o “hacer frío”. También depende de la intensidad del evento, su duración, la capacidad de adaptación de la población, la calidad de la vivienda, la continuidad del suministro eléctrico, la disponibilidad de agua y las condiciones sociales de los grupos expuestos."
          },
          {
            heading: "Implicaciones para el sector salud",
            text:
              "Para el sector salud, esta relación obliga a pasar de una lógica reactiva a una lógica anticipatoria. Fortalecer la vigilancia epidemiológica ante temperaturas extremas es una respuesta técnica a un patrón de riesgo que seguirá creciendo y que afecta servicios, infraestructura, personal y población."
          }
        ],
        critical:
          "Las temperaturas extremas deben entenderse como un problema sanitario y no solo meteorológico. La vigilancia permite anticipar daños y orientar acciones preventivas y de respuesta."
      },
      {
        title: "Calor y frío extremos como riesgos emergentes para la salud pública",
        objective:
          "Reconocer que tanto el calor como el frío extremos pueden producir enfermedad, agravar padecimientos previos y causar defunciones prevenibles.",
        visualType: "heat_cold_icons",
        sections: [
          {
            heading: "Calor extremo: riesgo agudo y de rápida letalidad",
            text:
              "El calor extremo puede desencadenar cuadros graves en cuestión de horas o días. Aumenta el riesgo de descompensación cardiovascular, respiratoria y metabólica, genera demanda asistencial repentina y puede producir muerte de forma rápida si no existe atención oportuna."
          },
          {
            heading: "Frío extremo: riesgo persistente y frecuentemente subestimado",
            text:
              "El frío incrementa la posibilidad de hipotermia, intoxicación por monóxido de carbono y descompensación de enfermedades crónicas. Aunque suele recibir menos atención que el calor, también puede causar enfermedad grave y mortalidad importante, sobre todo en población vulnerable."
          },
          {
            heading: "Por qué son riesgos emergentes",
            text:
              "La combinación de cambio climático, condiciones sociales desiguales y capacidad variable de adaptación vuelve a las temperaturas extremas un problema creciente de salud pública. La vigilancia epidemiológica es necesaria para dimensionar ese riesgo y responder con oportunidad."
          }
        ]
      },
      {
        title: "Relevancia internacional y nacional del problema",
        objective:
          "Reconocer la magnitud del problema a nivel internacional y su expresión concreta en México para justificar el fortalecimiento de la respuesta sanitaria.",
        visualType: "mexico_map_viz",
        sections: [
          {
            heading: "Dimensión internacional",
            text:
              "Organismos internacionales han documentado que el cambio climático incrementa los daños a la salud y que las temperaturas extremas constituyen una causa creciente de enfermedad y mortalidad. Esto no es un problema local aislado, sino una tendencia global con implicaciones sanitarias reales."
          },
          {
            heading: "Relevancia nacional en México",
            text:
              "En México, el manual operativo muestra que las temporadas recientes de calor y de frío han registrado incrementos importantes de casos y defunciones. En particular, se ha observado mayor notificación de daño por golpe de calor y defunciones asociadas, así como persistencia de eventos por intoxicación por monóxido de carbono en temporada de frío."
          },
          {
            heading: "Necesidad de fortalecer la capacidad de respuesta sanitaria",
            text:
              "Frente a este panorama, el sector salud debe prepararse para detectar con rapidez, atender clínicamente con oportunidad, documentar de forma adecuada, comunicar de manera ágil y analizar la información para orientar prevención, control y priorización de riesgos."
          }
        ]
      }
    ],
    review: {
      type: "single",
      prompt:
        "¿Qué enunciado resume mejor la relación entre cambio climático y temperaturas naturales extremas?",
      options: [
        { text: "El cambio climático no modifica riesgos sanitarios relevantes.", correct: false },
        { text: "El cambio climático incrementa la probabilidad de exposición a condiciones térmicas peligrosas y sus daños en salud.", correct: true },
        { text: "Las temperaturas extremas solo son un asunto meteorológico, no sanitario.", correct: false }
      ],
      feedbackGood:
        "Correcto. El cambio climático actúa como amplificador del riesgo y vuelve más probable la exposición a condiciones térmicas peligrosas.",
      feedbackBad:
        "Revisa la relación entre clima cambiante, exposición térmica y daño sanitario. El punto central es el aumento del riesgo."
    }
  },
  {
    id: "m2",
    number: 2,
    title: "Justificación del SVEDSTNE",
    icon: "☀️",
    topics: [
      {
        title: "Finalidad del sistema de vigilancia epidemiológica de daños a la salud por TNE",
        objective:
          "Explicar por qué la vigilancia epidemiológica es una función estratégica y por qué los daños por temperaturas extremas requieren un sistema específico, continuo y estandarizado.",
        visualType: "purpose_infographic",
        sections: [
          {
            heading: "La vigilancia epidemiológica como función estratégica de salud pública",
            text:
              "La vigilancia no es únicamente un mecanismo de registro. Su valor está en la recolección continua de datos, su consolidación, evaluación ordenada y difusión oportuna a quienes deben actuar. En TNE, esto significa producir información útil para prevención, control y toma de decisiones."
          },
          {
            heading: "Por qué los daños por TNE requieren un sistema específico",
            text:
              "Los daños por temperaturas naturales extremas son eventos estacionales, pero de vigilancia continua; pueden concentrar casos graves y defunciones en periodos cortos; y requieren seguimiento diferenciado de casos y defunciones, incluida integración documental específica. Por ello no conviene diluirlos en registros generales."
          },
          {
            heading: "Finalidad técnica del SVEDSTNE",
            text:
              "Desde el punto de vista técnico, el sistema cumple tres funciones: identificar y registrar de manera nominal los daños a la salud; caracterizarlos epidemiológicamente; y convertir esa información en insumo para prevención, control y conducción sanitaria."
          }
        ],
        critical:
          "El SVEDSTNE no sustituye otros sistemas. Complementa la vigilancia convencional con continuidad, criterios homogéneos y seguimiento documental para eventos de alta sensibilidad sanitaria."
      },
      {
        title: "Utilidad de la información para análisis epidemiológico y orientación de acciones preventivas",
        objective:
          "Comprender que la información generada por el sistema no debe agotarse en el registro, sino orientar análisis epidemiológico, prevención, control y evaluación del desempeño.",
        visualType: "cycle_diagram",
        sections: [
          {
            heading: "La información epidemiológica como base para el análisis",
            text:
              "La utilidad de la información está en que permite pasar del caso individual al entendimiento del fenómeno colectivo. A partir del análisis se identifican tendencias, omisiones, factores asociados y oportunidades de intervención que no son visibles desde la atención de un caso aislado."
          },
          {
            heading: "Utilidad para orientar acciones preventivas",
            text:
              "La información del sistema debe servir para actuar antes, durante y después de periodos de riesgo: alertar a la población, reforzar vigilancia intensificada, priorizar grupos vulnerables y orientar acciones de control."
          },
          {
            heading: "Utilidad para evaluar desempeño y mejorar el sistema",
            text:
              "La información también sirve para evaluar la calidad de la propia vigilancia. Indicadores como oportunidad de notificación y documentación permiten valorar continuidad, integridad de la información y capacidad de respuesta del sistema."
          }
        ]
      }
    ],
    review: {
      type: "multiselect",
      prompt: "Selecciona las afirmaciones correctas sobre la justificación del SVEDSTNE.",
      options: [
        { text: "El sistema existe porque los daños por TNE pueden ser graves, súbitos y requieren seguimiento diferenciado de casos y defunciones.", correct: true },
        { text: "La información del sistema solo tiene valor histórico y no orienta acciones preventivas.", correct: false },
        { text: "La vigilancia epidemiológica es una función estratégica de salud pública y no solo un registro administrativo.", correct: true },
        { text: "El sistema se limita a concentrar información climatológica sin utilidad epidemiológica.", correct: false }
      ],
      feedbackGood:
        "Correcto. Identificaste la lógica epidemiológica e institucional que da sentido al sistema.",
      feedbackBad:
        "Revisa la finalidad técnica del sistema y el valor operativo de la información para análisis, prevención y mejora del desempeño."
    }
  },
  {
    id: "m3",
    number: 3,
    title: "Marco normativo, institucional, niveles de conducción y flujo de información",
    icon: "📊",
    topics: [
      {
        title: "Fundamento normativo vigente",
        objective:
          "Identificar el sustento normativo que da base a la vigilancia epidemiológica y ubicar al componente TNE dentro del marco general del SINAVE.",
        visualType: "normativity_pillar",
        sections: [
          {
            heading: "La vigilancia como obligación del Estado",
            text:
              "La vigilancia epidemiológica es una función formal del Estado y del Sistema Nacional de Salud. Su base general parte del derecho a la protección de la salud y se desarrolla mediante la Ley General de Salud, así como mediante instrumentos normativos que organizan la prevención, el control y la vigilancia."
          },
          {
            heading: "La NOM-017 y el SINAVE como base operativa",
            text:
              "La NOM-017-SSA2-2012 sigue siendo el instrumento rector para la vigilancia epidemiológica en México. Define lineamientos y procedimientos del Sistema Nacional de Vigilancia Epidemiológica, dentro del cual el componente TNE funciona como un subsistema especial para eventos prioritarios."
          },
          {
            heading: "CONAVE y coordinación interinstitucional",
            text:
              "El Acuerdo Secretarial 130 da soporte al CONAVE, instancia de coordinación normativa superior. A nivel estatal y jurisdiccional existen espacios colegiados análogos cuya función es dar seguimiento técnico y favorecer homogeneidad de criterios."
          }
        ],
        critical:
          "Para fines operativos de la capacitación, la referencia normativa principal sigue siendo la NOM-017-SSA2-2012, junto con el manual vigente del SVEDSTNE y la organización funcional del SINAVE."
      },
      {
        title: "Funciones y atribuciones por nivel de conducción",
        objective:
          "Distinguir con claridad qué hace cada nivel de conducción de IMSS-BIENESTAR dentro del flujo de vigilancia epidemiológica de TNE.",
        visualType: "hierarchy_roles",
        sections: [
          {
            heading: "Cargo local u operativo",
            text:
              "Es la puerta de entrada del sistema. Identifica casos y defunciones, realiza valoración médica y tratamiento inicial, llena el estudio de caso, notifica al nivel superior y mantiene la red negativa cuando no existan eventos."
          },
          {
            heading: "Cargoes jurisdiccional, zonal o equivalente",
            text:
              "Reciben información de las unidades, revisan integridad, validan estudios de caso, solicitan correcciones y vigilan el cumplimiento del flujo semanal."
          },
          {
            heading: "Cargo estatal y nivel central",
            text:
              "El nivel estatal consolida información, captura en plataforma, coordina cotejo documental con REDVE y analiza la información estatal. El nivel central ejerce rectoría técnica, valida, retroalimenta y difunde resultados nacionales."
          }
        ]
      },
      {
        title: "Flujo de información",
        objective:
          "Mostrar cómo circula la información desde la unidad notificante hasta el nivel central y qué valor agrega cada nivel en esa cadena técnica.",
        visualType: "data_flow_chart",
        sections: [
          {
            heading: "El flujo como cadena técnica",
            text:
              "El flujo de información no es un simple envío de formatos. Cada nivel agrega validación, corrección, seguimiento y análisis. Esta cadena técnica asegura oportunidad, calidad y uso útil de la información."
          }
        ],
        flowchart: true
      }
    ],
    review: {
      type: "truefalse",
      prompt: "Marca verdadero o falso para cada enunciado.",
      items: [
        { text: "La captura en la plataforma informática de TNE corresponde al nivel estatal.", answer: true },
        { text: "La vigilancia epidemiológica del componente TNE funciona por fuera del SINAVE y sin base normativa nacional.", answer: false },
        { text: "El flujo de información agrega revisión, validación, análisis y retroalimentación entre niveles de conducción.", answer: true }
      ],
      feedbackGood:
        "Correcto. Distinguiste base normativa, función del nivel estatal y el sentido técnico del flujo de información.",
      feedbackBad:
        "Revisa la relación entre SINAVE, funciones por nivel y el papel del flujo de información como cadena técnica."
    }
  },
  {
    id: "m4",
    number: 4,
    title: "Eventos sujetos a vigilancia y criterios básicos de identificación",
    icon: "⚠️",
    topics: [
      {
        title: "Descripción de daños a la salud por TNE sujetos a vigilancia",
        objective:
          "Reconocer los eventos sujetos a vigilancia y distinguir entre aquellos asociados a calor extremo y a frío extremo.",
        visualType: "health_impact_grid",
        sections: [
          {
            heading: "Eventos asociados a calor extremo",
            text:
              "El sistema vigila golpe de calor, deshidratación y quemadura solar. Cada evento requiere reconocimiento clínico y antecedente de exposición térmica, así como codificación correcta para fines de registro y análisis."
          },
          {
            heading: "Eventos asociados a frío extremo",
            text:
              "Durante la temporada de frío se vigilan hipotermia e intoxicación por monóxido de carbono. En este último caso, la exposición debe estar relacionada con intento de protegerse del frío mediante combustión inadecuada."
          },
          {
            heading: "Importancia de reconocer el evento correcto",
            text:
              "La calidad de la vigilancia depende de distinguir correctamente los eventos incluidos y excluir situaciones que, aunque similares en apariencia, no pertenecen al componente TNE."
          }
        ],
        critical:
          "No toda intoxicación por monóxido de carbono pertenece al componente TNE. El contexto de exposición es decisivo."
      },
      {
        title: "Definiciones operacionales",
        objective:
          "Aplicar correctamente las definiciones operacionales como criterio de inclusión epidemiológica y no solo como resumen del diagnóstico clínico.",
        visualType: "thermometer_viz",
        sections: [
          {
            heading: "Función de la definición operacional",
            text:
              "La definición operacional no sustituye al diagnóstico médico. Su función es estandarizar el ingreso de eventos al sistema para que la información sea comparable y útil para vigilancia."
          },
          {
            heading: "Golpe de calor, deshidratación y quemadura solar",
            text:
              "En golpe de calor, la ausencia de una temperatura documentada igual o mayor a 40 °C no debe impedir la notificación si el cuadro clínico es compatible. La deshidratación y la quemadura solar deben asociarse claramente a exposición térmica extrema."
          },
          {
            heading: "Hipotermia e intoxicación por monóxido de carbono",
            text:
              "La hipotermia implica exposición al frío y descenso de temperatura corporal con manifestaciones compatibles. La intoxicación por monóxido de carbono solo se incluye cuando ocurre accidentalmente al intentar protegerse del frío."
          }
        ]
      },
      {
        title: "Tiempos de notificación y errores comunes",
        objective:
          "Reconocer la importancia de la oportunidad y distinguir errores frecuentes que afectan la calidad de la vigilancia.",
        visualType: "timeline_errors",
        sections: [
          {
            heading: "Tiempos operativos",
            text:
              "El nivel local debe notificar al inmediato superior en un plazo no mayor a cinco días hábiles. Las defunciones requieren integración documental en plazo establecido y la información semanal alimenta los boletines epidemiológicos."
          },
          {
            heading: "Errores comunes",
            text:
              "Entre los errores frecuentes están descartar casos por falta de medición ideal, notificar tarde, omitir red negativa, clasificar erróneamente intoxicaciones por incendios como TNE y no actualizar un caso cuando evoluciona a defunción."
          },
          {
            heading: "Por qué importa la oportunidad",
            text:
              "La utilidad de la vigilancia depende de la rapidez del reporte. Una notificación tardía debilita la posibilidad de activar alertas, reforzar mensajes preventivos y responder de forma coordinada."
          }
        ]
      }
    ],
    review: {
      type: "multiselect",
      prompt: "Selecciona las afirmaciones correctas sobre identificación y notificación de eventos.",
      options: [
        { text: "El golpe de calor puede notificarse con cuadro compatible aun sin temperatura documentada ≥40 °C.", correct: true },
        { text: "Toda intoxicación por monóxido de carbono debe notificarse como TNE, sin importar el contexto de exposición.", correct: false },
        { text: "Hipotermia e intoxicación por monóxido de carbono forman parte de los eventos vigilados en temporada de frío.", correct: true },
        { text: "La oportunidad de notificación es irrelevante si la documentación se integra varios meses después.", correct: false }
      ],
      feedbackGood:
        "Correcto. Identificaste tanto el alcance del sistema como los criterios operativos clave para notificación.",
      feedbackBad:
        "Revisa eventos sujetos a vigilancia, definiciones operacionales y la importancia de la oportunidad del reporte."
    }
  },
  {
    id: "m5",
    number: 5,
    title: "Defunciones: integración documental y coordinación con REDVE",
    icon: "📄",
    topics: [
      {
        title: "Procedimiento general para la notificación de una defunción",
        objective:
          "Comprender la lógica operativa de la defunción como evento de alta sensibilidad y el procedimiento para su notificación oportuna.",
        visualType: "process_checklist",
        sections: [
          {
            heading: "La defunción como evento de alta sensibilidad",
            text:
              "Una defunción por TNE requiere verificación causal, congruencia clínica y trazabilidad documental. No basta con anotar el evento: se necesita validar el soporte epidemiológico y documental correspondiente."
          },
          {
            heading: "Notificación inicial y actualización",
            text:
              "Si al momento de la notificación no se cuenta con la documentación requerida, el evento debe registrarse inicialmente como caso. Una vez obtenidos los documentos, el estatus se actualiza a defunción dentro del plazo señalado."
          },
          {
            heading: "Por qué no debe retrasarse la vigilancia",
            text:
              "La falta temporal de documentos no debe retrasar la notificación epidemiológica. Primero se protege la oportunidad de vigilancia; después se completa el soporte documental."
          }
        ],
        critical:
          "La vigilancia no debe detenerse por ausencia temporal de documentos. El registro puede iniciar como caso y actualizarse a defunción cuando se integra el soporte."
      },
      {
        title: "Documentación obligatoria y seguimiento documental",
        objective:
          "Identificar los documentos obligatorios para la notificación documental y entender el sentido del seguimiento estatal y central.",
        visualType: "document_pile",
        sections: [
          {
            heading: "Documentos obligatorios",
            text:
              "La notificación documental de una defunción por TNE requiere certificado de defunción y Anexo 8 en un solo archivo PDF legible, de acuerdo con el procedimiento del manual."
          },
          {
            heading: "Plazos documentales",
            text:
              "El soporte documental debe integrarse en el plazo establecido. Esto permite validar la causa, revisar consistencia y sostener el registro con evidencia verificable."
          },
          {
            heading: "Seguimiento de observaciones",
            text:
              "El seguimiento estatal y central permite solicitar correcciones, revisar consistencia entre documentos y asegurar calidad del registro."
          }
        ]
      },
      {
        title: "Coordinación con REDVE",
        objective:
          "Explicar por qué la coordinación con REDVE es clave para el cotejo, la validación y la trazabilidad de las defunciones notificadas por TNE.",
        visualType: "collaboration_handshake",
        sections: [
          {
            heading: "Cotejo y validación",
            text:
              "La coordinación con REDVE permite cotejar defunciones, verificar documentos y dar seguimiento a observaciones. Este proceso ayuda a garantizar que la notificación cuente con respaldo epidemiológico y documental."
          },
          {
            heading: "Valor institucional del seguimiento",
            text:
              "La defunción no se cierra con el registro inicial. Su seguimiento es parte de la calidad del sistema, porque impacta análisis, indicadores y conducción técnica."
          }
        ]
      }
    ],
    review: {
      type: "single",
      prompt: "¿Qué procede si aún no se cuenta con certificado de defunción y Anexo 8?",
      options: [
        { text: "Esperar a reunir toda la documentación antes de notificar.", correct: false },
        { text: "Notificar como caso y actualizar después a defunción cuando se integre la documentación.", correct: true },
        { text: "Cancelar el registro hasta contar con el dictamen final del nivel central.", correct: false }
      ],
      feedbackGood:
        "Correcto. La oportunidad de vigilancia se protege primero y la calidad documental se completa posteriormente.",
      feedbackBad:
        "Revisa el procedimiento general: la ausencia inicial de documentos no debe retrasar la vigilancia."
    }
  },
  {
    id: "m6",
    number: 6,
    title: "Red negativa, indicadores y evaluación del desempeño",
    icon: "📈",
    topics: [
      {
        title: "Red negativa",
        objective:
          "Entender la función de la red negativa y su papel para demostrar continuidad de la vigilancia aun en ausencia de casos o defunciones.",
        visualType: "zero_value_epid",
        sections: [
          {
            heading: "El valor epidemiológico del cero",
            text:
              "La red negativa no es un trámite menor. Su función es demostrar que la vigilancia se mantuvo activa aunque no se hayan detectado eventos. Sin ella, no es posible distinguir entre ausencia real de casos y falla de notificación."
          },
          {
            heading: "Flujo de la red negativa",
            text:
              "La red negativa debe circular conforme a cada nivel operativo. Para nivel estatal es obligatoria en ausencia de casos o defunciones, y en niveles locales y jurisdiccionales debe seguir su propio flujo interno."
          }
        ],
        critical:
          "Sin red negativa, el sistema pierde capacidad para demostrar continuidad operativa."
      },
      {
        title: "Indicadores del sistema",
        objective:
          "Identificar los indicadores centrales del módulo y comprender qué evalúa cada uno de ellos.",
        visualType: "metrics_dashboard",
        sections: [
          {
            heading: "Oportunidad de notificación",
            text:
              "Este indicador evalúa el cumplimiento del reporte semanal de casos, defunciones y/o red negativa. Mide continuidad, disciplina operativa y apego al procedimiento."
          },
          {
            heading: "Documentación",
            text:
              "El indicador de documentación valora si las defunciones cuentan con el soporte suficiente y oportuno. Esto es relevante porque la calidad documental también forma parte del desempeño del sistema."
          },
          {
            heading: "Qué no miden estos indicadores",
            text:
              "No evalúan gravedad clínica, calidad del tratamiento ni resultados terapéuticos. Su enfoque es la operación de la vigilancia."
          }
        ]
      },
      {
        title: "Evaluación del desempeño y mejora continua",
        objective:
          "Explicar cómo los indicadores permiten valorar el funcionamiento del sistema y orientar acciones correctivas y de mejora continua.",
        visualType: "arrows_loop_improvement",
        sections: [
          {
            heading: "Desempeño del sistema",
            text:
              "Un sistema no demuestra buen desempeño solo por captar eventos. También debe demostrar continuidad de vigilancia, cumplimiento de tiempos y calidad documental."
          },
          {
            heading: "Uso de los indicadores para retroalimentación",
            text:
              "Los indicadores permiten identificar omisiones, retrasos, debilidades estructurales y oportunidades de fortalecimiento. Por ello forman parte de la retroalimentación técnica entre niveles de conducción."
          }
        ]
      }
    ],
    review: {
      type: "truefalse",
      prompt: "Marca verdadero o falso para cada enunciado.",
      items: [
        { text: "La red negativa ayuda a demostrar continuidad de la vigilancia aun cuando no existieron casos ni defunciones.", answer: true },
        { text: "El indicador de oportunidad de notificación mide principalmente la gravedad clínica de los casos.", answer: false },
        { text: "Documentación y oportunidad son indicadores útiles para evaluar el desempeño del sistema.", answer: true }
      ],
      feedbackGood:
        "Correcto. Identificaste la función de la red negativa y el sentido de los indicadores de desempeño.",
      feedbackBad:
        "Revisa la diferencia entre continuidad de vigilancia, oportunidad del reporte y calidad documental."
    }
  },
  {
    id: "m7",
    number: 7,
    title: "Análisis de la información y retroalimentación",
    icon: "🗣️",
    topics: [
      {
        title: "Análisis de la información y difusión en el nivel correspondiente",
        objective:
          "Entender que el análisis forma parte central de la vigilancia epidemiológica y no es una etapa accesoria posterior al registro.",
        visualType: "pie_chart_viz",
        sections: [
          {
            heading: "El análisis como función sustantiva",
            text:
              "En vigilancia epidemiológica, el análisis no es opcional. Su propósito es convertir registros en información útil para comprender qué ocurre, dónde ocurre, a quién afecta y qué acciones deben tomarse."
          },
          {
            heading: "Qué implica analizar la información en TNE",
            text:
              "Analizar significa ir más allá del conteo: identificar daños predominantes, temporadas críticas, patrones territoriales, factores asociados, desenlaces graves y señales operativas de problemas de notificación o documentación."
          },
          {
            heading: "Difusión según el nivel de conducción",
            text:
              "La información debe difundirse y retroalimentarse en el nivel correspondiente, de modo que las unidades, jurisdicciones, niveles estatales y nivel central puedan actuar con base en evidencia."
          }
        ],
        critical:
          "Sin análisis, la vigilancia se reduce a acumulación de datos. Su sentido real está en generar información útil para la acción."
      },
      {
        title: "Retroalimentación sobre el desempeño del sistema",
        objective:
          "Reconocer que el análisis y la retroalimentación permiten mejorar tanto la vigilancia como las acciones preventivas y de control.",
        visualType: "speaker_retro",
        sections: [
          {
            heading: "Retroalimentación entre niveles",
            text:
              "Los hallazgos deben devolverse como observaciones, criterios técnicos, prioridades de acción y recomendaciones correctivas. La retroalimentación no es una sanción, sino un mecanismo para fortalecer el sistema."
          },
          {
            heading: "Identificación de riesgos y priorización",
            text:
              "La información analizada permite identificar riesgos, factores recurrentes, territorios prioritarios y condiciones asociadas con desenlaces graves o evitables. Esto mejora la toma de decisiones."
          },
          {
            heading: "Uso en espacios de conducción",
            text:
              "La información se integra a espacios técnicos y colegiados para orientar acciones preventivas, seguimiento de desempeño y decisiones de conducción sanitaria."
          }
        ]
      }
    ],
    review: {
      type: "multiselect",
      prompt: "Selecciona los usos correctos de la información epidemiológica generada por el sistema.",
      options: [
        { text: "Identificar riesgos y patrones del evento.", correct: true },
        { text: "Orientar acciones preventivas y de control.", correct: true },
        { text: "Limitar la difusión a un solo nivel para evitar cambios operativos.", correct: false },
        { text: "Retroalimentar a los niveles de conducción para mejora del desempeño.", correct: true }
      ],
      feedbackGood:
        "Correcto. El análisis epidemiológico produce información útil para conducción, prevención y mejora del sistema.",
      feedbackBad:
        "Revisa el papel del análisis, la difusión y la retroalimentación como funciones sustantivas de la vigilancia epidemiológica."
    }
  }
];

function shuffleArray(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

function initializeReviewData() {
  const reviewDefs = {};
  const reviewState = {};

  modules.forEach((module) => {
    if (module.review.type === "single" || module.review.type === "multiselect") {
      reviewDefs[module.id] = {
        ...module.review,
        options: shuffleArray(module.review.options)
      };
    } else if (module.review.type === "truefalse") {
      reviewDefs[module.id] = {
        ...module.review,
        items: module.review.items.map((item) => ({
          ...item,
          options: shuffleArray([
            { label: "Verdadero", value: true },
            { label: "Falso", value: false }
          ])
        }))
      };
    }

    if (module.review.type === "single") reviewState[module.id] = { checked: false, selected: null };
    if (module.review.type === "multiselect") reviewState[module.id] = { checked: false, selected: [] };
    if (module.review.type === "truefalse") reviewState[module.id] = { checked: false, answers: {} };
  });

  return { reviewDefs, reviewState };
}

function baseCardStyle(extra) {
  return {
    borderRadius: 8,
    background: COLORS.tarjeta,
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
    border: "none",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    ...extra,
  };
}

function buttonStyle(variant, disabled) {
  const common = {
    borderRadius: 8,
    border: "none",
    padding: "10px 24px",
    fontSize: 14,
    fontWeight: "bold",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    transition: "all 0.3s ease",
  };
  if (variant === "secondary") {
    return {
      ...common,
      background: "white",
      color: COLORS.guinda,
      border: `2px solid ${COLORS.guinda}`,
    };
  }
  if (variant === "admin") {
    return {
      ...common,
      background: COLORS.verdeOscuro,
      color: "white",
    };
  }
  return {
    ...common,
    background: COLORS.guinda,
    color: "white",
  };
}

function Tag({ children, bg = COLORS.beige, color = COLORS.guinda }) {
  return (
    <span
      style={{
        display: "inline-flex",
        borderRadius: 8,
        padding: "6px 12px",
        background: bg,
        color,
        fontSize: 11,
        fontWeight: "bold",
        textTransform: "uppercase"
      }}
    >
      {children}
    </span>
  );
}

function Button({ children, onClick, variant = "primary", disabled = false, style = {} }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...buttonStyle(variant, disabled), ...style }}>
      {children}
    </button>
  );
}

function InstitutionalHeader() {
  return (
    <div style={{ background: COLORS.fondo, padding: "20px 40px", borderBottom: `2px solid ${COLORS.guinda}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <img src={LOGO_SRC} alt="Servicios de Salud IMSS-BIENESTAR" style={{ height: 50, objectFit: "contain" }} />
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 28, fontWeight: 900, color: COLORS.guinda }}>SVEDSTNE</div>
        <div style={{ fontSize: 12, fontWeight: "bold", color: COLORS.texto }}>Vigilancia Epidemiológica de Daños a la Salud<br />por Temperaturas Naturales Extremas</div>
      </div>
    </div>
  );
}

function ScoreRing({ percent }) {
  return (
    <div style={{ width: 220, height: 220, borderRadius: 999, margin: "0 auto", background: `conic-gradient(${COLORS.verde} 0 ${percent}%, #E8E1D6 ${percent}% 100%)`, display: "grid", placeItems: "center" }}>
      <div style={{ width: 170, height: 170, borderRadius: 999, background: "white", display: "grid", placeItems: "center", textAlign: "center", border: `2px solid ${COLORS.beige}` }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: "0.16em", textTransform: "uppercase", color: COLORS.grisOscuro }}>Calificación</div>
          <div style={{ fontSize: 54, lineHeight: 1, fontWeight: 900, color: COLORS.verde }}>{percent}%</div>
          <div style={{ fontSize: 16, color: COLORS.verdeOscuro, fontWeight: 800 }}>{percent >= 80 ? "Excelente" : percent >= 70 ? "Satisfactorio" : "Requiere Repaso"}</div>
        </div>
      </div>
    </div>
  );
}

function QuestionCard({ item, selected, reveal, locked, onSelect, number }) {
  return (
    <div style={baseCardStyle({ padding: 22 })} className="animate-content">
      <div style={{ marginBottom: 10 }}><Tag bg={COLORS.beige}>Pregunta {number}</Tag></div>
      <div style={{ marginBottom: 14, fontSize: 15, lineHeight: 1.7, fontWeight: 800, color: COLORS.verdeOscuro }}>{item.question}</div>
      <div style={{ display: "grid", gap: 10 }}>
        {item.options.map((option, idx) => {
          let background = "white";
          let color = COLORS.verdeOscuro;
          if (selected === idx) { background = COLORS.guinda; color = "white"; }
          if (reveal && idx === item.correct) { background = COLORS.exito; color = COLORS.verdeOscuro; }
          if (reveal && selected === idx && idx !== item.correct) { background = COLORS.error; color = COLORS.guinda; }
          return <button key={option} onClick={() => !locked && onSelect(idx)} disabled={locked} style={{ borderRadius: 8, border: `1px solid ${COLORS.grisOscuro}`, padding: "12px 14px", textAlign: "left", fontSize: 14, fontWeight: 700, background, color, cursor: locked ? "not-allowed" : "pointer", transition: "all 0.2s ease" }}>{option}</button>;
        })}
      </div>
    </div>
  );
}

function SingleReview({ review, state, onSelect, onGrade }) {
  const checked = !!state.checked;
  const selected = state.selected;
  const correctIndex = review.options.findIndex((o) => o.correct);
  const good = selected === correctIndex;
  return (
    <div style={baseCardStyle({ padding: 22, marginTop: 30 })} className="animate-content">
      <div style={{ marginBottom: 10 }}><Tag bg={COLORS.beige}>Actividad de repaso</Tag></div>
      <div style={{ marginBottom: 14, fontSize: 15, lineHeight: 1.7, fontWeight: 800, color: COLORS.verdeOscuro }}>{review.prompt}</div>
      <div style={{ display: "grid", gap: 10 }}>
        {review.options.map((option, idx) => {
          let background = "white";
          let color = COLORS.verdeOscuro;
          if (selected === idx) { background = COLORS.guinda; color = "white"; }
          if (checked && option.correct) { background = COLORS.exito; color = COLORS.verdeOscuro; }
          if (checked && selected === idx && !option.correct) { background = COLORS.error; color = COLORS.guinda; }
          return <button key={option.text} onClick={() => !checked && onSelect(idx)} disabled={checked} style={{ borderRadius: 8, border: `1px solid ${COLORS.grisOscuro}`, padding: "12px 14px", textAlign: "left", fontSize: 14, fontWeight: 700, background, color, cursor: checked ? "not-allowed" : "pointer" }}>{option.text}</button>;
        })}
      </div>
      <div style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <Button variant="secondary" onClick={onGrade} disabled={checked || selected === null || selected === undefined}>Calificar repaso</Button>
        {checked && <span style={{ fontSize: 14, color: COLORS.grisOscuro }}>{good ? review.feedbackGood : review.feedbackBad}</span>}
      </div>
    </div>
  );
}

function MultiSelectReview({ review, state, onToggle, onGrade }) {
  const checked = !!state.checked;
  const selected = Array.isArray(state.selected) ? state.selected : [];
  const correct = review.options.map((o,i)=>o.correct?i:null).filter(v=>v!==null);
  const good = selected.length===correct.length && selected.every(v=>correct.includes(v));
  return (
    <div style={baseCardStyle({ padding: 22, marginTop: 30 })} className="animate-content">
      <div style={{ marginBottom: 10 }}><Tag bg={COLORS.beige}>Actividad de repaso</Tag></div>
      <div style={{ marginBottom: 14, fontSize: 15, lineHeight: 1.7, fontWeight: 800, color: COLORS.verdeOscuro }}>{review.prompt}</div>
      <div style={{ display: "grid", gap: 10 }}>
        {review.options.map((option, idx) => {
          const isSelected = selected.includes(idx);
          let background = "white";
          let color = COLORS.verdeOscuro;
          if (isSelected) { background = COLORS.guinda; color = "white"; }
          if (checked && option.correct) { background = COLORS.exito; color = COLORS.verdeOscuro; }
          if (checked && isSelected && !option.correct) { background = COLORS.error; color = COLORS.guinda; }
          return <button key={option.text} onClick={() => !checked && onToggle(idx)} disabled={checked} style={{ borderRadius: 8, border: `1px solid ${COLORS.grisOscuro}`, padding: "12px 14px", textAlign: "left", fontSize: 14, fontWeight: 700, background, color, cursor: checked ? "not-allowed" : "pointer" }}>{option.text}</button>;
        })}
      </div>
      <div style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <Button variant="secondary" onClick={onGrade} disabled={checked || selected.length===0}>Calificar repaso</Button>
        {checked && <span style={{ fontSize: 14, color: COLORS.grisOscuro }}>{good ? review.feedbackGood : review.feedbackBad}</span>}
      </div>
    </div>
  );
}

function TrueFalseReview({ review, state, onSelect, onGrade }) {
  const checked = !!state.checked;
  const answers = state.answers || {};
  const completed = review.items.every((_, idx) => typeof answers[idx] === "boolean");
  const good = review.items.every((item, idx) => answers[idx] === item.answer);
  return (
    <div style={baseCardStyle({ padding: 22, marginTop: 30 })} className="animate-content">
      <div style={{ marginBottom: 10 }}><Tag bg={COLORS.beige}>Actividad de repaso</Tag></div>
      <div style={{ marginBottom: 14, fontSize: 15, lineHeight: 1.7, fontWeight: 800, color: COLORS.verdeOscuro }}>{review.prompt}</div>
      <div style={{ display: "grid", gap: 12 }}>
        {review.items.map((item, itemIndex) => (
          <div key={item.text} style={{ borderRadius: 8, border: `1px solid ${COLORS.grisOscuro}`, background: "white", padding: 14 }}>
            <div style={{ marginBottom: 10, fontSize: 14, lineHeight: 1.7, fontWeight: 700, color: COLORS.grisOscuro }}>{item.text}</div>
            <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(2,minmax(0,1fr))" }}>
              {item.options.map((option) => {
                const isSelected = answers[itemIndex] === option.value;
                let background = "white";
                let color = COLORS.verdeOscuro;
                if (isSelected) { background = COLORS.guinda; color = "white"; }
                if (checked && option.value === item.answer) { background = COLORS.exito; color = COLORS.verdeOscuro; }
                if (checked && isSelected && option.value !== item.answer) { background = COLORS.error; color = COLORS.guinda; }
                return <button key={option.label} onClick={() => !checked && onSelect(itemIndex, option.value)} disabled={checked} style={{ borderRadius: 8, border: `1px solid ${COLORS.grisOscuro}`, padding: "12px 14px", textAlign: "center", fontSize: 14, fontWeight: 700, background, color, cursor: checked ? "not-allowed" : "pointer" }}>{option.label}</button>;
              })}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <Button variant="secondary" onClick={onGrade} disabled={checked || !completed}>Calificar repaso</Button>
        {checked && <span style={{ fontSize: 14, color: COLORS.grisOscuro }}>{good ? review.feedbackGood : review.feedbackBad}</span>}
      </div>
    </div>
  );
}

function AdminGate({ value, onChange, onClose, onEnter }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "grid", placeItems: "center", padding: 24, zIndex: 1000 }}>
      <div style={{ ...baseCardStyle({ padding: 24 }), width: "100%", maxWidth: 440 }}>
        <Tag bg={COLORS.beige}>Acceso restringido</Tag>
        <h3 style={{ margin: "16px 0 10px", fontSize: 28, fontWeight: 900, color: COLORS.guinda }}>Panel administrativo</h3>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.8, color: COLORS.grisOscuro }}>Ingresa la clave para abrir seguimiento y exportación de resultados.</p>
        <input type="password" value={value} onChange={(e)=>onChange(e.target.value)} placeholder="Clave de acceso" style={{ marginTop: 18, width: "100%", borderRadius: 8, border: `1px solid ${COLORS.grisOscuro}`, padding: "14px 16px", fontSize: 14, outline: "none" }} />
        <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button onClick={onEnter}>Entrar</Button>
        </div>
      </div>
    </div>
  );
}

function getProgressData(screen, moduleIndex, topicIndex) {
  const totalTopics = modules.reduce((acc, module) => acc + module.topics.length, 0);
  if (screen === "welcome") return { percent: 0 };
  if (screen === "register") return { percent: 5 };
  if (screen === "diagnostic") return { percent: 15 };
  if (screen === "route") return { percent: 20 };
  if (screen === "module") {
    let flat = 0;
    for (let i = 0; i < modules.length; i += 1) {
      if (i < moduleIndex) flat += modules[i].topics.length;
    }
    flat += topicIndex + 1;
    return { percent: 20 + Math.round((flat / totalTopics) * 50) };
  }
  if (screen === "final") return { percent: 80 };
  if (screen === "result") return { percent: 90 };
  if (screen === "closing") return { percent: 95 };
  if (screen === "readings") return { percent: 100 };
  if (screen === "admin") return { percent: 100 };
  return { percent: 0 };
}

// Elemento visual limpio (sin descripciones de texto ni objetivos repetidos)
function ContextualVisual({ type }) {
    const commonStyles = {
        borderRadius: 8,
        display: "grid",
        placeItems: "center",
        padding: "15px",
        textAlign: "center",
        background: `linear-gradient(135deg, ${COLORS.exito} 0%, white 100%)`,
        border: `1px solid ${COLORS.beige}`,
        minHeight: 120,
        fontSize: "3rem", // Íconos más grandes para compensar la falta de texto
        letterSpacing: "8px"
    };

    let content;
    switch(type) {
        case 'climate_impact': content = <>☀️🌡️</>; break;
        case 'heat_cold_icons': content = <>🔥🥶</>; break;
        case 'mexico_map_viz': content = <>🇲🇽📈</>; break;
        case 'purpose_infographic': content = <>🎯📊</>; break;
        case 'cycle_diagram': content = <>🔄🔁</>; break;
        case 'normativity_pillar': content = <>⚖️📜</>; break;
        case 'hierarchy_roles': content = <>🧑‍⚕️🏢📡</>; break;
        case 'data_flow_chart': content = <>📲🔁💻</>; break;
        case 'health_impact_grid': content = <>⚠️💡</>; break;
        case 'thermometer_viz': content = <>🌡️</>; break;
        case 'timeline_errors': content = <>⏳</>; break;
        case 'process_checklist': content = <>📋✔️</>; break;
        case 'document_pile': content = <>📄📂</>; break;
        case 'collaboration_handshake': content = <>🤝🌐</>; break;
        case 'zero_value_epid': content = <>0️⃣⚠️</>; break;
        case 'metrics_dashboard': content = <>📊📈</>; break;
        case 'arrows_loop_improvement': content = <>🔄✅</>; break;
        case 'speaker_retro': content = <>📢🔁</>; break;
        case 'pie_chart_viz': content = <>📊</>; break;
        default: content = <>🖼️</>;
    }

    return (
        <div style={{ ...commonStyles }}>
            <div>{content}</div>
        </div>
    );
}

function SectionContent({ type, currentTopic }) {
    const visual = <ContextualVisual type={type} />;

    if(['climate_impact', 'cycle_diagram', 'document_pile', 'arrows_loop_improvement', 'mexico_map_viz'].includes(type)) {
        return (
            <div style={{ display: "grid", gap: 30, gridTemplateColumns: "1fr 280px", alignItems: "start" }}>
                <div style={{ display: "grid", gap: 20 }}>
                    {currentTopic.sections.map((sec, i) => (
                        <div key={i}>
                            <h4 style={{ color: COLORS.guindaClaro, fontSize: 18, marginBottom: 10 }}>{sec.heading}</h4>
                            <p style={{ fontSize: 16, lineHeight: 1.8, color: COLORS.grisOscuro }}>{sec.text}</p>
                        </div>
                    ))}
                </div>
                {visual}
            </div>
        );
    }

    if(type === 'health_impact_grid') {
        const sections = currentTopic.sections;
        return (
            <div style={{ display: "grid", gap: 30, gridTemplateColumns: "1fr 280px", alignItems: "start" }}>
                 <div style={{ display: "grid", gap: 20 }}>
                    <div style={baseCardStyle({ padding: 15, background: `${COLORS.beige}20` })}>
                        <h4 style={{ color: COLORS.guindaClaro, fontSize: 18, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>🌡️ {sections[0].heading}</h4>
                        <p style={{ fontSize: 16, lineHeight: 1.8, color: COLORS.grisOscuro }}>{sections[0].text}</p>
                    </div>
                    <div style={baseCardStyle({ padding: 15, background: `${COLORS.beige}20` })}>
                        <h4 style={{ color: COLORS.guindaClaro, fontSize: 18, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>🥶 {sections[1].heading}</h4>
                        <p style={{ fontSize: 16, lineHeight: 1.8, color: COLORS.grisOscuro }}>{sections[1].text}</p>
                    </div>
                    <div>
                        <h4 style={{ color: COLORS.guindaClaro, fontSize: 18, marginBottom: 10 }}>{sections[2].heading}</h4>
                        <p style={{ fontSize: 16, lineHeight: 1.8, color: COLORS.grisOscuro }}>{sections[2].text}</p>
                    </div>
                </div>
                {visual}
            </div>
        );
    }

    if(type === 'speaker_retro' || type === 'collaboration_handshake' || type === 'hierarchy_roles' || type === 'purpose_infographic') {
        return (
            <div style={{ display: "grid", gap: 30, gridTemplateColumns: "280px 1fr", alignItems: "start" }}>
                {visual}
                <div style={{ display: "grid", gap: 20 }}>
                    {currentTopic.sections.map((sec, i) => (
                        <div key={i}>
                            <h4 style={{ color: COLORS.guindaClaro, fontSize: 18, marginBottom: 10 }}>{sec.heading}</h4>
                            <p style={{ fontSize: 16, lineHeight: 1.8, color: COLORS.grisOscuro }}>{sec.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if(type === 'heat_cold_icons') {
        const sections = currentTopic.sections;
        return (
            <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
                <div style={baseCardStyle({ padding: 20, background: `${COLORS.error}20` })}>
                    <h4 style={{ color: COLORS.guinda, fontSize: 18, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>🔥 {sections[0].heading}</h4>
                    <p style={{ fontSize: 15, lineHeight: 1.8, color: COLORS.grisOscuro }}>{sections[0].text}</p>
                </div>
                <div style={baseCardStyle({ padding: 20, background: `${COLORS.dorado}20` })}>
                    <h4 style={{ color: COLORS.guinda, fontSize: 18, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>🥶 {sections[1].heading}</h4>
                    <p style={{ fontSize: 15, lineHeight: 1.8, color: COLORS.grisOscuro }}>{sections[1].text}</p>
                </div>
                <div style={{ padding: 20 }}>
                    <h4 style={{ color: COLORS.guindaClaro, fontSize: 18, marginBottom: 10 }}>{sections[2].heading}</h4>
                    <p style={{ fontSize: 15, lineHeight: 1.8, color: COLORS.grisOscuro }}>{sections[2].text}</p>
                    {visual}
                </div>
            </div>
        );
    }

    if(type === 'pie_chart_viz') {
        return (
            <div>
                 <div style={{ display: "grid", gap: 20, marginBottom: 30 }}>
                    {currentTopic.sections.map((sec, i) => (
                        <div key={i}>
                            <h4 style={{ color: COLORS.guindaClaro, fontSize: 18, marginBottom: 10 }}>{sec.heading}</h4>
                            <p style={{ fontSize: 16, lineHeight: 1.8, color: COLORS.grisOscuro }}>{sec.text}</p>
                        </div>
                    ))}
                </div>
                {visual}
            </div>
        );
    }

    if(type === 'process_checklist') {
        return (
            <div>
                <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(2, minmax(0, 1fr))", marginBottom: 30 }}>
                    <div style={baseCardStyle({ padding: 20, borderLeft: `4px solid ${COLORS.guinda}`})}>
                        <h4 style={{ color: COLORS.guinda, fontSize: 18, marginBottom: 10 }}>{currentTopic.sections[0].heading}</h4>
                        <p style={{ fontSize: 15, lineHeight: 1.8, color: COLORS.grisOscuro }}>{currentTopic.sections[0].text}</p>
                    </div>
                     <div style={baseCardStyle({ padding: 20, borderLeft: `4px solid ${COLORS.verde}`})}>
                        <h4 style={{ color: COLORS.verdeOscuro, fontSize: 18, marginBottom: 10 }}>{currentTopic.sections[1].heading}</h4>
                        <p style={{ fontSize: 15, lineHeight: 1.8, color: COLORS.grisOscuro }}>{currentTopic.sections[1].text}</p>
                    </div>
                </div>
                <div style={{ display: "grid", gap: 30, gridTemplateColumns: "1fr 280px", alignItems: "start" }}>
                    <div>
                        <h4 style={{ color: COLORS.guindaClaro, fontSize: 18, marginBottom: 10 }}>{currentTopic.sections[2].heading}</h4>
                        <p style={{ fontSize: 16, lineHeight: 1.8, color: COLORS.grisOscuro }}>{currentTopic.sections[2].text}</p>
                    </div>
                    {visual}
                </div>
            </div>
        );
    }

    return (
        <div>
            {visual}
             <div style={{ display: "grid", gap: 20, marginTop: 30 }}>
                {currentTopic.sections.map((sec, i) => (
                    <div key={i}>
                        <h4 style={{ color: COLORS.guindaClaro, fontSize: 18, marginBottom: 10 }}>{sec.heading}</h4>
                        <p style={{ fontSize: 16, lineHeight: 1.8, color: COLORS.grisOscuro }}>{sec.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function App() {
  const initialized = useMemo(() => initializeReviewData(), []);
  const [screen, setScreen] = useState("welcome");
  const [participant, setParticipant] = useState({ nombre: "", apellido: "", coordinacion: "", cargo: "" });
  const [diagnosticAnswers, setDiagnosticAnswers] = useState({});
  const [diagnosticLocked, setDiagnosticLocked] = useState(false);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [reviewDefs] = useState(initialized.reviewDefs);
  const [reviewState, setReviewState] = useState(initialized.reviewState);
  const [finalAnswers, setFinalAnswers] = useState({});
  const [finalLocked, setFinalLocked] = useState(false);
  const [records, setRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [recordsError, setRecordsError] = useState("");
  const [savedRecordId, setSavedRecordId] = useState(null);
  const [savingRecord, setSavingRecord] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminCode, setAdminCode] = useState("");

  useEffect(() => {
    loadRecordsFromServer();
  }, []);

  const currentModule = modules[currentModuleIndex];
  const currentTopic = currentModule ? currentModule.topics[currentTopicIndex] : null;
  const currentReview = currentModule ? reviewDefs[currentModule.id] : null;
  const currentReviewState = currentModule ? reviewState[currentModule.id] : null;
  const progress = getProgressData(screen, currentModuleIndex, currentTopicIndex);

  const diagnosticScore = useMemo(() => diagnosticQuestions.reduce((acc, q) => acc + (diagnosticAnswers[q.id] === q.correct ? 1 : 0), 0), [diagnosticAnswers]);
  const diagnosticComplete = Object.keys(diagnosticAnswers).length === diagnosticQuestions.length;
  const finalScore = useMemo(() => finalQuestions.reduce((acc, q) => acc + (finalAnswers[q.id] === q.correct ? 1 : 0), 0), [finalAnswers]);
  const finalComplete = Object.keys(finalAnswers).length === finalQuestions.length;
  const finalPercent = Math.round((finalScore / finalQuestions.length) * 100) || 0;

  async function loadRecordsFromServer() {
    setRecordsLoading(true);
    setRecordsError("");

    try {
      const response = await fetch(RESULTS_API_PATH, { cache: "no-store" });

      if (!response.ok) {
        throw new Error("No se pudieron cargar los resultados del servidor.");
      }

      const data = await response.json();
      const normalized = Array.isArray(data) ? data : [];
      setRecords(normalized);

      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      } catch {
        // El respaldo local es opcional; si falla, la consulta en Azure sigue siendo la fuente principal.
      }
    } catch (error) {
      console.error("Error al cargar resultados desde Azure:", error);
      setRecordsError("No se pudieron cargar los resultados desde Azure. Se muestra el respaldo local disponible.");

      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          setRecords(JSON.parse(raw));
        } else {
          setRecords([]);
        }
      } catch {
        setRecords([]);
      }
    } finally {
      setRecordsLoading(false);
    }
  }

  function cacheRecordLocally(item) {
    setRecords((previousRecords) => {
      const updated = [item, ...previousRecords.filter((record) => record.id !== item.id)];

      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Si el navegador bloquea localStorage, Azure sigue conservando el registro principal.
      }

      return updated;
    });
  }

  async function saveRecordIfNeeded() {
    if (savedRecordId || savingRecord) return;

    setSavingRecord(true);
    setSaveError("");

    const now = new Date();
    const modulesReviewed = Object.values(reviewState).filter((item) => item.checked).length;
    const localId = String(now.getTime());
    const fullName = `${participant.nombre} ${participant.apellido}`.trim();

    const item = {
      id: localId,
      fechaEnvio: now.toISOString(),
      date: now.toLocaleString("es-MX"),
      nombre: fullName,
      name: participant.nombre,
      apellido: participant.apellido,
      correo: "",
      entidad: participant.coordinacion,
      unidad: "",
      coordinacion: participant.coordinacion,
      cargo: participant.cargo,
      diagnosticScore,
      diagnosticTotal: diagnosticQuestions.length,
      modulesReviewed,
      reviewedTopics: modulesReviewed,
      score: finalScore,
      totalQuestions: finalQuestions.length,
      percent: finalPercent
    };

    try {
      const response = await fetch(RESULTS_API_PATH, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(item)
      });

      if (!response.ok) {
        throw new Error("No se pudo guardar el resultado en Azure.");
      }

      const result = await response.json();
      const savedItem = { ...item, id: result.id || item.id };
      cacheRecordLocally(savedItem);
      setSavedRecordId(savedItem.id);
    } catch (error) {
      console.error("Error al guardar resultado en Azure:", error);
      cacheRecordLocally(item);
      setSavedRecordId(item.id);
      setSaveError("El resultado se guardó localmente como respaldo, pero no pudo enviarse a Azure. Revisa la conexión antes del cierre del pilotaje.");
    } finally {
      setSavingRecord(false);
    }
  }

  function goToNextTopic() {
    window.scrollTo(0, 0);
    if (currentTopicIndex < currentModule.topics.length - 1) {
      setCurrentTopicIndex(currentTopicIndex + 1);
      return;
    }
    if (currentModuleIndex < modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
      setCurrentTopicIndex(0);
      return;
    }
    setScreen("final");
  }

  function goToPreviousTopic() {
    window.scrollTo(0, 0);
    if (currentTopicIndex > 0) {
      setCurrentTopicIndex(currentTopicIndex - 1);
      return;
    }
    if (currentModuleIndex > 0) {
      const prev = currentModuleIndex - 1;
      setCurrentModuleIndex(prev);
      setCurrentTopicIndex(modules[prev].topics.length - 1);
      return;
    }
    setScreen("route");
  }

  function renderReview() {
    if (!currentReview || !currentReviewState) return null;
    if (currentReview.type === "single") {
      return <SingleReview review={currentReview} state={currentReviewState} onSelect={(value) => !currentReviewState.checked && setReviewState({ ...reviewState, [currentModule.id]: { ...currentReviewState, selected: value } })} onGrade={() => setReviewState({ ...reviewState, [currentModule.id]: { ...currentReviewState, checked: true } })} />;
    }
    if (currentReview.type === "multiselect") {
      return <MultiSelectReview review={currentReview} state={currentReviewState} onToggle={(value) => {
        if (currentReviewState.checked) return;
        const exists = currentReviewState.selected.includes(value);
        const selected = exists ? currentReviewState.selected.filter((item) => item !== value) : [...currentReviewState.selected, value];
        setReviewState({ ...reviewState, [currentModule.id]: { ...currentReviewState, selected } });
      }} onGrade={() => setReviewState({ ...reviewState, [currentModule.id]: { ...currentReviewState, checked: true } })} />;
    }
    return <TrueFalseReview review={currentReview} state={currentReviewState} onSelect={(itemIndex, value) => {
      if (currentReviewState.checked) return;
      setReviewState({ ...reviewState, [currentModule.id]: { ...currentReviewState, answers: { ...currentReviewState.answers, [itemIndex]: value } } });
    }} onGrade={() => setReviewState({ ...reviewState, [currentModule.id]: { ...currentReviewState, checked: true } })} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: COLORS.fondo, fontFamily: "Inter, Noto Sans, Arial, sans-serif" }}>
      <style>{GLOBAL_STYLE}</style>

      <InstitutionalHeader />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
        {screen !== "admin" && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }} className="animate-content">
            <button
              onClick={() => setAdminOpen(true)}
              style={{
                background: "transparent",
                border: 0,
                color: COLORS.grisOscuro,
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                textDecoration: "underline",
                cursor: "pointer"
              }}
            >
              Acceso administrativo
            </button>
          </div>
        )}
        
        {screen === "welcome" && (
          <div style={{ maxWidth: 800, margin: "0 auto", ...baseCardStyle({ padding: 40 }) }} className="animate-content">
            <h1 style={{ color: COLORS.guinda, fontSize: 32, fontWeight: 900, marginBottom: 10 }}>{welcomeText.title}</h1>
            <h2 style={{ color: COLORS.verdeOscuro, fontSize: 18, marginBottom: 30 }}>{welcomeText.subtitle}</h2>
            {welcomeText.paragraphs.map((p, i) => <p key={i} style={{ fontSize: 16, lineHeight: 1.8, color: COLORS.texto, marginBottom: 20 }}>{p}</p>)}
            <div style={{ marginTop: 40, textAlign: "right" }}>
              <Button onClick={() => setScreen("register")}>Siguiente: Registro</Button>
            </div>
          </div>
        )}

        {screen === "register" && (
          <div style={{ maxWidth: 600, margin: "0 auto", ...baseCardStyle({ padding: 40 }) }} className="animate-content">
            <h2 style={{ color: COLORS.guinda, fontSize: 24, fontWeight: 900, marginBottom: 30 }}>Registro de participante</h2>
            <div style={{ display: "grid", gap: 20 }}>
              <div>
                <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: "bold", color: COLORS.verdeOscuro }}>Nombre(s)</label>
                <input value={participant.nombre} onChange={(e) => setParticipant({...participant, nombre: e.target.value})} style={{ width: "100%", padding: 12, borderRadius: 8, border: `1px solid ${COLORS.gris}` }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: "bold", color: COLORS.verdeOscuro }}>Apellidos</label>
                <input value={participant.apellido} onChange={(e) => setParticipant({...participant, apellido: e.target.value})} style={{ width: "100%", padding: 12, borderRadius: 8, border: `1px solid ${COLORS.gris}` }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: "bold", color: COLORS.verdeOscuro }}>Coordinación Estatal</label>
                <input value={participant.coordinacion} onChange={(e) => setParticipant({...participant, coordinacion: e.target.value})} style={{ width: "100%", padding: 12, borderRadius: 8, border: `1px solid ${COLORS.gris}` }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: "bold", color: COLORS.verdeOscuro }}>Cargo o función</label>
                <input value={participant.cargo} onChange={(e) => setParticipant({...participant, cargo: e.target.value})} style={{ width: "100%", padding: 12, borderRadius: 8, border: `1px solid ${COLORS.gris}` }} />
              </div>
            </div>
            <div style={{ marginTop: 40, display: "flex", justifyContent: "space-between" }}>
              <Button variant="secondary" onClick={() => setScreen("welcome")}>Atrás</Button>
              <Button disabled={!participant.nombre || !participant.apellido || !participant.coordinacion || !participant.cargo} onClick={() => setScreen("diagnostic")}>Iniciar evaluación diagnóstica</Button>
            </div>
          </div>
        )}

        {screen === "diagnostic" && (
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <h2 style={{ color: COLORS.guinda, fontSize: 28, fontWeight: 900, marginBottom: 20 }}>Evaluación diagnóstica</h2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: COLORS.grisOscuro, marginBottom: 30 }}>Responde las siguientes preguntas para evaluar tus conocimientos previos. No te preocupes por la calificación en esta etapa.</p>
            <div style={{ display: "grid", gap: 20 }}>
              {diagnosticQuestions.map((q, i) => (
                <QuestionCard 
                  key={q.id} 
                  item={q} 
                  number={i + 1} 
                  selected={diagnosticAnswers[q.id]} 
                  onSelect={(val) => setDiagnosticAnswers({...diagnosticAnswers, [q.id]: val})} 
                  locked={diagnosticLocked} 
                  reveal={diagnosticLocked} 
                />
              ))}
            </div>
            <div style={{ marginTop: 40, padding: 20, background: "white", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }} className="animate-content">
              {!diagnosticLocked ? (
                <Button disabled={!diagnosticComplete} onClick={() => setDiagnosticLocked(true)}>Calificar diagnóstico</Button>
              ) : (
                <>
                  <div style={{ fontSize: 16, fontWeight: "bold", color: COLORS.verdeOscuro }}>Tu puntuación: {diagnosticScore} / {diagnosticQuestions.length}</div>
                  <Button onClick={() => setScreen("route")}>Ir a Módulos de Capacitación</Button>
                </>
              )}
            </div>
          </div>
        )}

        {screen === "route" && (
          <div>
            <h1 style={{ color: COLORS.guinda, fontSize: 32, fontWeight: 900, marginBottom: 10 }}>Módulos de Capacitación</h1>
            <p style={{ fontSize: 14, color: COLORS.verdeOscuro, marginBottom: 30, maxWidth: 800 }}>
              El curso es autoguiado. Encontrarás contenido que representa la base para el seguimiento oportuno de riesgos en poblaciones vulnerables por temperaturas naturales extremas.
            </p>
            
            <div style={{ display: "flex", gap: 30, alignItems: "flex-start", flexWrap: "wrap" }} className="animate-content">
              <div style={{ flex: "1 1 60%", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
                {modules.map((module, idx) => {
                  const icon = module.icon || "📘";

                  return (
                    <div key={module.id} style={baseCardStyle({ padding: 20, display: "flex", flexDirection: "column" })}>
                      <div style={{ display: "flex", gap: 15, marginBottom: 15, alignItems: "center" }}>
                        <div style={{ fontSize: 40 }}>{icon}</div>
                        <h3 style={{ margin: 0, fontSize: 16, color: COLORS.guinda, fontWeight: 900, lineHeight: 1.2 }}>
                          Módulo {module.number}: {module.title}
                        </h3>
                      </div>
                      <p style={{ fontSize: 12, color: COLORS.verdeOscuro, marginBottom: 20, flex: 1 }}>
                        {module.topics[0]?.title.substring(0, 80)}...
                      </p>
                      <div style={{ textAlign: "center" }}>
                        <Button 
                          onClick={() => { setCurrentModuleIndex(idx); setCurrentTopicIndex(0); setScreen("module"); }}
                          style={{ background: COLORS.verde, width: "160px", padding: "10px", fontSize: 13 }}
                        >
                          Ver Módulo
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ flex: "0 0 300px", background: COLORS.fondo, position: "sticky", top: 20 }}>
                <h3 style={{ margin: "0 0 15px", fontSize: 18, color: COLORS.verdeOscuro, fontWeight: 900 }}>Mi Progreso</h3>
                <div style={{ display: "flex", gap: 15, marginBottom: 20 }}>
                  <div style={{ width: 6, background: COLORS.guinda, borderRadius: 3 }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 10, background: "white", borderRadius: 5, overflow: "hidden", marginBottom: 8 }}>
                      <div style={{ width: `${progress.percent}%`, height: "100%", background: COLORS.verde }}></div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: "bold", color: COLORS.verdeOscuro }}>{progress.percent}% Completado</div>
                  </div>
                </div>

                <div style={{ fontSize: 14, fontWeight: "bold", color: COLORS.verdeOscuro, marginBottom: 10 }}>Secciones completadas:</div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px", fontSize: 13, color: COLORS.texto, lineHeight: 1.8 }}>
                  {diagnosticLocked ? <li>✓ Pre-test de Evaluación</li> : <li style={{ color: COLORS.grisOscuro }}>Pre-test de Evaluación</li>}
                  {modules.map((m, i) => {
                    const color = i <= currentModuleIndex ? COLORS.texto : COLORS.grisOscuro;
                    return <li key={i} style={{ color }}>{i < currentModuleIndex && "✓ "}Módulo {m.number} {i === currentModuleIndex && "(En Curso)"}</li>;
                  })}
                  {finalLocked ? <li>✓ Post-test de Evaluación</li> : <li style={{ color: COLORS.grisOscuro }}>Post-test de Evaluación</li>}
                  {screen === "readings" || screen === "closing" ? <li>✓ Cierre y Lecturas</li> : <li style={{ color: COLORS.grisOscuro }}>Cierre y Lecturas</li>}
                </ul>
                
                {finalLocked && <Button onClick={() => setScreen("readings")} style={{ width: "100%", background: COLORS.guinda }}>Ir al Cierre</Button>}
              </div>
            </div>
          </div>
        )}

        {screen === "module" && currentModule && currentTopic && (
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }} className="animate-content">
              <Tag bg={COLORS.guindaClaro} color="white">Módulo {currentModule.number}</Tag>
              <Button variant="secondary" onClick={() => setScreen("route")}>Volver a Módulos</Button>
            </div>
            <h2 style={{ color: COLORS.guinda, fontSize: 32, fontWeight: 900, marginBottom: 10 }} className="animate-content">{currentModule.title}</h2>
            
            <div style={baseCardStyle({ padding: 30, marginTop: 20 })} className="animate-content">
              <h3 style={{ color: COLORS.verdeOscuro, fontSize: 24, fontWeight: 900, marginBottom: 15 }}>{currentTopic.title}</h3>
              
              {currentTopic.objective && (
                <div style={{ background: COLORS.beige, padding: 15, borderRadius: 8, marginBottom: 30, borderLeft: `2px solid ${COLORS.guindaClaro}` }}>
                  <strong style={{ color: COLORS.guinda }}>Objetivo:</strong> {currentTopic.objective}
                </div>
              )}

              <SectionContent type={currentTopic.visualType} currentTopic={currentTopic} />
            </div>

            {currentTopicIndex === currentModule.topics.length - 1 && renderReview()}

            <div style={{ marginTop: 40, display: "flex", justifyContent: "space-between" }} className="animate-content">
              <Button variant="secondary" onClick={goToPreviousTopic}>Atrás</Button>
              <Button onClick={goToNextTopic}>{currentTopicIndex === currentModule.topics.length - 1 && currentModuleIndex === modules.length - 1 ? "Ir a Evaluación Final" : "Siguiente"}</Button>
            </div>
          </div>
        )}

        {screen === "final" && (
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <h2 style={{ color: COLORS.guinda, fontSize: 28, fontWeight: 900, marginBottom: 20 }}>Evaluación Final</h2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: COLORS.grisOscuro, marginBottom: 30 }}>Responde las preguntas para concluir la capacitación y guardar tus resultados.</p>
            <div style={{ display: "grid", gap: 20 }}>
              {finalQuestions.map((q, i) => (
                <QuestionCard 
                  key={q.id} 
                  item={q} 
                  number={i + 1} 
                  selected={finalAnswers[q.id]} 
                  onSelect={(val) => setFinalAnswers({...finalAnswers, [q.id]: val})} 
                  locked={finalLocked} 
                  reveal={finalLocked} 
                />
              ))}
            </div>
            <div style={{ marginTop: 40, padding: 20, background: "white", borderRadius: 8, display: "flex", justifyContent: "flex-end" }} className="animate-content">
              <Button disabled={!finalComplete || finalLocked} onClick={() => { setFinalLocked(true); setScreen("result"); }}>Finalizar Curso</Button>
            </div>
          </div>
        )}

        {screen === "result" && (
          <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", ...baseCardStyle({ padding: 50 }) }} className="animate-content">
            <h2 style={{ color: COLORS.guinda, fontSize: 32, fontWeight: 900, marginBottom: 30 }}>Resultado de tu Evaluación</h2>
            <ScoreRing percent={finalPercent} />
            <p style={{ fontSize: 18, marginTop: 30, color: COLORS.texto }}>
              Obtuviste {finalScore} de {finalQuestions.length} respuestas correctas.
            </p>
            {saveError && (
              <p style={{ fontSize: 13, marginTop: 20, color: COLORS.guinda, lineHeight: 1.6 }}>
                {saveError}
              </p>
            )}
            <div style={{ marginTop: 40 }}>
              <Button
                disabled={savingRecord}
                onClick={async () => {
                  await saveRecordIfNeeded();
                  setScreen("closing");
                }}
              >
                {savingRecord ? "Guardando resultado..." : "Continuar"}
              </Button>
            </div>
          </div>
        )}

        {screen === "closing" && (
          <div style={{ maxWidth: 800, margin: "0 auto", ...baseCardStyle({ padding: 40 }) }} className="animate-content">
            <h1 style={{ color: COLORS.guinda, fontSize: 32, fontWeight: 900, marginBottom: 20 }}>{closingText.title}</h1>
            {closingText.paragraphs.map((p, i) => <p key={i} style={{ fontSize: 16, lineHeight: 1.8, color: COLORS.texto, marginBottom: 20 }}>{p}</p>)}
            <div style={{ marginTop: 40, textAlign: "right" }}>
              <Button onClick={() => setScreen("readings")}>Ver Lecturas Recomendadas</Button>
            </div>
          </div>
        )}

        {screen === "readings" && (
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <h2 style={{ color: COLORS.guinda, fontSize: 28, fontWeight: 900, marginBottom: 20 }}>Lecturas Recomendadas</h2>
            <div style={{ display: "grid", gap: 20 }} className="animate-content">
              {recommendedReadings.map((r, i) => (
                <div key={i} style={baseCardStyle({ padding: 20 })}>
                  <Tag bg={COLORS.beige}>{r.category}</Tag>
                  <h3 style={{ color: COLORS.verdeOscuro, fontSize: 18, marginTop: 10, marginBottom: 10 }}>{r.title}</h3>
                  <p style={{ fontSize: 14, color: COLORS.texto, marginBottom: 15 }}>{r.description}</p>
                  <a href={r.url} target="_blank" rel="noreferrer" style={{ ...buttonStyle("primary", false), textDecoration: "none", display: "inline-block" }}>{r.label}</a>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: 40, textAlign: "center", display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }} className="animate-content">
              <Button variant="secondary" onClick={() => setScreen("welcome")}>Volver al Inicio</Button>
              <button onClick={() => setAdminOpen(true)} style={{ background: "transparent", border: 0, color: COLORS.grisOscuro, fontSize: 12, fontWeight: 900, letterSpacing: "0.16em", textTransform: "uppercase", textDecoration: "underline", cursor: "pointer", marginTop: 20 }}>
                Acceso administrativo
              </button>
            </div>
          </div>
        )}

        {screen === "admin" && adminUnlocked && (
          <div style={{ maxWidth: 1100, margin: "0 auto", ...baseCardStyle({ padding: 40 }) }} className="animate-content">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 30 }}>
              <div>
                <h2 style={{ color: COLORS.guinda, fontSize: 28, fontWeight: 900, margin: 0 }}>Panel Administrativo</h2>
                <p style={{ margin: "8px 0 0", fontSize: 13, color: COLORS.grisOscuro }}>
                  Resultados consolidados desde Azure. Disponibles para consulta desde cualquier dispositivo.
                </p>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
                <Button variant="secondary" onClick={() => loadRecordsFromServer()} disabled={recordsLoading}>
                  {recordsLoading ? "Actualizando..." : "Actualizar"}
                </Button>
                <Button onClick={() => window.open(RESULTS_CSV_PATH, "_blank")}>Descargar CSV</Button>
                <Button variant="secondary" onClick={() => setScreen("welcome")}>Salir del Panel</Button>
              </div>
            </div>

            {recordsError && (
              <div style={{ marginBottom: 18, padding: 12, borderRadius: 8, background: COLORS.error, color: COLORS.guinda, fontSize: 13, lineHeight: 1.6 }}>
                {recordsError}
              </div>
            )}
            
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, textAlign: "left" }}>
                <thead>
                  <tr style={{ background: COLORS.beige, color: COLORS.guinda }}>
                    <th style={{ padding: 12 }}>Fecha</th>
                    <th style={{ padding: 12 }}>Nombre</th>
                    <th style={{ padding: 12 }}>Coordinación / Entidad</th>
                    <th style={{ padding: 12 }}>Cargo</th>
                    <th style={{ padding: 12 }}>Diagnóstico</th>
                    <th style={{ padding: 12 }}>Módulos</th>
                    <th style={{ padding: 12 }}>Final</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r, i) => {
                    const fecha = r.fechaEnvio ? new Date(r.fechaEnvio).toLocaleString("es-MX") : (r.date || "");
                    const nombre = r.nombre || `${r.name || ""} ${r.apellido || ""}`.trim();
                    const area = r.entidad || r.coordinacion || "";
                    const modulesReviewed = r.modulesReviewed ?? r.reviewedTopics ?? "";

                    return (
                      <tr key={r.id || i} style={{ borderBottom: `1px solid ${COLORS.gris}` }}>
                        <td style={{ padding: 12 }}>{fecha}</td>
                        <td style={{ padding: 12 }}>{nombre || "Sin nombre"}</td>
                        <td style={{ padding: 12 }}>{area || "No especificado"}</td>
                        <td style={{ padding: 12 }}>{r.cargo || "No especificado"}</td>
                        <td style={{ padding: 12 }}>{r.diagnosticScore}/{r.diagnosticTotal}</td>
                        <td style={{ padding: 12 }}>{modulesReviewed}</td>
                        <td style={{ padding: 12, fontWeight: 800 }}>{r.percent}%</td>
                      </tr>
                    );
                  })}
                  {records.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ padding: 20, textAlign: "center", color: COLORS.grisOscuro }}>
                        {recordsLoading ? "Cargando resultados..." : "No hay registros guardados aún."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {adminOpen && (
        <AdminGate 
          value={adminCode} 
          onChange={setAdminCode} 
          onClose={() => setAdminOpen(false)} 
          onEnter={() => {
            if (adminCode === ADMIN_CODE) {
              setAdminUnlocked(true);
              setAdminOpen(false);
              setScreen("admin");
            } else {
              alert("Código incorrecto");
            }
          }} 
        />
      )}
    </div>
  );
}