import { Column, Entity, ManyToMany, PrimaryGeneratedColumn }
    from 'typeorm';
import { Foto } from './foto.entity.js';

@Entity('etiquetas')
export class Etiqueta {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 30, unique: true })
  nombre: string;

  @ManyToMany(() => Foto, (foto) => foto.etiquetas)
  fotos: Foto[];
}