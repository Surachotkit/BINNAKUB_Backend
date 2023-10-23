const Joi = require("joi");

const addQuantitySchema = Joi.object({
    quantity: Joi.number().required(),
    coin_name: Joi.string()
})

exports.addQuantitySchema = addQuantitySchema;

const addCoinSchema = Joi.object({
    coin_name: Joi.string(),
    coin_list_id: Joi.number(),

})

exports.addCoinSchema = addCoinSchema;

const deleteSchema = Joi.object({
    coin_list_id: Joi.number()
})

exports.deleteSchema = deleteSchema