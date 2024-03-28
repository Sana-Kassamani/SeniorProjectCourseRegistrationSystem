'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Faculty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Faculty.hasMany(models.FacultyMember, { foreignKey: "FacultyId" })
      Faculty.hasMany(models.AcademicProgram, { foreignKey: "FacultyId" })
      Faculty.hasMany(models.Course, { foreignKey: "FacultyId" })
    }
  }
  Faculty.init({
    FacultyID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    FacultyName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true // Add unique constraint for FacultyName
    }
  }, {
    sequelize,
    modelName: 'Faculty',
  });
  return Faculty;
};