import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { ResourceInvalidException } from 'src/common/exceptions/resourceInvalidException';
import { generateUUID } from 'src/core/common/utils/uuid.helper';

export class Totem {
  private _id: string;
  private _name: string;
  private _tokenAccess: string;
  private _createdAt: Date;
  private _storeId: string;

  private constructor(props: {
    id: string;
    name: string;
    tokenAccess: string;
    createdAt: Date;
    storeId: string;
  }) {
    this._id = props.id;
    this._name = props.name;
    this._tokenAccess = props.tokenAccess;
    this._createdAt = props.createdAt;
    this._storeId = props.storeId;

    this.validate();
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get tokenAccess() {
    return this._tokenAccess;
  }

  get createdAt() {
    return this._createdAt;
  }

  get storeId() {
    return this._storeId;
  }

  private validate() {
    if (!this.id) throw new ResourceInvalidException('Id is required');
    if (!this.name) throw new ResourceInvalidException('Name is required');
    if (!this.tokenAccess)
      throw new ResourceInvalidException('Token access is required');
    if (!this.createdAt)
      throw new ResourceInvalidException('Created at is required');
    if (!this.storeId)
      throw new ResourceInvalidException('Store ID is required');
  }

  static create(props: { name: string; storeId: string }): CoreResponse<Totem> {
    try {
      const totem = new Totem({
        id: generateUUID(),
        name: props.name,
        tokenAccess: generateUUID(),
        createdAt: new Date(),
        storeId: props.storeId,
      });

      return { value: totem, error: undefined };
    } catch (error) {
      return { error: error as ResourceInvalidException, value: undefined };
    }
  }

  static restore(props: {
    id: string;
    name: string;
    tokenAccess: string;
    createdAt: Date;
    storeId: string;
  }): CoreResponse<Totem> {
    try {
      const totem = new Totem({
        id: props.id,
        name: props.name,
        tokenAccess: props.tokenAccess,
        createdAt: props.createdAt,
        storeId: props.storeId,
      });

      return { value: totem, error: undefined };
    } catch (error) {
      return { error: error as ResourceInvalidException, value: undefined };
    }
  }
}
