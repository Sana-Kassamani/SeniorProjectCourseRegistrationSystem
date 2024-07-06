'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProcessStatus = sequelize.define('ProcessStatus', {
    process: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {});
  return ProcessStatus;
};
