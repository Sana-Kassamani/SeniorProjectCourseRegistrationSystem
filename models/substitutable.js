'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Substitutable extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //Prerequisite.belongsTo(models.Course, { foreignKey: 'CourseID' })
      //Prerequisite.belongsTo(models.Course, { foreignKey: 'SubstitutableID' })
    }
  }
  Substitutable.init({
    CourseID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    SubstitutableID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Substitutable',
  });
  return Substitutable;
};