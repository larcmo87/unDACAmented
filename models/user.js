
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    // Giving the Author model a name of type STRING
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      isUnique: true
     
    },
    userPW:{
      type: DataTypes.STRING,
      allowNull: false
      
    },
    isLoggedIn:{
      type: DataTypes.BOOLEAN
    }

  });

  User.associate = function(models) {
    // Associating Author with Posts
    // When an Author is deleted, also delete any associated Posts
    User.hasMany(models.Post, {
      onDelete: "cascade"
    });
  };

  return User;
};
