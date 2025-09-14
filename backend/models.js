const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({ dialect: 'sqlite', storage: 'db.sqlite' });

// User model
const User = sequelize.define('User', {
  email: { type: DataTypes.STRING, unique: true },
  password: DataTypes.STRING
});

// Group model
const Group = sequelize.define('Group', {
  name: DataTypes.STRING
});

// Group membership (many-to-many)
const GroupMember = sequelize.define('GroupMember', {});

User.belongsToMany(Group, { through: GroupMember });
Group.belongsToMany(User, { through: GroupMember });

// Transaction model
const Transaction = sequelize.define('Transaction', {
  description: DataTypes.STRING,
  amount: DataTypes.FLOAT
});
Transaction.belongsTo(User);
Transaction.belongsTo(Group);

// Budgets
const UserBudget = sequelize.define('UserBudget', {
  amount: DataTypes.FLOAT
});
UserBudget.belongsTo(User);

const GroupBudget = sequelize.define('GroupBudget', {
  amount: DataTypes.FLOAT
});
GroupBudget.belongsTo(Group);

module.exports = { sequelize, User, Group, GroupMember, Transaction, UserBudget, GroupBudget };