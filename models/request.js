module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define(
    'Request',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
        
      },
      userid: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.STRING,
      },
      price: {
        type: DataTypes.DOUBLE,
      },
      productid: {
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

  return Request;
}