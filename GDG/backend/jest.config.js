export const preset = 'ts-jest';
export const testEnvironment = 'node';
export const roots = ['<rootDir>/src'];
export const testMatch = ['**/*.test.ts'];
export const transform = {
    '^.+\\.tsx?$': 'ts-jest'
};
export const moduleFileExtensions = ['ts', 'tsx', 'js', 'jsx', 'json', 'node'];
export const setupFiles = ['dotenv/config'];
