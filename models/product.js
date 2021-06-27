module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'Product',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
      },
      brand: {
        type: DataTypes.STRING,
      },
      category: {
        type: DataTypes.STRING,
      },
      price: {
        type: DataTypes.STRING,
      }
    }
    ,
      {
        timestamps: false,

  // If don't want createdAt
  createdAt: false,

  // If don't want updatedAt
  updatedAt: false,
      }
  );
  User.associate = function (models) {
    // associations can be defined here
  };
  return User;
}