'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AcademicProgram extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AcademicProgram.hasMany(models.Student, { foreignKey: "ProgramId" })
      AcademicProgram.belongsTo(models.Faculty, { foreignKey: "FacultyId" })

      AcademicProgram.belongsToMany(models.Course, {
        through: ProgramCourse,
        foreignKey: 'ProgramID'
      });
      
    }
  }
  AcademicProgram.init({
    ProgramID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    ProgramName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true // Add unique constraint
    },
    Degree: {
      type: DataTypes.STRING,
      allowNull: false
    },
    CoreCredits: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    MajorCredits: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    TechnicalCredits: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ElectiveCredits: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'AcademicProgram',
  });
  
  return AcademicProgram;
};