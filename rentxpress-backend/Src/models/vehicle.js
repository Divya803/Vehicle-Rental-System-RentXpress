const { EntitySchema } = require("typeorm");
const User = require("./user");

module.exports = new EntitySchema({
  name: "Vehicle",
  tableName: "vehicle",
  columns: {
    vehicleId: {
      primary: true,
      type: "int",
      generated: true,
    },
    vehicleName: {
      type: "varchar",
    },
    price: {
      type: "float",
    },
    withDriverPrice: {
      type: "float",
    },
    image: {
      type: "text",
    },
    category: {
      type: "varchar",
    },
    description: {
      type: "text",
      nullable: true,
    },
    status: {
      type: "varchar",
      default: "pending",
    },
    isAvailable: {
      type: "boolean",
      default: true,
    },
    userId: {
      type: "int",
    },
    issueDetails: {
      type: "text", // stores detailed issue information
      nullable: true, // can be null if no issues
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "userId", // this is the foreign key in Vehicle table
      },
      onDelete: "CASCADE", // optional
    },
  },
});
