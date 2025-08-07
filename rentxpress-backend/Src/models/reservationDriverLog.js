const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "ReservationDriverLog",
  tableName: "reservationDriverLog",
  columns: {
    logId: {
      primary: true,
      type: "int",
      generated: true,
    },
    status: {
      type: "varchar",
      default: "Pending",
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
    updatedAt: {
      type: "timestamp",
      updateDate: true,
    },
  },
  relations: {
    reservation: {
      type: "many-to-one",
      target: "Reservation",
      joinColumn: { name: "reservationId" },
      onDelete: "CASCADE",
    },
    driver: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "driverId" },
      onDelete: "SET NULL",
    },
  },
});
