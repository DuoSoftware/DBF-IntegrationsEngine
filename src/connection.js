const MongooseConnection = new require('../services/mongoose');
let connection = new MongooseConnection();

const AppConnection = require('../models/appConnection').appConnection;

class Connection {
  constructor(name, type) {
    if (this.constructor.name === "Connection") {
      throw new TypeError('Abstract class "Connection" cannot be instantiated directly.'); 
    }

    this.id = Date.now(),
    this.name = name,
    this.type = type, 
    this.commonData = {};
    this.parameters = [];
  }

  save() {
    try {
      let data = await ({
        id: this.id,
        name: this.name,
        type: this.type,
        appId: "bina's lab",
        commonData: this.commonData,
        parameters: this.parameters
      }).save();

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  get() {

  }

  edit() {
    
  }
}

export default class ConnectionFactory {
  static create(name, type) {
    switch (payload.type) {
      case "basic-auth":
        let basic_auth = new BasicAuth('smoothflow-dev');
        basic_auth.create();
        break;
    }
  }

  static get(id) {
    
  }

}