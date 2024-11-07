import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.POSTGRES_HOST,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  dialectOptions: { // Added SSL options
    ssl: {
      require: true, // This enables SSL
      rejectUnauthorized: false // This can be set to true in production for security
    }
  }
});

try {
  await sequelize.authenticate();
  console.log('Connection to the database has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

const UserData = sequelize.define('user_data', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  user_name: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  number: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  state: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  seller: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  date: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  }
}, {
    schema: 'rifa',
    timestamps: false 
});

export const getAllUserData = async () => {
  try {
    const allUserData = await UserData.findAll();
    return allUserData;
  } catch (error) {
    console.error('Error getting all user data:', error);
    return null;
  }
};

export const insertNewUserData = async (userData) => {
  try {
    const existingNumber = await UserData.findOne({ where: { number: userData.number } });
    if (existingNumber) {
        console.log('Number already exists, skipping insertion.');
        return null;
    }
    const newUser = await UserData.create(userData);
    return newUser;
  } catch (error) {
    console.error('Error inserting new user data:', error);
    throw new Error(error);
  }
  
};
