const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "User",
  tableName: "user",
  columns: {
    userId: {
      primary: true,
      type: "int",
      generated: true,
    },
    firstName: {
      type: "varchar",
      length: 100,
    },
    lastName: {
      type: "varchar",
      length: 100,
    },
    email: {
      type: "varchar",
      unique: true,
    },
    phoneNo: {
      type: "varchar",
      length: 15,
    },
    password: {
      type: "varchar",
    },
    age: {
      type: "int",
      nullable: true,
    },
    role: {
      type: "varchar",
      length: 50,
      default: "user",
    },
    nic: {
      type: "varchar",
      length: 20,
      nullable: true,
    },
    dateOfBirth: {
      type: "date",
      nullable: true,
    },
  },
  relations: {
    vehicle: {
      type: "one-to-many",
      target: "Vehicle",
      inverseSide: "user",
      cascade: true,
    },
  },
});
