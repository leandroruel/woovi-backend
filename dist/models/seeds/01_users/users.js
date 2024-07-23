import { encryptPassword } from 'helpers/password';
import { Types } from 'mongoose';
const seed = async () => ({
    name: 'Jhon Doe',
    email: 'jhon.doe@officeman.com',
    password: await encryptPassword('Senha123-'),
    gender: 'Male',
    birthdate: '1988-08-23',
    created_at: new Date(),
    updated_at: new Date(),
    role: new Types.ObjectId('5e606408dc8aec3040688a86')
});
module.exports = seed();
