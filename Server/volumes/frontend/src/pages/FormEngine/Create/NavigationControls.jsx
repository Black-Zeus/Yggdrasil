import React from "react";

const NavigationControls = ({
  currentTab,
  handlePrevious,
  handleNext,
  handleCancel,
  publishEvaluation,
}) => {
  const getCurrentStep = () => {
    switch (currentTab) {
      case "información":
        return 1;
      case "preguntas":
        return 2;
      case "vistaPrevia":
        return 3;
      default:
        return 1;
    }
  };

  const step = getCurrentStep();
  const isFirstStep = step === 1;
  const isLastStep = step === 3;

  const stepLabels = {
    información: "Información",
    preguntas: "Preguntas",
    vistaPrevia: "Vista Previa",
  };

  return (
    <div className="flex justify-between items-center mt-8 flex-wrap gap-4">
      {/* Botones de navegación alineados a la izquierda */}
      <div className="flex gap-4 flex-wrap">
        {!isFirstStep && (
          <button
            onClick={handlePrevious}
            className="bg-secondary text-text-light px-5 py-2 rounded-md font-semibold hover:bg-secondary-light transition-colors"
          >
            Atrás
          </button>
        )}

        <button
          onClick={handleCancel}
          className="bg-secondary text-text-light px-5 py-2 rounded-md font-semibold hover:bg-secondary-light transition-colors"
        >
          Cancelar
        </button>

        {!isLastStep ? (
          <button
            onClick={handleNext}
            className="bg-primary text-white px-5 py-2 rounded-md font-semibold hover:bg-primary-dark transition-colors"
          >
            Siguiente →
          </button>
        ) : (
          <button
            onClick={publishEvaluation}
            className="bg-success text-white px-5 py-2 rounded-md font-semibold flex items-center gap-2 hover:bg-success-dark transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            Publicar Evaluación
          </button>
        )}
      </div>

      {/* Barra de progreso alineada a la derecha */}
      <div className="flex flex-col items-end">
        <div className="w-48 h-2 bg-secondary rounded-full overflow-hidden mb-1">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
        <span className="text-sm text-text-muted">
          Paso {step} de 3: {stepLabels[currentTab] || ""}
        </span>
      </div>
    </div>
  );
};

export default NavigationControls;
