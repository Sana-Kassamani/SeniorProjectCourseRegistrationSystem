'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FacultyMember extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FacultyMember.belongsTo(models.Faculty, { foreignKey: {name:"FacultyID", allowNull: false }})
      FacultyMember.hasMany(models.Section, { foreignKey: {name: "InstructorID", allowNull: false }})
      
    }
  }
  FacultyMember.init({
    MemberID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
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
      unique: true, // Add unique constraint for EmailAddress
      allowNull: false
    },
    AdminFlag: {
      type: DataTypes.BOOLEAN,
      allowNull: true // Allow AdminFlag to be nullable
    },
    InstructorFlag: {
      type: DataTypes.BOOLEAN,
      allowNull: true // Allow InstructorFlag to be nullable
    }
  }, {
    sequelize,
    modelName: 'FacultyMember',
  });
  
  return FacultyMember;
};