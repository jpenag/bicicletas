const createProxyMiddleware = require('http-proxy-middleware');

const portApi = process.env.PORT_API || 5000;
const portApiGeo = process.env.PORT_APIGEO || 5001;

const serverNameApi = process.env.SERV_API || "localhost";
const serverNameApiGeo = process.env.SERV_APIGEO || "localhost";

module.exports = function (app) {
    app.use(createProxyMiddleware('/apiGeo', { target: 'http://' + serverNameApiGeo + ':' + portApiGeo }));
    app.use(createProxyMiddleware('/api', { target: 'http://' + serverNameApi + ':' + portApi }));
}