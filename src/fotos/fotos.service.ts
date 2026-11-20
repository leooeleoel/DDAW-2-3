
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Foto } from './entities/foto.entity.js';

@Injectable()
export class FotosService {
  constructor(
    @InjectRepository(Foto)
    private readonly fotosRepo: Repository<Foto>,
  ) {}

  // Consultar todas las fotos ordenadas por ID
  findAll(): Promise<Foto[]> {
    return this.fotosRepo.find({
      order: { id: 'ASC' },
    });
  }

  // Buscar una foto por ID
  async findOne(id: number): Promise<Foto> {
    const foto = await this.fotosRepo.findOneBy({ id });

    if (!foto) {
      throw new NotFoundException(`Foto ${id} no encontrada`);
    }

    return foto;
  }

  // Crear una nueva foto
  create(datos: Partial<Foto>): Promise<Foto> {
    const foto = this.fotosRepo.create(datos);
    return this.fotosRepo.save(foto);
  }

  // Actualizar una foto usando save()
  async update(id: number, datos: Partial<Foto>): Promise<Foto> {
    const foto = await this.findOne(id);
    Object.assign(foto, datos);
    return this.fotosRepo.save(foto);
  }

  // Eliminar una foto usando remove()
  async remove(id: number): Promise<void> {
    const foto = await this.findOne(id);
    await this.fotosRepo.remove(foto);
  }
}
