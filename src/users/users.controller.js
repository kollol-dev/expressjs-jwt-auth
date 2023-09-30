const { getUser, getUserByEmail, createUser, createSecret, createRefreshToken, comparePassword, verifyToken } = require("./users.service")
const { signUpValidator, loginValidator } = require('./users.validator')
const formatErrors = require('../helpers/formatError')
const hashPassword = require('../helpers/hashPassword')
const { omitFieldsFromObject } = require('../helpers/omitHiddenFields')

const hiddenFields = ['password']

module.exports = {
  signUp: async (req, res) => {
    const args = req.body;
    const validateArgs = signUpValidator.validate(args);
    if (validateArgs.error) {
      return res.status(422).json({
        errors: formatErrors(validateArgs.error.details),
      });
    }

    try {
      const isEmailDuplicate = await getUserByEmail(args)

      if (isEmailDuplicate)
        return res.status(401).json({
          message: "Email already exists",
        });

      args.password = await hashPassword(args.password)
      const user = await createUser(args)

      if (!user)
        return res.status(400).json({
          message: "Something went wrong!",
        });

      const [accessToken, refreshToken] = await Promise.all([
        createSecret(user),
        createRefreshToken(user)
      ])

      return res
        .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
        .status(201).json({
          user: omitFieldsFromObject(user.toJSON(), hiddenFields),
          accessToken,
          refreshToken,
          message: "Signup successful",
        });

    } catch (error) {
      console.error(error);
      return res.status(400).json({
        message: "Something went wrong!",
      });
    }
  },

  login: async (req, res) => {
    const args = req.body;
    const validateArgs = loginValidator.validate(args);
    if (validateArgs.error) {
      return res.status(422).json({
        errors: formatErrors(validateArgs.error.details),
      });
    }

    try {
      const user = await getUserByEmail(args)
      if (!user)
        return res.status(401).json({
          message: "Something went wrong or Invalid Password",
        });

      var passwordIsValid = await comparePassword(user, args.password);
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Something went wrong or Invalid Password!"
        });
      }

      const [accessToken, refreshToken] = await Promise.all([
        createSecret(user),
        createRefreshToken(user)
      ])

      return res
        .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
        .status(201).json({
          user: omitFieldsFromObject(user.toJSON(), hiddenFields),
          accessToken,
          refreshToken,
          message: "Login successful",
        });

    } catch (error) {
      console.error(error);
      return res.status(400).json({
        message: "Something went wrong!",
      });
    }
  },

  refreshToken: async (req, res) => {
    const refresh_token = req.body.refresh_token || false;
    if (!refresh_token) {
      return res.status(401).json({ message: 'Access Denied. No refresh token provided.' });
    }

    try {
      const decoded = verifyToken({ token: refresh_token });
      const accessToken = await createSecret({ ...decoded })

      return res.header('Authorization', accessToken).json({ user: decoded, accessToken });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: 'Invalid refresh token.' });
    }
  },

  getAuthUser: async (req, res) => {
    const { _id = null, email = null } = req.user;
    try {
      const user = await getUser({ _id, email })
      if (!user) {
        return res.status(401).json({
          message: "Unknown credentials or Unauthenticated"
        });
      }
      return res.json({ user });
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Something went wrong.' });
    }
  }
};
