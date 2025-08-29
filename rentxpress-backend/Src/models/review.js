// backend/entities/Review.js
const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Review",
  tableName: "reviews",
  columns: {
    reviewId: {
      primary: true,
      type: "int",
      generated: true,
    },
    userId: {
      type: "int",
    },
    username: {
      type: "varchar",
      length: 100,
    },
    rating: {
      type: "int", // 1-5 stars
    },
    comment: {
      type: "text",
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
  },
  relations: {
    user: {
      target: "User",
      type: "many-to-one",
      joinColumn: { name: "userId" },
      onDelete: "CASCADE",
    },
  },
});
