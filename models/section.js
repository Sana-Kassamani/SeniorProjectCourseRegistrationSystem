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
      Section.belongsTo(models.Course, { foreignKey: "CourseId" })
      Section.belongsTo(models.FacultyMember, { foreignKey: "MemberId" })

      Course.belongsToMany(models.Student, {
        through: "StudentSection",
        foreignKey: 'SectionID'
      });

    }
  }
  
  Section.init({
    CourseId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    SectionNumber: {
      type: DataTypes.INTEGER,
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
    }
  }, {
    sequelize,
    modelName: 'Section',
  });
  return Section;
};