require('dotenv').config();

import Debug from 'debug';
import { gql } from 'apollo-boost';
import Chance from 'chance';
import { client } from './client';

const chance = new Chance();
const debug = Debug('deepcase:atomic-models-hasura-permissions:test');

const SCHEMA = process.env.MIGRATIONS_SCHEMA || 'public';
const MP_TABLE = process.env.MIGRATIONS_MP_TABLE || 'mp_example__nodes__mp';
const GRAPH_TABLE = process.env.MIGRATIONS_GRAPH_TABLE || 'mp_example__nodes';

const DELAY = +process.env.DELAY || 0;
const delay = time => new Promise(res => setTimeout(res, time));

beforeAll(async () => {
  jest.setTimeout(1000000);
}); 
afterAll(async () => {
});
