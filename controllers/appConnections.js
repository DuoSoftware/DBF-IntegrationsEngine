const Utils = require('../utils'),
  AppConnectionWorker = require('../workers/appConnections');

module.exports.SaveConnction = async (req, res) => {
  let authUser = req.user,
    payload = req.body;
  
  let validateParamResponse = Utils.ValidateParams(payload, ["name", "type"]);
  if (!validateParamResponse.status) {
    res.status(400);
    res.send(Utils.Error("Required parameters empty or not found", validateParamResponse.list, 400));
    return;
  }

  let connObj = {
    id: `${Utils.toCamelCase(payload.name)}-${Utils.getRandomNumber()}`,
    name: payload.name,
    type: payload.type,
    appId: req.params.appId,
    tenant: authUser.workspaceId,
    company: authUser.projectId
  }

  switch (payload.type) {
    case "basic-auth":
      connObj["api"] = {
        "url": "https://www.example.com/api/whoami",
        "headers": {
          "authorization": ""
        }
      }
      break;
    case "api-key":
      connObj["api"] = {
        "url": "https://www.example.com/api/whoami",
        "headers": {
          "x-api-key": ""
        } 
      }
      break;
    case "loginurl":
      connObj["api"] = {
        "url": "https://www.example.com/api/whoami",
      }
      break;
  }

  try {
    let appConnection = await AppConnectionWorker.Create(connObj);
    if (appConnection) {
      res.status(201);
      res.send(Utils.Success(`${payload.name} connection successfully created.`, appConnection.id, 201)); 
    } else {
      res.status(500);
      res.send(Utils.Error(`Error getting while creating the connection(${payload.name})`));
    }
  } catch (exception) {
      res.status(500);
      res.send(common.Error(exception.message, undefined));
  }
}

module.exports.GetConnections = async (req, res) => {
  let authUser = req.user;

  try {
    let appConnections = await AppConnectionWorker.GetMany({tenant: authUser.workspaceId, company: authUser.projectId, appId: req.params.appId});
    if (appConnections) {
      res.status(200);
      res.send(Utils.Success(`Connections fetched`, appConnections, 200)); 
    } else {
      res.status(500);
      res.send(Utils.Error(`Error getting while fetching the connections`));
    }
  } catch (exception) {
      res.status(500);
      res.send(Utils.Error(exception.message, undefined));
  }
}

module.exports.GetConnectionData = async (req, res) => {
  let authUser = req.user,
    connectionId = req.params.connectionId;

  try {
    let connection = await AppConnectionWorker.GetMany({
      tenant: authUser.workspaceId, 
      company: authUser.projectId, 
      appId: req.params.appId,
      id: connectionId
    });

    if (connection) {
      res.status(200);
      res.send(Utils.Success(`Connection fetched`, connection, 200)); 
    } else {
      res.status(500);
      res.send(Utils.Error(`Error getting while fetching the connection`));
    }
  } catch (exception) {
      res.status(500);
      res.send(Utils.Error(exception.message, undefined));
  }
}

module.exports.EditConnection = async (req, res) => {
  let authUser = req.user,
    connectionId = req.params.connectionId;
    payload = req.body;

  try {
    let connection = await AppConnectionWorker.UpdateOne({
      tenant: authUser.workspaceId, 
      company: authUser.projectId, 
      appId: req.params.appId,
      id: connectionId
    },{
      $set: { 
        api: payload.api,
      },
    });

    if (connection) {
      res.status(200);
      res.send(Utils.Success(`connection api successfully updated.`, connection, 200)); 
    } else {
      res.status(500);
      res.send(Utils.Error(`Error getting while creating the connection`));
    }
  } catch (exception) {
      res.status(500);
      res.send(Utils.Error(exception.message, undefined));
  }
}

module.exports.EditCommonData = async (req, res) => {
  let authUser = req.user,
    connectionId = req.params.connectionId
    payload = req.body;

  try {
    let connection = await AppConnectionWorker.UpdateOne({
      tenant: authUser.workspaceId, 
      company: authUser.projectId, 
      appId: req.params.appId,
      id: connectionId
    },{
      $set: { 
        commonData: payload.common,
      },
    });

    if (connection) {
      res.status(200);
      res.send(Utils.Success(`connection common data successfully updated.`, connection, 200)); 
    } else {
      res.status(500);
      res.send(Utils.Error(`Error getting while creating the connection`));
    }
  } catch (exception) {
      res.status(500);
      res.send(Utils.Error(exception.message, undefined));
  }
}

module.exports.EditParameters = async (req, res) => {
  let authUser = req.user,
  connectionId = req.params.connectionId
  payload = req.body;

  try {
    let connection = await AppConnectionWorker.UpdateOne({
      tenant: authUser.workspaceId, 
      company: authUser.projectId, 
      appId: req.params.appId,
      id: connectionId
    },{
      $set: { 
        params: payload.params,
      },
    });

    if (connection) {
      res.status(200);
      res.send(Utils.Success(`connection params successfully updated.`, connection, 200)); 
    } else {
      res.status(500);
      res.send(Utils.Error(`Error getting while creating the connection`));
    }
  } catch (exception) {
      res.status(500);
      res.send(Utils.Error(exception.message, undefined));
  }
}

module.exports.DeleteConnection = async (req, res) => {
  let authUser = req.user,
  connectionId = req.params.connectionId
  payload = req.body;

  try {
    let connection = await AppConnectionWorker.RemoveOne({
      tenant: authUser.workspaceId, 
      company: authUser.projectId, 
      appId: req.params.appId,
      id: connectionId
    });

    if (connection) {
      res.status(200);
      res.send(Utils.Success(`connection successfully deleted.`, null, 200)); 
    } else {
      res.status(500);
      res.send(Utils.Error(`Error getting while deleting the connection`));
    }
  } catch (exception) {
      res.status(500);
      res.send(Utils.Error(exception.message, undefined));
  }
}