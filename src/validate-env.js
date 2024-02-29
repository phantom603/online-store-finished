export const validateEnv = () => {
  const config = window[Symbol.for("app-config")];

  for (const [key, value] of Object.entries(config)) {
    if (!value) {
      throw new Error(`Env variable ${key} must be defined`);
    }
  }
};
