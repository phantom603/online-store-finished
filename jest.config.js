module.exports = {
  verbose: true,
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./jest-setup-files-after-env.js"],
  modulePathIgnorePatterns: [".*__mocks__.*"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|scss|less)$": "identity-obj-proxy",
    "\\.\\.pages(.*)$": "<rootDir>/src/pages/$1",
  },
};
