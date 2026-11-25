
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from './album.entity.js';

@Injectable()
export class AlbumesService {
  constructor(
    @InjectRepository(Album)
    private readonly albumesRepo: Repository<Album>,
  ) {}

  // Consultar todos los álbumes ordenados por ID
  findAll() {
    return this.albumesRepo.find({
      order: { id: 'ASC' },
    });
  }

  // Consultar un álbum incluyendo todas sus fotos
  async findFotos(id: number) {
    const album = await this.albumesRepo.findOne({
      where: { id },
      relations: {
        fotos: true,
      },
    });

    if (!album) {
      throw new NotFoundException(`Álbum ${id} no encontrado`);
    }

    return album;
  }
}
