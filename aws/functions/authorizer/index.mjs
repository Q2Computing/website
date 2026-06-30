import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

const ssm = new SSMClient({ region: 'us-east-1' });

const getOwnerToken = async () => {
  const res = await ssm.send(new GetParameterCommand({
    Name: '/q2/workspace/owner-token',
    WithDecryption: true,
  }));
  return res.Parameter.Value;
};

export const handler = async (event) => {
  const token = event.queryStringParameters?.token;
  if (!token) return deny(event);

  const ownerToken = await getOwnerToken();

  if (token === ownerToken) {
    return allow(event, 'owner');
  }

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
    Statement: [{ Action: 'execute-api:Invoke', Effect: 'Allow', Resource: event.methodArn }],
  },
  context: { principalId },
});

const deny = (event) => ({
  principalId: 'unauthorized',
  policyDocument: {
    Version: '2012-10-17',
    Statement: [{ Action: 'execute-api:Invoke', Effect: 'Deny', Resource: event.methodArn }],
  },
});
