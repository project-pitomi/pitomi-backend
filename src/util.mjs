const createUser = (User, username, password) => {
  User.create({ username, password });
};

export { createUser };
