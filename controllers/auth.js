const Joi = require('joi');
const authService = require('../services/Auth');
const { registerSchema, loginSchema } = require('../validations/user');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const formattedErrors = error.details.map(detail => detail.message);
      return res.status(400).json({ errors: formattedErrors });
    }
    next();
  };
}

const register = async (req, res) => {
  validateRequest(registerSchema, req, res, async () => {
    try {
      const { user, token } = await authService.register(req.body);
      res.status(201).json({ user, token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const checkUser = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { register, login, checkUser };