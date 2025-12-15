import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  DeleteCommand,
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
  nameNormalized: string;
  emailNormalized: string;
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

  async saveStore(store: StoreWithTotemsDataSourceDTO): Promise<void> {
    const existing = await this.findStoreById(store.id);

    const toDelete = this.diffTotems(existing, store);
    const toUpsert = store.totems;

    for (const totem of toDelete) {
      await this.deleteTotem(totem);
    }

    await this.ddb.send(
      new PutCommand({
        TableName: this.tableName,
        Item: this.mapStoreToItem(store),
      }),
    );

    for (const totem of toUpsert) {
      await this.ddb.send(
        new PutCommand({
          TableName: this.tableName,
          Item: this.mapTotemToItem(totem),
        }),
      );
    }
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

  async findTotemByAccessToken(
    accessToken: string,
  ): Promise<TotemDataSourceDTO | null> {
    const result = await this.ddb.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'GSI_TOTEM',
        KeyConditionExpression: 'token_access = :token',
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

  private async deleteTotem(totem: TotemDataSourceDTO): Promise<void> {
    await this.ddb.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: {
          PK: `STORE#${totem.store_id}`,
          SK: `TOTEM#${totem.id}`,
        },
      }),
    );
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

  private mapStoreToItem(store: StoreDataSourceDTO): StoreItem {
    return {
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
    };
  }

  private mapTotemToItem(totem: TotemDataSourceDTO): TotemItem {
    return {
      PK: `STORE#${totem.store_id}`,
      SK: `TOTEM#${totem.id}`,
      entityType: 'TOTEM',
      totem_id: totem.id,
      name: totem.name,
      token_access: totem.token_access,
      created_at: totem.created_at,
    };
  }

  private diffTotems(
    existing: StoreWithTotemsDataSourceDTO | null,
    incoming: StoreWithTotemsDataSourceDTO,
  ): TotemDataSourceDTO[] {
    if (!existing) return [];

    const incomingKeys = new Set(incoming.totems.map((t) => t.token_access));

    return existing.totems.filter((t) => !incomingKeys.has(t.token_access));
  }
}

/**
 * DynamoDB – Single Table (Stores)
 *
 * Primary Key:
 *   - PK : string
 *   - SK : string
 *
 * Entities:
 *
 * Store (Aggregate Root)
 *   PK = STORE#{storeId}
 *   SK = STORE
 *
 * Totem (Child Entity)
 *   PK = STORE#{storeId}
 *   SK = TOTEM#{totemId}
 *
 * Global Secondary Indexes:
 *
 * - GSI_EMAIL
 *     PK: emailNormalized
 *     Used to find Store by email
 *
 * - GSI_CNPJ
 *     PK: cnpj
 *     Used to find Store by CNPJ
 *
 * - GSI_NAME
 *     PK: nameNormalized
 *     Used to find Store by name
 *
 * - GSI_TOTEM
 *     PK: token_access
 *     Used to authenticate Totem and resolve its Store
 *
 * Access Patterns:
 *
 * - Get Store by ID → returns Store + Totems
 * - Get Store by Email / CNPJ / Name
 * - Get Totem by access token
 *
 * Notes:
 * - Store is the aggregate root
 * - Totems only exist within a Store
 * - Persistence orchestration happens in the DataSource
 * - No transactions (academic scope)
 */
