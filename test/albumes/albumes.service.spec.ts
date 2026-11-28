import { ConflictException, NotFoundException } from '@nestjs/common';
import { validate } from 'class-validator';
import { getMetadataArgsStorage, type Repository } from 'typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Album } from '../../src/albumes/album.entity.js';
import { AlbumesService } from '../../src/albumes/albumes.service.js';
import { CreateAlbumDto } from '../../src/albumes/dto/create-album.dto.js';
import { Foto } from '../../src/fotos/entities/foto.entity.js';

describe('AlbumesService', () => {
  const album = { id: 1, nombre: 'Viajes' } as Album;
  const findOneBy = vi.fn();
  const save = vi.fn(async (datos: Partial<Album>) => datos);
  const remove = vi.fn(async () => undefined);
  const albumesRepo = {
    find: vi.fn(),
    findOneBy,
    create: vi.fn((datos: Partial<Album>) => datos),
    save,
    remove,
  } as unknown as Repository<Album>;
  const service = new AlbumesService(albumesRepo);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects duplicate names when creating an album', async () => {
    findOneBy.mockResolvedValue(album);

    await expect(service.create({ nombre: 'Viajes' })).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(save).not.toHaveBeenCalled();
  });

  it('rejects a name already used by another album when updating', async () => {
    findOneBy
      .mockResolvedValueOnce(album)
      .mockResolvedValueOnce({ id: 2, nombre: 'Familia' } as Album);

    await expect(
      service.update(1, { nombre: 'Familia' }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(save).not.toHaveBeenCalled();
  });

  it('returns not found when deleting a missing album', async () => {
    findOneBy.mockResolvedValue(null);

    await expect(service.remove(1)).rejects.toBeInstanceOf(NotFoundException);
    expect(remove).not.toHaveBeenCalled();
  });

  it('sets the photo album relation to SET NULL on album deletion', () => {
    const relation = getMetadataArgsStorage().relations.find(
      ({ target, propertyName }) =>
        target === Foto && propertyName === 'album',
    );

    expect(relation?.options).toMatchObject({
      onDelete: 'SET NULL',
      nullable: true,
    });
  });

  it('marks album names as unique in the database metadata', () => {
    const column = getMetadataArgsStorage().columns.find(
      ({ target, propertyName }) =>
        target === Album && propertyName === 'nombre',
    );

    expect(column?.options).toMatchObject({ unique: true });
  });

  it('validates a missing album name with a Spanish message', async () => {
    const datos = Object.assign(new CreateAlbumDto(), { nombre: '' });
    const errores = await validate(datos);

    expect(errores[0]?.constraints?.isNotEmpty).toBe(
      'El nombre del álbum es obligatorio',
    );
  });
});
