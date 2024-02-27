import { DataTypes } from "sequelize";
import { sequelize } from "./../connection.js";


export const Note = sequelize.define(
  "notes",
  {
    notes_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.STRING },
    manager_id: {
      type: DataTypes.INTEGER,
    },
    meeting_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    freezeTableName: true,
  }
);
