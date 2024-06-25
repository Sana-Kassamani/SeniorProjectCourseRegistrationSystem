'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Student.belongsTo(models.AcademicProgram,{ foreignKey:{name: "ProgramID" , allowNull: false}})

      Student.belongsToMany(models.Section, {through: models.StudentSection, foreignKey: 'StudentID'});
    }
  }
  Student.init({
    StudentID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,

    },
    StudentIdentificationNumber: {
      type: DataTypes.STRING,
      unique:true,
      allowNull: false,

    },
    FName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    LName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    EmailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true // Add unique constraint for EmailAddress
    },
    GPA: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Student',
  });
  
  return Student;
};