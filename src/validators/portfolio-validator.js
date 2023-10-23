const Joi = require("joi");

const portfolioSchema = Joi.object({
    portfolio_id: Joi.number(),
    average_purchase_price:  Joi.number(),
    quantity: Joi.number(),
    profit_or_loss: Joi.number(),
    weight: Joi.number(),
    user_id: Joi.number(),
    coin_name: Joi.string(),
}).options({ stripUnknown: true }); // This line will remove unknown properties

exports.portfolioSchema = portfolioSchema;