const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

function loadUsers() {
  try {
    if (!fs.existsSync(USERS_FILE)) return [];
    const raw = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hash: derived };
}

function verifyPassword(password, stored) {
  if (!stored || !stored.salt || !stored.hash) return false;
  const derived = crypto.scryptSync(password, stored.salt, 64).toString('hex');
  return derived === stored.hash;
}

function findUserByEmail(email) {
  const users = loadUsers();
  return users.find(u => u.email === email);
}

function createUser(email, password, name = '', roles = ['user']) {
  const users = loadUsers();
  if (users.find(u => u.email === email)) {
    return { ok: false, reason: 'exists' };
  }
  const pwd = hashPassword(password);
  const user = {
    email,
    name,
    roles,
    password: pwd,
    createdAt: new Date().toISOString()
  };
  users.push(user);
  saveUsers(users);
  return { ok: true, user };
}

module.exports = {
  loadUsers,
  saveUsers,
  createUser,
  findUserByEmail,
  verifyPassword,
};
