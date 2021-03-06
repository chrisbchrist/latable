module.exports = ({ config, mode }) => {
    config.module.rules.push({
        test: /\.(ts|tsx)$/,
        // loader: require.resolve('babel-loader'),
        loaders: [
            {
                loader: require.resolve('babel-loader'),
                options: {presets: [['react-app', { flow: false, typescript: true }]]}
            },
            {
                loader: require.resolve('@storybook/addon-storysource/loader'),
                options: { parser: 'typescript' }
            }],
    });
    config.resolve.extensions.push('.ts', '.tsx');
    // Forces Webpack to ignore Node-only package required by Excel libraries
    config.node = { fs: 'empty'};
    return config;
};