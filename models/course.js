'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Course.belongsToMany(models.Course, {
          through: "Prerequisite",
          foreignKey: 'PrerequisiteID',
          as: 'prerequisites'
        });
      Course.belongsToMany(models.Course, {
        through: "Prerequisite",
        foreignKey: 'CourseID',
        as: 'requiredBy'
      });

      Course.belongsToMany(models.Course, {
        through: "Substitutable",
        foreignKey: 'SubstitutableID'
      });
    Course.belongsToMany(models.Course, {
      through: Substitutable,
      foreignKey: CourseID
    });
  

      Course.belongsTo(models.Faculty, { foreignKey: "FacultyId" })

      Course.hasMany(models.Section, { foreignKey: "CourseId" })

      Course.belongsToMany(models.AcademicProgram, {
        through: "ProgramCourse",
        foreignKey: 'CourseID'
      });
    }
  }
  Course.init({
    CourseID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    CourseCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    CourseName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Credits: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Course',
  });
  
  return Course;
};