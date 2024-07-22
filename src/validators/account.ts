import Joi from "joi";

const validateTransfer = Joi.object().keys({
  transferAmountPayload: Joi.object().keys({
    senderId: Joi.string().required(),
    receiverId: Joi.string().required(),
    amount: Joi.number().required(),
    idempotencyId: Joi.string().required(),
  }),
});

export { validateTransfer };
