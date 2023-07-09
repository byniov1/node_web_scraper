module.exports = {
    transform: {
        '^.+\\.js$': 'babel-jest'
    },
    testPathIgnorePatterns: [
        '/node_modules/',
        '/app/',
    ],
};