"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const api_1 = require("@deepcase/hasura/api");
const sql_1 = require("@deepcase/hasura/sql");
const trigger_1 = require("../trigger");
const api = new api_1.HasuraApi({
    path: process.env.MIGRATIONS_HASURA_PATH,
    ssl: !!+process.env.MIGRATIONS_HASURA_SSL,
    secret: process.env.MIGRATIONS_HASURA_SECRET,
});
const SCHEMA = process.env.MIGRATIONS_SCHEMA || 'public';
const MP_TABLE = process.env.MIGRATIONS_MP_TABLE || 'mp_example__nodes__mp';
const GRAPH_TABLE = process.env.MIGRATIONS_GRAPH_TABLE || 'mp_example__nodes';
const trigger = trigger_1.Trigger({
    mpTableName: MP_TABLE,
    graphTableName: GRAPH_TABLE,
});
exports.up = () => __awaiter(void 0, void 0, void 0, function* () {
    yield api.sql(sql_1.sql `
    CREATE TABLE ${SCHEMA}."${GRAPH_TABLE}" (id integer, from_id integer, to_id integer, type_id integer);
    CREATE SEQUENCE nodes_id_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
    ALTER SEQUENCE nodes_id_seq OWNED BY ${SCHEMA}."${GRAPH_TABLE}".id;
    ALTER TABLE ONLY ${SCHEMA}."${GRAPH_TABLE}" ALTER COLUMN id SET DEFAULT nextval('nodes_id_seq'::regclass);
  `);
    yield api.sql(sql_1.sql `
    CREATE TABLE ${SCHEMA}."${MP_TABLE}" (id integer,item_id integer,path_item_id integer,path_item_depth integer,root_id integer,position_id text DEFAULT ${SCHEMA}.gen_random_uuid());
    CREATE SEQUENCE ${SCHEMA}.${MP_TABLE}_id_seq
    AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
    ALTER SEQUENCE ${SCHEMA}.${MP_TABLE}_id_seq OWNED BY ${SCHEMA}.${MP_TABLE}.id;
    ALTER TABLE ONLY ${SCHEMA}.${MP_TABLE} ALTER COLUMN id SET DEFAULT nextval('${SCHEMA}.${MP_TABLE}_id_seq'::regclass);
  `);
    yield api.query({
        type: 'track_table',
        args: {
            schema: SCHEMA,
            name: GRAPH_TABLE,
        },
    });
    yield api.query({
        type: 'create_select_permission',
        args: {
            table: GRAPH_TABLE,
            role: 'guest',
            permission: {
                columns: '*',
                filter: {},
                limit: 999,
                allow_aggregations: true
            }
        }
    });
    yield api.query({
        type: 'create_select_permission',
        args: {
            table: GRAPH_TABLE,
            role: 'user',
            permission: {
                columns: '*',
                filter: {},
                limit: 999,
                allow_aggregations: true
            }
        }
    });
    yield api.query({
        type: 'track_table',
        args: {
            schema: SCHEMA,
            name: MP_TABLE,
        },
    });
    yield api.query({
        type: 'create_select_permission',
        args: {
            table: MP_TABLE,
            role: 'guest',
            permission: {
                columns: '*',
                filter: {},
                limit: 999,
                allow_aggregations: true
            }
        }
    });
    yield api.query({
        type: 'create_select_permission',
        args: {
            table: MP_TABLE,
            role: 'user',
            permission: {
                columns: '*',
                filter: {},
                limit: 999,
                allow_aggregations: true
            }
        }
    });
    yield api.query({
        type: 'create_array_relationship',
        args: {
            table: GRAPH_TABLE,
            name: '_by_item',
            using: {
                manual_configuration: {
                    remote_table: {
                        schema: SCHEMA,
                        name: MP_TABLE,
                    },
                    column_mapping: {
                        id: 'item_id',
                    },
                },
            },
        },
    });
    yield api.query({
        type: 'create_array_relationship',
        args: {
            table: GRAPH_TABLE,
            name: '_by_path_item',
            using: {
                manual_configuration: {
                    remote_table: {
                        schema: SCHEMA,
                        name: MP_TABLE,
                    },
                    column_mapping: {
                        id: 'path_item_id',
                    },
                },
            },
        },
    });
    yield api.query({
        type: 'create_array_relationship',
        args: {
            table: GRAPH_TABLE,
            name: '_by_root',
            using: {
                manual_configuration: {
                    remote_table: {
                        schema: SCHEMA,
                        name: MP_TABLE,
                    },
                    column_mapping: {
                        id: 'root_id',
                    },
                },
            },
        },
    });
    yield api.query({
        type: 'create_object_relationship',
        args: {
            table: MP_TABLE,
            name: 'item',
            using: {
                manual_configuration: {
                    remote_table: {
                        schema: SCHEMA,
                        name: GRAPH_TABLE,
                    },
                    column_mapping: {
                        item_id: 'id',
                    },
                },
            },
        },
    });
    yield api.query({
        type: 'create_object_relationship',
        args: {
            table: MP_TABLE,
            name: 'path_item',
            using: {
                manual_configuration: {
                    remote_table: {
                        schema: SCHEMA,
                        name: GRAPH_TABLE,
                    },
                    column_mapping: {
                        path_item_id: 'id',
                    },
                },
            },
        },
    });
    yield api.query({
        type: 'create_object_relationship',
        args: {
            table: MP_TABLE,
            name: 'root',
            using: {
                manual_configuration: {
                    remote_table: {
                        schema: SCHEMA,
                        name: GRAPH_TABLE,
                    },
                    column_mapping: {
                        root_id: 'id',
                    },
                },
            },
        },
    });
    yield api.query({
        type: 'create_array_relationship',
        args: {
            table: MP_TABLE,
            name: 'by_item',
            using: {
                manual_configuration: {
                    remote_table: {
                        schema: SCHEMA,
                        name: MP_TABLE,
                    },
                    column_mapping: {
                        item_id: 'item_id',
                    },
                },
            },
        },
    });
    yield api.query({
        type: 'create_array_relationship',
        args: {
            table: MP_TABLE,
            name: 'by_path_item',
            using: {
                manual_configuration: {
                    remote_table: {
                        schema: SCHEMA,
                        name: MP_TABLE,
                    },
                    column_mapping: {
                        path_item_id: 'path_item_id',
                    },
                },
            },
        },
    });
    yield api.query({
        type: 'create_array_relationship',
        args: {
            table: MP_TABLE,
            name: 'by_position',
            using: {
                manual_configuration: {
                    remote_table: {
                        schema: SCHEMA,
                        name: MP_TABLE,
                    },
                    column_mapping: {
                        position_id: 'position_id',
                    },
                },
            },
        },
    });
    yield api.query({
        type: 'create_array_relationship',
        args: {
            table: MP_TABLE,
            name: 'by_root',
            using: {
                manual_configuration: {
                    remote_table: {
                        schema: SCHEMA,
                        name: MP_TABLE,
                    },
                    column_mapping: {
                        root_id: 'root_id',
                    },
                },
            },
        },
    });
    yield api.sql(trigger.upFunctionIsRoot());
    yield api.sql(trigger.upFunctionWillRoot());
    yield api.sql(trigger.upFunctionInsertNode());
    yield api.sql(trigger.upFunctionDeleteNode());
    yield api.sql(trigger.upTriggerDelete());
    yield api.sql(trigger.upTriggerInsert());
});
exports.down = () => __awaiter(void 0, void 0, void 0, function* () {
    yield api.sql(trigger.downTriggerDelete());
    yield api.sql(trigger.downTriggerInsert());
    yield api.sql(trigger.downFunctionInsertNode());
    yield api.sql(trigger.downFunctionDeleteNode());
    yield api.sql(trigger.downFunctionIsRoot());
    yield api.sql(trigger.downFunctionWillRoot());
    yield api.query({
        type: 'drop_relationship',
        args: {
            table: GRAPH_TABLE,
            relationship: '_by_item',
        },
    });
    yield api.query({
        type: 'drop_relationship',
        args: {
            table: GRAPH_TABLE,
            relationship: '_by_path_item',
        },
    });
    yield api.query({
        type: 'drop_relationship',
        args: {
            table: GRAPH_TABLE,
            relationship: '_by_root',
        },
    });
    yield api.query({
        type: 'drop_relationship',
        args: {
            table: MP_TABLE,
            relationship: 'item',
        },
    });
    yield api.query({
        type: 'drop_relationship',
        args: {
            table: MP_TABLE,
            relationship: 'path_item',
        },
    });
    yield api.query({
        type: 'drop_relationship',
        args: {
            table: MP_TABLE,
            relationship: 'root',
        },
    });
    yield api.query({
        type: 'drop_relationship',
        args: {
            table: MP_TABLE,
            relationship: 'by_item',
        },
    });
    yield api.query({
        type: 'drop_relationship',
        args: {
            table: MP_TABLE,
            relationship: 'by_path_item',
        },
    });
    yield api.query({
        type: 'drop_relationship',
        args: {
            table: MP_TABLE,
            relationship: 'by_position',
        },
    });
    yield api.query({
        type: 'drop_relationship',
        args: {
            table: MP_TABLE,
            relationship: 'by_root',
        },
    });
    yield api.query({
        type: 'untrack_table',
        args: {
            table: {
                schema: SCHEMA,
                name: MP_TABLE,
            },
        },
    });
    yield api.sql(sql_1.sql `
  DROP TABLE ${SCHEMA}."${MP_TABLE}";
  `);
    yield api.query({
        type: 'untrack_table',
        args: {
            table: {
                schema: SCHEMA,
                name: GRAPH_TABLE,
            },
        },
    });
    yield api.sql(sql_1.sql `
    DROP TABLE ${SCHEMA}."${GRAPH_TABLE}";
  `);
});
//# sourceMappingURL=1614936914534-test.js.map