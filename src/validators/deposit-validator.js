const Joi = require("joi");

const depositSchema = Joi.object({
    amount: Joi.number().required(),
    user_id: Joi.number()
}).options({ stripUnknown: true }); 

exports.depositSchema = depositSchema;

const topupSchema = Joi.object({
    quantity: Joi.number(),
    user_id: Joi.number()
})

exports.topupSchema = topupSchema