'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProgramCourse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //Prerequisite.belongsTo(models.AcademicProgram, { foreignKey: 'ProgramID' })
      //Prerequisite.belongsTo(models.Course, { foreignKey: 'CourseID' })
    }
  }
  ProgramCourse.init({
    ProgramID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    CourseID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    Type: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ProgramCourse',
  });
  
  return ProgramCourse;
};