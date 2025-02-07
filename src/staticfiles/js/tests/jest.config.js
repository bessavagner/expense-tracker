module.exports = {
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^./DOM.js$": "../modules/engine/DOM.js",
    "^./core.js$": "../modules/engine/core.js",
    "^./events.js$": "../modules/engine/events.js",
  },
  preset: "ts-jest",
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
};
