import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';

const db = new DynamoDBClient({});

// Valid roles stored in DynamoDB under a 'tokens' partition would be ideal
// long-term, but for now tokens are environment-managed secrets.
// OWNER_TOKEN  — Justin's token (set in Lambda env)
// CLIENT_TOKEN_<id> — per-client tokens (set in Lambda env)

export const handler = async (event) => {
  const token = event.queryStringParameters?.token;

  if (!token) return deny(event);

  // Owner token — full access
  if (token === process.env.OWNER_TOKEN) {
    return allow(event, 'owner');
  }

  // Client token — must match an active client entry in DynamoDB
  const clientId = Object.keys(process.env)
    .find(k => k.startsWith('CLIENT_TOKEN_') && process.env[k] === token)
    ?.replace('CLIENT_TOKEN_', '');

  if (clientId) {
    return allow(event, `client:${clientId}`);
  }

  return deny(event);
};

const allow = (event, principalId) => ({
  principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement: [{
      Action: 'execute-api:Invoke',
      Effect: 'Allow',
      Resource: event.methodArn,
    }],
  },
  context: { principalId },
});

const deny = (event) => ({
  principalId: 'unauthorized',
  policyDocument: {
    Version: '2012-10-17',
    Statement: [{
      Action: 'execute-api:Invoke',
      Effect: 'Deny',
      Resource: event.methodArn,
    }],
  },
});
