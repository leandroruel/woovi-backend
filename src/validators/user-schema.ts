import Joi from 'joi'

const validateUserCreate = Joi.object().keys({
  user: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    taxId: Joi.string()
      .pattern(
        new RegExp(
          '([0-9]{2}[.]?[0-9]{3}[.]?[0-9]{3}[/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[.]?[0-9]{3}[.]?[0-9]{3}[-]?[0-9]{2})'
        )
      )
      .required(),
    gender: Joi.string().valid('Male', 'Female').required(),
    birthdate: Joi.date().required(),
    role: Joi.string().valid('Admin', 'User').required()
  })
})

const validateUserUpdate = Joi.object().keys({
  user: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string(),
    taxId: Joi.string().pattern(
      new RegExp(
        '([0-9]{2}[.]?[0-9]{3}[.]?[0-9]{3}[/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[.]?[0-9]{3}[.]?[0-9]{3}[-]?[0-9]{2})'
      )
    ),
    gender: Joi.string().valid('Male', 'Female'),
    birthdate: Joi.date(),
    role: Joi.string().valid('Admin', 'User')
  })
})

export { validateUserCreate, validateUserUpdate }
