import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

const db = new DynamoDBClient({});

export const handler = async (event) => {
  const connectionId = event.requestContext.connectionId;
  const principalId = event.requestContext.authorizer?.principalId ?? 'unknown';
  const isOwner = principalId === 'owner';
  const ttl = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24h TTL

  await db.send(new PutItemCommand({
    TableName: process.env.TABLE_NAME,
    Item: {
      connectionId: { S: connectionId },
      principalId:  { S: principalId },
      isOwner:      { BOOL: isOwner },
      connectedAt:  { S: new Date().toISOString() },
      ttl:          { N: String(ttl) },
    },
  }));

  return { statusCode: 200, body: 'Connected' };
};
