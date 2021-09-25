//this code helps pull the changes in our files automatically in dockerrized deployments
module.exports = {
    webpackDevMiddleware: config => {
        config.watchOptions.poll = 300;
        return config;
    }
}