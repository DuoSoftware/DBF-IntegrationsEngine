const Utils = require('../utils'),
  AppModuleWorker = require('../workers/appModules');

module.exports.SaveModule = async (req, res) => {
  let authUser = req.user,
    payload = req.body;
  
  let validateParamResponse = Utils.ValidateParams(payload, ["name", "type", "connection"]);
  if (!validateParamResponse.status) {
    res.status(400);
    res.send(Utils.Error("Required parameters empty or not found", validateParamResponse.list, 400));
    return;
  }

  let connObj = {
    id: `${Utils.toCamelCase(payload.name)}-${Utils.getRandomNumber()}`,
    name: payload.name,
    type: payload.type,
    connection: (payload.connection)? payload.connection: "",
    appId: req.params.appId,
    tenant: authUser.workspaceId,
    company: authUser.projectId
  }

  switch (payload.type) {
    case "action":
      connObj["api"] = {
        "url": "/api/users/create",
        "method": "POST",
        "qs": {},
        "body": {
          "name": "",
          "email": ""
        },
        "headers": {},
        "response": {
          "output": ""
        }
      }
      break;
  }

  try {
    let appModule = await AppModuleWorker.Create(connObj);
    if (appModule) {
      res.status(201);
      res.send(Utils.Success(`${payload.name} module successfully created.`, appModule.id, 201)); 
    } else {
      res.status(500);
      res.send(Utils.Error(`Error getting while creating the module(${payload.name})`));
    }
  } catch (exception) {
      res.status(500);
      res.send(common.Error(exception.message, undefined));
  }
}

module.exports.GetModules = async (req, res) => {
  let authUser = req.user;

  try {
    let appModules = await AppModuleWorker.GetMany({tenant: authUser.workspaceId, company: authUser.projectId, appId: req.params.appId});
    if (appModules) {
      res.status(200);
      res.send(Utils.Success(`Modules fetched`, appModules, 200)); 
    } else {
      res.status(500);
      res.send(Utils.Error(`Error getting while fetching the modules`));
    }
  } catch (exception) {
      res.status(500);
      res.send(Utils.Error(exception.message, undefined));
  }
}

module.exports.GetModule = async (req, res) => {
  let authUser = req.user,
    moduleId = req.params.moduleId;

  try {
    let module = await AppModuleWorker.GetOne({
      tenant: authUser.workspaceId, 
      company: authUser.projectId, 
      appId: req.params.appId,
      id: moduleId
    });

    if (module) {
      res.status(200);
      res.send(Utils.Success(`Module fetched`, module, 200)); 
    } else {
      res.status(500);
      res.send(Utils.Error(`Error getting while fetching the module`));
    }
  } catch (exception) {
      res.status(500);
      res.send(Utils.Error(exception.message, undefined));
  }
}

module.exports.DeleteModule = async (req, res) => {
  let authUser = req.user,
    moduleId = req.params.moduleId
    payload = req.body;

  try {
    let module = await AppModuleWorker.RemoveOne({
      tenant: authUser.workspaceId, 
      company: authUser.projectId, 
      appId: req.params.appId,
      id: moduleId
    });

    if (module) {
      res.status(200);
      res.send(Utils.Success(`module successfully deleted.`, null, 200)); 
    } else {
      res.status(500);
      res.send(Utils.Error(`Error getting while deleting the module`));
    }
  } catch (exception) {
      res.status(500);
      res.send(Utils.Error(exception.message, undefined));
  }
}

module.exports.AttachConnection = async (req, res) => {
  let authUser = req.user,
  moduleId = req.params.moduleId;

  try {
    let module = await AppModuleWorker.UpdateOne({
      tenant: authUser.workspaceId, 
      company: authUser.projectId, 
      appId: req.params.appId,
      id: moduleId
    },{
      $set: { 
        connection: payload.connection,
      },
    });

    if (module) {
      res.status(200);
      res.send(Utils.Success(`Module updated`, connection, 200)); 
    } else {
      res.status(500);
      res.send(Utils.Error(`Error getting while updating the module`));
    }
  } catch (exception) {
      res.status(500);
      res.send(Utils.Error(exception.message, undefined));
  }
}

