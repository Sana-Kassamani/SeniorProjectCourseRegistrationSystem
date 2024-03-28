'use strict';
const {
  Model
} = require('sequelize');

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
      primaryKey: true, // Define StudentID as part of the composite primary key
      allowNull: false
    },
    SectionID: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Define SectionID as part of the composite primary key
      allowNull: false
    },
    Grade: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'StudentSection',
  });
  
  return StudentSection;
};