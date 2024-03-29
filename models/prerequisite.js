'use strict';
const {
  Model
} = require('sequelize');
const Course=require('./course')
module.exports = (sequelize, DataTypes) => {
  class Prerequisite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //Prerequisite.belongsTo(models.Course, { foreignKey: 'CourseID' })
      //Prerequisite.belongsTo(models.Course, { foreignKey: 'PrerequisiteID' })
    }
  }
  Prerequisite.init({
    CourseID: {
      type: DataTypes.INTEGER,
      references:{
        model: Course,
        key: 'CourseID'
      }
    },
    PrerequisiteID: {
      type: DataTypes.INTEGER,
      references:{
        model: Course,
        key: 'CourseID'
      }
    }
  }, {
    sequelize,
    modelName: 'Prerequisite',
  });
  
  return Prerequisite;
};