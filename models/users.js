const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

//create user model
class User extends Model {
    //set up method to run on instance data (per user) to check password
    checkPassword(loginPw){
        return bcrypt.compareSync(loginPw, this.password);
    }
}

//define table columns and configuration
User.init(
    {
        //define an id column
        id: {
            //user the special Sequelize DataTypes object to provide what type of data it is
            type: DataTypes.INTEGER,
            //this is equivalent to SQL's 'NOT NULL' option
            allowNull: false,
            //instruct that this is the Primary Key
            primaryKey: true,
            //turn on auto increment
            autoIncrement: true
        },   
        //define a username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        //define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            //there cannot be any duplicate emails in this table
            unique: true,
            //if allowNull is set to false, we can run data through validators before creating table
            validate:{
                isEmail: true
            }
        },
        //define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                //this means the password must be at least four characters longs
                len: [4]
            }
        }
    },
    {
        //Table config options go here (https://sequelize.org/v5/manual/models-definition.html#configuration)
        hooks:{
            //setup beforeCreate lifecycle "hook" functionality
            async beforeCreate(newUserData){
                    newUserData.password = await bcrypt.hash(newUserData.password, 10);
                    return newUserData;
            },
            //setup beforeUpdate lifecycle 'hook' functionality
            async beforeUpdate(updatedUserData){
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },
        //pass imported sequelize connection(connection to database)
        sequelize,
        //don't auto create createdAt/updatedAt timestamp fields
        timestamps: false,
        //don't pluralize name of database table
        freezeTableName: true,
        //use underscores instead of camel casing
        underscored: true,
        //make it so model stays lowercase in database
        modelName: 'user'
    }

);

module.exports = User;