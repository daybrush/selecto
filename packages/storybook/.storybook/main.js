const path = require("path");

module.exports = {
    typescript: {
        reactDocgen: "react-docgen-typescript",
        reactDocgenTypescriptOptions: {
            shouldExtractLiteralValuesFromEnum: true,
            propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
        },
    },
    webpackFinal: config => {
        config.module.rules.push({
            test: /\.(ts|tsx)$/,
            loader: 'ts-loader',
            options: {
                // disable type checker - we will use it in fork plugin
                transpileOnly: true
            },
        });
        config.resolve.alias["@/stories"] = path.resolve(__dirname, "../stories");
        config.resolve.alias["react-selecto"] = path.resolve(__dirname, "../../react-selecto/src/react-selecto");
        // config.plugins.push(new ForkTsCheckerWebpackPlugin());
        // config.resolve.alias["@/stories"] = path.resolve(__dirname, "../stories");
        // config.resolve.alias["moveable-helper"] = path.resolve(__dirname, "../stories/moveable-helper");
        // config.resolve.alias["@/react-moveable"] = path.resolve(__dirname, "../src/react-moveable");
        return config;
    },
    stories: [
        "../stories/**/*.stories.@(js|jsx|ts|tsx)"
    ],
    addons: [
        "@storybook/addon-google-analytics",
        "@storybook/addon-docs/register",
        "@storybook/addon-controls/register",
        "@storybook/addon-viewport/register",
        "storybook-addon-preview/register",
        "storybook-dark-mode/register",
    ],
};
