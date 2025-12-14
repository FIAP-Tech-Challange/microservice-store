import {
  DynamoDBDocumentClient,
  PutCommand,
  DeleteCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';

import { StoreDataSource } from './store.dataSource';
import {
  StoreDataSourceDTO,
  StoreWithTotemsDataSourceDTO,
  TotemDataSourceDTO,
} from 'src/common/dataSource/dataSource.dto';

type StoreItem = {
  PK: string;
  SK: string;
  cnpj: string;
  email: string;
  name: string;
  fantasy_name: string;
  phone: string;
  salt: string;
  password_hash: string;
  created_at: string;
  entityType: string;
};

type TotemItem = {
  PK: string;
  SK: string;
  totem_id: string;
  name: string;
  token_access: string;
  created_at: string;
  entityType: string;
};

type DynamoItem = StoreItem | TotemItem;

export class DynamoStoreDataSource implements StoreDataSource {
  constructor(
    private readonly tableName: string,
    private readonly ddb: DynamoDBDocumentClient,
  ) {}

  async addStore(store: StoreDataSourceDTO): Promise<void> {
    const cmd = new PutCommand({
      TableName: this.tableName,
      Item: {
        PK: `STORE#${store.id}`,
        SK: 'METADATA',
        entityType: 'STORE',

        cnpj: store.cnpj,
        email: store.email,
        name: store.name,
        fantasy_name: store.fantasy_name,
        phone: store.phone,
        salt: store.salt,
        password_hash: store.password_hash,
        created_at: store.created_at,

        nameNormalized: this.normalizeName(store.name),
        emailNormalized: store.email.toLocaleLowerCase(),
      },
      ConditionExpression: 'attribute_not_exists(PK)',
    });

    await this.ddb.send(cmd);
  }

  async findStoreById(
    id: string,
  ): Promise<StoreWithTotemsDataSourceDTO | null> {
    const result = await this.ddb.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: {
          ':pk': `STORE#${id}`,
        },
      }),
    );

    if (!result.Items?.length) return null;

    return this.mapStoreWithTotems(result.Items as DynamoItem[]);
  }

  async findStoreByCnpj(cnpj: string): Promise<StoreDataSourceDTO | null> {
    const result = await this.ddb.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'GSI_CNPJ',
        KeyConditionExpression: 'cnpj = :cnpj',
        ExpressionAttributeValues: {
          ':cnpj': cnpj,
        },
      }),
    );

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    return {
      id: String(result.Items[0].id),
      cnpj: String(result.Items[0].cnpj),
      email: String(result.Items[0].email),
      name: String(result.Items[0].name),
      fantasy_name: String(result.Items[0].fantasy_name),
      phone: String(result.Items[0].phone),
      salt: String(result.Items[0].salt),
      password_hash: String(result.Items[0].password_hash),
      created_at: String(result.Items[0].created_at),
    };
  }

  async findStoreByEmail(email: string): Promise<StoreDataSourceDTO | null> {
    const result = await this.ddb.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'GSI_EMAIL',
        KeyConditionExpression: 'emailNormalized = :email',
        ExpressionAttributeValues: {
          ':email': email.toLowerCase(),
        },
      }),
    );

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    const item = result.Items[0];

    return {
      id: String(item.id),
      cnpj: String(item.cnpj),
      email: String(item.email),
      name: String(item.name),
      fantasy_name: String(item.fantasy_name),
      phone: String(item.phone),
      salt: String(item.salt),
      password_hash: String(item.password_hash),
      created_at: String(item.created_at),
    };
  }

  async findStoreByName(name: string): Promise<StoreDataSourceDTO | null> {
    const result = await this.ddb.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'GSI_NAME',
        KeyConditionExpression: 'nameNormalized = :name',
        ExpressionAttributeValues: {
          ':name': this.normalizeName(name),
        },
      }),
    );

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    const item = result.Items[0];

    return {
      id: String(item.id),
      cnpj: String(item.cnpj),
      email: String(item.email),
      name: String(item.name),
      fantasy_name: String(item.fantasy_name),
      phone: String(item.phone),
      salt: String(item.salt),
      password_hash: String(item.password_hash),
      created_at: String(item.created_at),
    };
  }

  async createTotem(totem: TotemDataSourceDTO): Promise<void> {
    await this.ddb.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          PK: `STORE#${totem.store_id}`,
          SK: `TOTEM#${totem.token_access}`,
          entityType: 'TOTEM',
          totem_id: totem.id,
          name: totem.name,
          token_access: totem.token_access,
          created_at: totem.created_at,
        },
        ConditionExpression: 'attribute_not_exists(SK)',
      }),
    );
  }

  async deleteTotem(totem: TotemDataSourceDTO): Promise<void> {
    await this.ddb.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: {
          PK: `STORE#${totem.store_id}`,
          SK: `TOTEM#${totem.token_access}`,
        },
      }),
    );
  }

  async findTotemByAccessToken(
    accessToken: string,
  ): Promise<TotemDataSourceDTO | null> {
    const result = await this.ddb.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'GSI_TOTEM',
        KeyConditionExpression: 'totemKey = :token',
        ExpressionAttributeValues: {
          ':token': accessToken,
        },
      }),
    );

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    return {
      id: String(result.Items[0].totem_id),
      store_id: String(result.Items[0].PK).replace('STORE#', ''),
      name: String(result.Items[0].name),
      token_access: String(result.Items[0].token_access),
      created_at: String(result.Items[0].created_at),
    };
  }

  private normalizeName(name: string) {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_');
  }

  private mapStoreWithTotems(
    items: DynamoItem[],
  ): StoreWithTotemsDataSourceDTO {
    const store = items.find(
      (item) => item.entityType === 'STORE',
    ) as StoreItem;

    const totems = items.filter(
      (item) => item.entityType === 'TOTEM',
    ) as TotemItem[];

    const storeId = String(store.PK).replace('STORE#', '');

    return {
      id: storeId,
      cnpj: String(store.cnpj),
      email: String(store.email),
      name: String(store.name),
      fantasy_name: String(store.fantasy_name),
      phone: String(store.phone),
      salt: String(store.salt),
      password_hash: String(store.password_hash),
      created_at: String(store.created_at),
      totems: totems.map((totem) => ({
        store_id: storeId,
        id: String(totem.SK).replace('TOTEM#', ''),
        name: String(totem.name),
        token_access: String(totem.token_access),
        created_at: String(totem.created_at),
      })),
    };
  }
}
