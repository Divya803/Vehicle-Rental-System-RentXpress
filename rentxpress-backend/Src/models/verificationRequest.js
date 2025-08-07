const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "VerificationRequest",
  tableName: "verificationRequest",
  columns: {
    verifyId: {
      primary: true,
      type: "int",
      generated: true,
    },
    firstName: {
      type: "varchar",
    },
    lastName: {
      type: "varchar",
    },
    age: {
      type: "int",
    },
    phoneNo: {
      type: "varchar",
    },
    nic: {
      type: "varchar",
    },
    dateOfBirth: {
      type: "date",
    },
    role: {
      type: "varchar", // 'driver' or 'vehicle_owner'
    },
    identification: {
      type: "text", // URL or base64 string
    },
    status: {
      type: "varchar",
      default: "pending", // pending, approved, rejected
    },
    issueDetails: {
      type: "text", // stores detailed issue information
      nullable: true, // can be null if no issues
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "userId" },
      onDelete: "CASCADE",
    },
  },
});
