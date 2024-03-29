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
          through: Prerequisite,
          foreignKey: 'PrerequisiteID'
        });
      Course.belongsToMany(models.Course, {
        through: Prerequisite,
        foreignKey: 'CourseID'
      });

      Course.belongsToMany(models.Course, {
        through: Substitutable,
        foreignKey: 'SubstitutableID'
      });
      Course.belongsToMany(models.Course, {
        through: Substitutable,
        foreignKey: 'CourseID'
      });
  
      Course.belongsToMany(models.AcademicProgram, {through: ProgramCourse});

      Course.belongsTo(models.Faculty, { foreignKey:{name: "FacultyID", allowNull: false}  })

      Course.hasMany(models.Section, { foreignKey:{name: "CourseID", allowNull: false} });


      
    }
  }
  Course.init({
    CourseID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
      type: DataTypes.TEXT,
      allowNull: true
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