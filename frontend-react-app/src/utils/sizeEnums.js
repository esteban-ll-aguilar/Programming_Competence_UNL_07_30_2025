// src/utils/sizeEnums.js

// Size concepts enum to match the backend's SizeConcept enum
export const SizeConcept = {
  LARGE: "LARGE",
  MEDIUM: "MEDIUM",
  SMALL: "SMALL"
};

// Human-readable labels for the size concepts
export const SizeConceptLabels = {
  [SizeConcept.LARGE]: "Grande",
  [SizeConcept.MEDIUM]: "Mediano",
  [SizeConcept.SMALL]: "Pequeño"
};

// Function to get the label for a size concept
export const getSizeLabel = (sizeKey) => {
  return SizeConceptLabels[sizeKey] || sizeKey;
};
