import { createSwaggerSpec } from 'next-swagger-doc';

const apiConfig = {
    openapi: '3.0.0',
    info: {
        title: 'Leave Management API',
        version: '1.0.0',
        description: 'API for managing employee leave requests',
        contact: {
            name: 'API Support',
            email: 'support@example.com',
        },
    },
    servers: [
        {
            url: 'http://localhost:3000/api',
            description: 'Development server',
        },
        {
            url: 'https://your-production-domain.com/api',
            description: 'Production server',
        },
    ],
    components: {
        securitySchemes: {
            userIdHeader: {
                type: 'apiKey',
                in: 'header',
                name: 'user-id',
                description: 'User ID header for authentication',
            },
        },
        schemas: {
            Employee: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    userId: { type: 'integer' },
                    name: { type: 'string' },
                    email: { type: 'string' },
                },
            },
            Leave: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    employeeId: { type: 'integer' },
                    startDate: { type: 'string', format: 'date' },
                    endDate: { type: 'string', format: 'date' },
                    reason: { type: 'string' },
                    type: { type: 'string', enum: ['VACATION', 'SICK', 'PERSONAL', 'OTHER'] },
                    status: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED'] },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
            },
            LeaveInput: {
                type: 'object',
                required: ['startDate', 'endDate', 'reason', 'type'],
                properties: {
                    startDate: { type: 'string', format: 'date' },
                    endDate: { type: 'string', format: 'date' },
                    reason: { type: 'string' },
                    type: { type: 'string', enum: ['VACATION', 'SICK', 'PERSONAL', 'OTHER'] },
                },
            },
            LeaveUpdateInput: {
                type: 'object',
                required: ['id'],
                properties: {
                    id: { type: 'integer' },
                    startDate: { type: 'string', format: 'date' },
                    endDate: { type: 'string', format: 'date' },
                    reason: { type: 'string' },
                    type: { type: 'string', enum: ['VACATION', 'SICK', 'PERSONAL', 'OTHER'] },
                },
            },
            Error: {
                type: 'object',
                properties: {
                    error: { type: 'string' },
                },
            },
            Success: {
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                },
            },
        },
    },
    security: [
        {
            userIdHeader: [],
        },
    ],
};

export const getSwaggerSpec = () => {
    const spec = createSwaggerSpec({
        definition: apiConfig,
        apiFolder: 'app/api', // Path to API folder
    });

    return spec;
};