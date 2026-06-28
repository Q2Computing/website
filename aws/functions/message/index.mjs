import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';

const db = new DynamoDBClient({});

export const handler = async (event) => {
  const connectionId = event.requestContext.connectionId;
  const principalId = event.requestContext.authorizer?.principalId ?? 'unknown';
  const isOwner = principalId === 'owner';
  const apiClient = new ApiGatewayManagementApiClient({ endpoint: process.env.API_ENDPOINT });

  let body;
  try {
    body = JSON.parse(event.body ?? '{}');
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const message = {
    from: isOwner ? 'owner' : principalId,
    text: body.text ?? '',
    timestamp: new Date().toISOString(),
  };

  // Owner broadcasts to all connected clients, or to a specific client
  // Clients can only send messages to the owner
  const { Items: connections } = await db.send(new ScanCommand({
    TableName: process.env.TABLE_NAME,
  }));

  const targets = isOwner
    ? connections.filter(c => !c.isOwner.BOOL && (!body.to || c.principalId.S === body.to))
    : connections.filter(c => c.isOwner.BOOL);

  await Promise.allSettled(
    targets.map(c =>
      apiClient.send(new PostToConnectionCommand({
        ConnectionId: c.connectionId.S,
        Data: JSON.stringify(message),
      }))
    )
  );

  return { statusCode: 200, body: 'Message sent' };
};
