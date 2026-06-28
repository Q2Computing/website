import { DynamoDBClient, DeleteItemCommand } from '@aws-sdk/client-dynamodb';

const db = new DynamoDBClient({});

export const handler = async (event) => {
  const connectionId = event.requestContext.connectionId;

  await db.send(new DeleteItemCommand({
    TableName: process.env.TABLE_NAME,
    Key: { connectionId: { S: connectionId } },
  }));

  return { statusCode: 200, body: 'Disconnected' };
};
