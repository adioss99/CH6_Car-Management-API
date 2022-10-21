import { Sequelize } from 'sequelize';
import db from '../config/database.js';

const { DataTypes } = Sequelize;

export const Users = db.define(
  'users',
  {
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    refresh_token: {
      type: DataTypes.TEXT,
    },
    roles: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

export const Cars = db.define(
  'cars',
  {
    car_name: {
      type: DataTypes.STRING,
    },
    rent_price: {
      type: DataTypes.STRING,
    },
    car_type: {
      type: DataTypes.STRING,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    editedBy: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    deletedBy: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    deletedAt: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    paranoid: true,
    deletedAt: 'deletedAt',
  }
);

Users.hasMany(Cars, { as: 'creator', foreignKey: 'createdBy' });
Users.hasMany(Cars, { as: 'editor', foreignKey: 'editedBy' });
Users.hasMany(Cars, { as: 'deletor', foreignKey: 'deletedBy' });
Cars.belongsTo(Users, { as: 'created_by', foreignKey: 'createdBy' });
Cars.belongsTo(Users, { as: 'edited_by', foreignKey: 'editedBy' });
Cars.belongsTo(Users, { as: 'deleted_by', foreignKey: 'deletedBy' });

(async () => {
  await db.sync();
})();
