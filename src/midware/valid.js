const Joi = require('joi');

const schemas = {
    register: Joi.object({
        first_name: Joi.string().required().min(2).max(50).messages({
            'string.empty': 'First name is required',
            'string.min': 'First name must be at least 2 characters',
            'string.max': 'First name cannot exceed 50 characters'
        }),
        last_name: Joi.string().allow('').optional().max(50),
        email: Joi.string().email().required().messages({
            'string.email': 'Please provide a valid email',
            'string.empty': 'Email is required'
        }),
        phone: Joi.string().pattern(/^[0-9+\-\s]{10,20}$/).required().messages({
            'string.pattern.base': 'Please provide a valid phone number',
            'string.empty': 'Phone number is required'
        }),
        password: Joi.string().min(6).required().messages({
            'string.min': 'Password must be at least 6 characters',
            'string.empty': 'Password is required'
        }),
        user_type: Joi.string().valid('student', 'professional', 'owner', 'admin').default('student'),
        institution_id: Joi.when('user_type', {
            is: 'student',
            then: Joi.number().integer().required(),
            otherwise: Joi.optional()
        })
    }),

    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),

    updateProfile: Joi.object({
        first_name: Joi.string().min(2).max(50),
        last_name: Joi.string().max(50),
        phone: Joi.string().pattern(/^[0-9+\-\s]{10,20}$/),
        institution_id: Joi.number().integer()
    }),

    changePassword: Joi.object({
        current_password: Joi.string().required(),
        new_password: Joi.string().min(6).required()
    })
};

/**
 * Generic validation middleware
 * @param {string} schemaName 
 */
const validate = (schemaName) => {
    return (req, res, next) => {
        const schema = schemas[schemaName];
        
        if (!schema) {
            return res.status(500).json({
                success: false,
                error: 'Validation schema not found'
            });
        }

        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                errors
            });
        }

        req.body = value;
        next();
    };
};

module.exports = {
    validate
};