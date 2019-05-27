const restify = require('restify'),
  config = require('config'),
  corsMiddleware = require('restify-cors-middleware'),
  authorization = require('dbf-congnitoauthorizer'),
  workspaceAccessCheck = require('./middlewares/workspaceAccessChecker');

const AppConnectionsCtrl = require('./controllers/appConnections'),
  AppModulesCtrl = require('./controllers/appModules');

const MongooseConnection = new require('dbf-dbmodels/MongoConnection');
let connection = new MongooseConnection();

const server = restify.createServer({
  name: "App Engine",
  version: config.Host.version
}, function (req, res) {

});

const cors = corsMiddleware({
  allowHeaders: ['authorization', 'companyInfo']
});

server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.queryParser({
  mapParams: true
}));
server.use(restify.plugins.bodyParser({
  mapParams: true
}));

process.on('uncaughtException', function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

server.listen(config.Host.port, () => {
  console.log('%s listening at %s', server.name, server.url);
});

server.get('/', (req, res) => { res.end(JSON.stringify({
  name: "App Engine",
  version: config.Host.version }));
});

server.post('/dbf/api/:version/app', () => {});
server.put('/dbf/api/:version/app/:appId', () => {});
server.del('/dbf/api/:version/app/:appId', () => {});

server.post('/dbf/api/:version/app/:appId/connections/add', authorization(), workspaceAccessCheck(), AppConnectionsCtrl.SaveConnction);
server.get('/dbf/api/:version/app/:appId/connections', authorization(), workspaceAccessCheck(), AppConnectionsCtrl.GetConnections);
server.get('/dbf/api/:version/app/:appId/connection/:connectionId', authorization(), workspaceAccessCheck(), AppConnectionsCtrl.GetConnectionData);
server.put('/dbf/api/:version/app/:appId/connection/:connectionId/edit/api', authorization(), workspaceAccessCheck(), AppConnectionsCtrl.EditConnection);
server.put('/dbf/api/:version/app/:appId/connection/:connectionId/edit/common', authorization(), workspaceAccessCheck(), AppConnectionsCtrl.EditCommonData);
server.put('/dbf/api/:version/app/:appId/connection/:connectionId/edit/params', authorization(), workspaceAccessCheck(), AppConnectionsCtrl.EditParameters);
server.del('/dbf/api/:version/app/:appId/connection/:connectionId', authorization(), workspaceAccessCheck(), AppConnectionsCtrl.DeleteConnection);

server.post('/dbf/api/:version/app/:appId/module/add', authorization(), workspaceAccessCheck(), AppModulesCtrl.SaveModule);
server.get('/dbf/api/:version/app/:appId/modules', authorization(), workspaceAccessCheck(), AppModulesCtrl.GetModules);
server.get('/dbf/api/:version/app/:appId/module/:moduleId', authorization(), workspaceAccessCheck(), AppModulesCtrl.GetModule);
server.del('/dbf/api/:version/app/:appId/module/:moduleId', authorization(), workspaceAccessCheck(), AppModulesCtrl.DeleteModule);
server.post('/dbf/api/:version/app/:appId/module/:modulename/edit/connection/attach', AppConnectionsCtrl.SaveConnction); // {"account":"devsmoothflow-283265"}