'use strict';
const {
  Model
} = require('sequelize');
const Course=require('./course')
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
      references:{
        model: Course,
        key: 'CourseID'
      }
    },
    SubstitutableID: {
      type: DataTypes.INTEGER,
      references:{
        model: Course,
        key: 'CourseID'
      }
    }
  }, {
    sequelize,
    modelName: 'Substitutable',
  });
  return Substitutable;
};