const Connection = require('./connection');

export default class BasicAuth extends Connection {
  constructor(name) {
    super(name, "basic-auth");
  }
}