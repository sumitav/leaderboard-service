module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir:'src',
    coverageDirectory: '../coverage',
    collectCoverageFrom: ['**/*.{t|j)s'],
    verbose: true,
    moduleFileExtensions: ['ts', 'js', 'json'],
    testMatch: ['**/test/**/*.spec.ts'],
    transform: {
        '^.+\\.tsx?$': ['ts-jest',{isolatedModules: true}],
    },
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json',
        },
    },
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
    },
};