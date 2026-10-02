// Backend for philipknott.net/hike. Deployed as the `hike-poll` Lambda (Function URL)
// with a `hike-poll` DynamoDB table (pk = poll id, sk = lowercased voter name).
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

const TABLE = process.env.TABLE_NAME;
const POLL_ID = 'hike-2026-10';
const MAX_VOTERS = 100;
const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const respond = (status, body) => ({
  statusCode: status,
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(body),
});

const queryItems = async () => {
  const { Items = [] } = await db.send(
    new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: { ':pk': POLL_ID },
    })
  );
  return Items.sort((a, b) => a.created.localeCompare(b.created));
};

const toVotes = (items) =>
  items.map((item) => ({ name: item.name, dates: item.dates, updated: item.updated }));

const saveVote = async (body) => {
  const name = String(body?.name ?? '').trim().slice(0, 40);
  if (!name) return respond(400, { ok: false, error: 'Name is required.' });
  const dates = (Array.isArray(body.dates) ? body.dates : [])
    .map(String)
    .filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date))
    .slice(0, 31);

  const items = await queryItems();
  const existing = items.find((item) => item.sk === name.toLowerCase());
  if (!existing && items.length >= MAX_VOTERS) {
    return respond(400, { ok: false, error: 'Poll is full.' });
  }

  const now = new Date().toISOString();
  await db.send(
    new PutCommand({
      TableName: TABLE,
      Item: {
        pk: POLL_ID,
        sk: name.toLowerCase(),
        name,
        dates,
        created: existing?.created ?? now,
        updated: now,
      },
    })
  );
  return respond(200, { ok: true, votes: toVotes(await queryItems()) });
};

export const handler = async (event) => {
  try {
    const method = event.requestContext?.http?.method;
    if (method === 'GET') return respond(200, { ok: true, votes: toVotes(await queryItems()) });
    if (method === 'POST') {
      const raw = event.isBase64Encoded ? Buffer.from(event.body ?? '', 'base64').toString() : event.body;
      return await saveVote(JSON.parse(raw || '{}'));
    }
    return respond(405, { ok: false, error: 'Method not allowed.' });
  } catch (error) {
    console.error(error);
    return respond(500, { ok: false, error: 'Something went wrong.' });
  }
};
