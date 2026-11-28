
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, ILike, In } from 'typeorm';

import { Foto } from './entities/foto.entity.js';
import { Etiqueta } from './entities/etiqueta.entity.js';

import { CreateFotoDto } from './dto/create-foto.dto.js';
import { UpdateFotoDto } from './dto/update-foto.dto.js';

export interface FiltroFotos {
  min: number;
  max: number;
  q?: string;
  page: number;
  limit: number;
  etiqueta?: string;
  orden?: 'asc' | 'desc';
}

@Injectable()
export class FotosService {
  constructor(
    @InjectRepository(Foto)
    private readonly fotosRepo: Repository<Foto>,

    @InjectRepository(Etiqueta)
    private readonly etiquetasRepo: Repository<Etiqueta>,
  ) {}

  // Consultar fotos con filtros y paginación
  async findAll({
    min,
    max,
    q,
    page,
    limit,
    etiqueta,
    orden = 'desc',
  }: FiltroFotos) {
    const [data, total] = await this.fotosRepo.findAndCount({
      where: {
        calificacion: Between(min, max),
        ...(q ? { titulo: ILike(`%${q}%`) } : {}),
        ...(etiqueta
          ? {
              etiquetas: { nombre: etiqueta },
            }
          : {}),
      },
      relations: {
        album: true,
        etiquetas: true,
      },
      order: {
        calificacion: orden.toUpperCase() as 'ASC' | 'DESC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  // Buscar una foto por ID incluyendo sus relaciones
  async findOne(id: number): Promise<Foto> {
    const foto = await this.fotosRepo.findOne({
      where: { id },
      relations: {
        album: true,
        etiquetas: true,
      },
    });

    if (!foto) {
      throw new NotFoundException(`Foto ${id} no encontrada`);
    }

    return foto;
  }

  // Crear una foto con álbum y etiquetas
  async create({ albumId, etiquetas, ...datos }: CreateFotoDto) {
    const foto = this.fotosRepo.create({
      ...datos,
      album: albumId ? { id: albumId } : null,
      etiquetas: await this.buscarOCrearEtiquetas(etiquetas),
    });

    const guardada = await this.fotosRepo.save(foto);

    return this.findOne(guardada.id);
  }

  // Buscar etiquetas existentes y crear las nuevas
  private async buscarOCrearEtiquetas(nombres: string[] = []) {
    const limpios = [
      ...new Set(nombres.map((t) => t.trim().toLowerCase())),
    ];

    const existentes = await this.etiquetasRepo.findBy({
      nombre: In(limpios),
    });

    const nuevas = limpios
      .filter((t) => !existentes.some((e) => e.nombre === t))
      .map((nombre) => this.etiquetasRepo.create({ nombre }));

    return [
      ...existentes,
      ...(await this.etiquetasRepo.save(nuevas)),
    ];
  }

  // Actualizar una foto (PATCH)
  async update(
    id: number,
    { albumId, etiquetas, ...datos }: UpdateFotoDto,
  ): Promise<Foto> {
    const foto = await this.findOne(id);

    Object.assign(foto, datos);

    if (albumId !== undefined) {
      foto.album = { id: albumId } as Foto['album'];
    }

    if (etiquetas !== undefined) {
      foto.etiquetas = await this.buscarOCrearEtiquetas(etiquetas);
    }

    await this.fotosRepo.save(foto);

    return this.findOne(id);
  }

  // Eliminar una foto
  async remove(id: number): Promise<void> {
    const foto = await this.findOne(id);

    await this.fotosRepo.remove(foto);
  }
}
