import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { Totem } from '../entities/totem.entity';
import { TotemDataSourceDTO } from 'src/common/dataSource/dataSource.dto';

export class TotemMapper {
  static toEntity(dto: TotemDataSourceDTO): CoreResponse<Totem> {
    return Totem.restore({
      id: dto.id,
      name: dto.name,
      storeId: dto.store_id,
      tokenAccess: dto.token_access,
      createdAt: new Date(dto.created_at),
    });
  }

  static toPersistenceDTO(entity: Totem): TotemDataSourceDTO {
    return {
      id: entity.id,
      store_id: entity.storeId,
      name: entity.name,
      token_access: entity.tokenAccess,
      created_at: entity.createdAt.toISOString(),
    };
  }
}
