const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Reservation",
    tableName: "reservation",
    columns: {
        reservationId: {
            primary: true,
            type: "int",
            generated: true,
        },
        totalAmount: {
            type: "float",
        },
        reservationType: {
            type: "varchar",
        },
        startDate: {
            type: "date",
        },
        endDate: {
            type: "date",
        },
        isCancelled: {
            type: "boolean",
            default: false,
        },
        status: {
            type: "varchar",
            default: "Pending"
        },
    },
    relations: {
        user: {
            type: "many-to-one",
            target: "User",
            joinColumn: { name: "userId" },
            onDelete: "CASCADE",
        },
        driver: {
            type: "many-to-one",
            target: "User", // assuming driver is a user
            joinColumn: { name: "driverId" },
            nullable: true,
        },
        vehicle: {
            type: "many-to-one",
            target: "Vehicle",
            joinColumn: { name: "vehicleId" },
            onDelete: "CASCADE",
        }
    },
});
