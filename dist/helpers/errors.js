import { GraphQLError } from 'graphql';
import { UNAUTHENTICATED, UNAUTHORIZED } from './constants';
export class AuthenticationError extends GraphQLError {
    constructor(message) {
        super(message);
        this.extensions.code = UNAUTHENTICATED;
    }
}
export class AuthorizationError extends GraphQLError {
    constructor(message) {
        super(message);
        this.extensions.code = UNAUTHORIZED;
    }
}
export const formatGraphQLError = (error) => {
    if (error && error.name === 'MongoServerError') {
        const errorMessage = error.message || 'Sorry, something went wrong';
        throw new GraphQLError(errorMessage, error);
    }
    throw new GraphQLError(error.message, error);
};
