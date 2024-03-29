'use strict';
const {
  Model
} = require('sequelize');
const Student=require('./student')
const Section=require('./section')
module.exports = (sequelize, DataTypes) => {
  class StudentSection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //Prerequisite.belongsTo(models.Section, { foreignKey: 'SectionID' })
      //Prerequisite.belongsTo(models.StudentID, { foreignKey: 'StudentID' })
      
    }
  }
  StudentSection.init({
    StudentID: {
      type: DataTypes.INTEGER,
      references:{
        model: Student,
        key: 'StudentID'
      }
    },
    SectionID: {
      type: DataTypes.INTEGER,
      references:{
        model: Section,
        key: ['CourseID' , 'SectionNumber']
      }
    },
    Grade: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'StudentSection',
  });
  
  return StudentSection;
};