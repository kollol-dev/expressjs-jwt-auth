const { getUserByEmail, createUser, createSecret, createRefreshToken, comparePassword } = require("./users.service")
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

      const [token, refreshToken] = await Promise.all([
        createSecret(user),
        createRefreshToken(user)
      ])

      return res
        .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
        .status(201).json({
          user: omitFieldsFromObject(user.toJSON(), hiddenFields),
          secret: token,
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

      const [token, refreshToken] = await Promise.all([
        createSecret(user),
        createRefreshToken(user)
      ])

      return res
        .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
        .status(201).json({
          user: omitFieldsFromObject(user.toJSON(), hiddenFields),
          secret: token,
          refreshToken,
          message: "Login successful",
        });

    } catch (error) {
      console.error(error);
      return res.status(400).json({
        message: "Something went wrong!",
      });
    }
  }
};
