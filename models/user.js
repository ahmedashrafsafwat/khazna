module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
      'User',
      {
        id: {
          type: DataTypes.STRING,
        primaryKey: true
          
        },
        name: {
          type: DataTypes.STRING,
        },
        balance: {
          type: DataTypes.DOUBLE,
          default:0
        },
        max_balance: {
          type: DataTypes.DOUBLE,
        },
        email: {
          type: DataTypes.STRING,
        },
        password: {
          type: DataTypes.STRING,
        }
      
      },
      {
        timestamps: false,

  // If don't want createdAt
  createdAt: false,

  // If don't want updatedAt
  updatedAt: false,
      }
    );
    // User.associate = function (models) {
    //   // associations can be defined here
    // };
    return User;
  }