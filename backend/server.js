const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const {
  sequelize, User, Group, GroupMember, Transaction, UserBudget, GroupBudget
} = require('./models');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// JWT middleware
app.use(async (req, res, next) => {
  if (req.headers.authorization) {
    try {
      let payload = jwt.verify(req.headers.authorization.replace("Bearer ", ""), "SECRET");
      req.user = await User.findByPk(payload.id);
    } catch (err) {}
  }
  next();
});

// Auth endpoints
app.post('/api/signup', async (req, res) => {
  const user = await User.create(req.body);
  await UserBudget.create({ UserId: user.id, amount: 0 });
  const token = jwt.sign({ id: user.id, email: user.email }, "SECRET");
  res.json({ token });
});

app.post('/api/login', async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email } });
  if (user && user.password === req.body.password) {
    const token = jwt.sign({ id: user.id, email: user.email }, "SECRET");
    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Me endpoint
app.get('/api/me', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  res.json({ id: req.user.id, email: req.user.email });
});

// Groups
app.get('/api/groups', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  const groups = await req.user.getGroups({ include: [User] });
  res.json(groups);
});

app.post('/api/groups', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  const group = await Group.create({ name: req.body.name });
  await group.addUser(req.user);
  res.json(group);
});

// Transactions
app.get('/api/transactions', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  const groupIds = (await req.user.getGroups()).map(g => g.id);
  const txs = await Transaction.findAll({
    where: {
      UserId: req.user.id
    },
    include: [Group]
  });
  const groupTxs = await Transaction.findAll({
    where: {
      GroupId: groupIds
    },
    include: [Group]
  });
  res.json([...txs, ...groupTxs]);
});

app.post('/api/transactions', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  let tx;
  if (req.body.groupId) {
    const group = await Group.findByPk(req.body.groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });
    tx = await Transaction.create({
      description: req.body.description,
      amount: req.body.amount,
      UserId: req.user.id,
      GroupId: req.body.groupId
    });
  } else {
    tx = await Transaction.create({
      description: req.body.description,
      amount: req.body.amount,
      UserId: req.user.id
    });
  }
  res.json(tx);
});

// Budgets
app.get('/api/budgets', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  const userBudget = await UserBudget.findOne({ where: { UserId: req.user.id } });
  const groupBudgets = {};
  const groups = await req.user.getGroups();
  for (let group of groups) {
    const gb = await GroupBudget.findOne({ where: { GroupId: group.id } });
    groupBudgets[group.id] = gb ? gb.amount : 0;
  }
  res.json({ user: userBudget ? userBudget.amount : 0, groups: groupBudgets });
});

app.post('/api/budgets/user', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  let ub = await UserBudget.findOne({ where: { UserId: req.user.id } });
  if (!ub) ub = await UserBudget.create({ UserId: req.user.id, amount: req.body.amount });
  else await ub.update({ amount: req.body.amount });
  res.json({ user: ub.amount });
});

app.post('/api/budgets/group', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  const group = await Group.findByPk(req.body.groupId);
  if (!group) return res.status(404).json({ error: "Group not found" });
  let gb = await GroupBudget.findOne({ where: { GroupId: group.id } });
  if (!gb) gb = await GroupBudget.create({ GroupId: group.id, amount: req.body.amount });
  else await gb.update({ amount: req.body.amount });
  res.json({ groupId: group.id, amount: gb.amount });
});

// Start
sequelize.sync().then(() => {
  app.listen(5000, () => console.log("API running on http://localhost:5000"));
});