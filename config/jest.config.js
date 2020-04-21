const project = require('./project.config');
const path = require('path');

const jestConfig = {
    rootDir: path.join(__dirname, '..'),
    displayName: project.server.templateLocals.title,
    testEnvironment: 'jsdom',
    testURL: 'http://localhost',
    roots: [
        "<rootDir>",
        "./"
    ],
    modulePaths: [
        "<rootDir>",
        "./"
    ],
    moduleDirectories: [
        "node_modules"
    ],
    setupFilesAfterEnv: [
        './client/setupTests.ts'
    ],
    moduleNameMapper: {
        '.(png|jpg|svg)$': "<rootDir>/tools/fileMock.js",
        '^.+\\.(css|less|scss)$': 'babel-jest'
    },
    modulePathIgnorePatterns: ['setupTests.ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
        '^.+\\.(js|jsx)?$': 'babel-jest'
    },
    collectCoverage: true,
    testRegex: '\\.spec\\.(ts|tsx)$',
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
        'node'
    ]
};

module.exports = jestConfig;
