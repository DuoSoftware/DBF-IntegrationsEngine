const appModule = require('dbf-dbmodels/Models/AppModule').appModule;

module.exports.Create = async (data) => {
  return await appModule(data).save();
};

module.exports.GetOne = async (context) => {
  return await appModule.findOne(context);
}

module.exports.GetMany = async (context) => {
  return await appModule.find(context);
}

module.exports.UpdateOne = async (context, data) => {
  return await appModule.findOneAndUpdate(context, data, {new: true});
}

module.exports.RemoveOne = async (context) => {
  return await appModule.deleteOne(context);
}