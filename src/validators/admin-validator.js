const Joi = require("joi");

const addQuantitySchema = Joi.object({
    amount: Joi.number().required(),
    coin_list_id: Joi.number()
})

exports.addQuantitySchema = addQuantitySchema;

const deleteSchema = Joi.object({
    coin_list_id: Joi.number()
})

exports.deleteSchema = deleteSchema