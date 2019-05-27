const Connection = require('./connection');

export default class APIKey extends Connection {
  constructor(name) {
    super(name, "apikey");
  }
}