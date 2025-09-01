const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Payment",
  tableName: "payment",
  columns: {
    paymentId: {
      primary: true,
      type: "int",
      generated: true,
    },
    amount: {
      type: "float",
    },
    status: {
      type: "varchar", 
    },
    paymentMethod: {
      type: "varchar", 
    },
  },
  relations: {
    reservation: {
      type: "one-to-one",
      target: "Reservation",
      joinColumn: { name: "reservationId" },
      onDelete: "CASCADE",
    },
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "userId" },
    },
  },
});
