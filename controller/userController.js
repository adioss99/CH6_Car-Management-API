import { Users } from '../models/mainModels.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const createUserEngine = async (req, res, params) => {
  const roles = params;
  const { name, email, password, confPassword } = req.body;
  if (password !== confPassword) return res.status(400).json({ msg: "Password dan Confirmation Password isn't match" });
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await Users.findOrCreate({
      where: { email: email.toLowerCase() },
      defaults: {
        name: name,
        email: email.toLowerCase(),
        password: hashPassword,
        roles: roles,
      },
    }).then(([user, created]) => {
      if (!created) {
        res.json({ msg: 'Email is already used' });
        return false;
      }
      res.json({ msg: 'User created', user });
    });
  } catch (error) {
    console.log(error);
    res.json('Something went wrong');
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ['id', 'name', 'email', 'roles'],
    });
    res.json(users);
  } catch (error) {
    console.log(error);
    res.json('Something went wrong');
  }
};

export const Register = async (req, res) => {
  createUserEngine(req, res, 'member');
};

export const RegisterAdmin = async (req, res) => {
  createUserEngine(req, res, 'admin');
};

export const Login = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        email: req.body.email,
      },
    })
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ msg: 'Wrong Email or Password' });
    const userId = user[0].id;
    const name = user[0].name;
    const email = user[0].email;
    const roles = user[0].roles;
    const accessToken = jwt.sign({ userId, name, email, roles }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1d',
    });
    const refreshToken = jwt.sign({ userId, name, email, roles }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '1d',
    });
    await Users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ msg: 'login success', accessToken, refreshToken });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: 'Wrong Email or Password' });
  }
};

export const whoAmI = async (req, res) => {
  res.json({ profile: req.auth });
};

export const Logout = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken === undefined ? req.cookies.refreshToken : req.body.refreshToken;
    if (!refreshToken) return res.status(204).send('null');
    const user = await Users.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!user[0]) return res.status(204).send('notfound');
    const userId = user[0].id;
    await Users.update(
      { refresh_token: null },
      {
        where: {
          id: userId,
        },
      }
    );
    res.clearCookie('refreshToken');
    return res.status(200).json('Log out success');
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: 'Something went wrong' });
  }
};
