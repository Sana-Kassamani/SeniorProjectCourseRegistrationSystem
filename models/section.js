'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Section extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Section.belongsTo(models.Course, { foreignKey: {name:"CourseID", allowNull: false, primaryKey:true} })
      Section.belongsTo(models.FacultyMember, { foreignKey:{name: "InstructorID", allowNull: false }})

      Section.belongsToMany(models.Student, {through: models.StudentSection, foreignKey:'SectionID'});

    }
  }
  
  Section.init({
    
    SectionNumber: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    Semester: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Days: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Time: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Room: {
      type: DataTypes.STRING,
      allowNull: false
    },
    NbOfSeats: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Mode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reserved:{
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
  }
  }, {
    sequelize,
    modelName: 'Section',
  });
  return Section;
};