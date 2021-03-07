import { generateApolloClient } from '@deepcase/hasura/client';

export const client = generateApolloClient({
  client: 'atomic-models-hasura-permissions-test',
  path: `${process.env.HASURA_PATH}/v1/graphql`,
  ssl: !!+process.env.HASURA_SSL,
  secret: process.env.HASURA_SECRET,
  ws: false,
});
