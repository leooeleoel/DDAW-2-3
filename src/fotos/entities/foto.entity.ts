
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { Album } from '../../albumes/album.entity.js';
import { Etiqueta } from './etiqueta.entity.js';

@Entity('fotos')
export class Foto {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

  @Column({ type: 'real', default: 0 })
  calificacion: number;

  @Column({ type: 'varchar' })
  ruta: string;

  @Column({ type: 'varchar', nullable: true })
fotografo: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  creadoEn: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  actualizadoEn: Date;

  // N:1 Muchas fotos pertenecen a un álbum
  @ManyToOne(() => Album, (album) => album.fotos, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  album: Album | null;

  // N:M Una foto tiene muchas etiquetas y viceversa
  @ManyToMany(() => Etiqueta, (etiqueta) => etiqueta.fotos)
  @JoinTable({
    name: 'fotos_etiquetas',
    joinColumn: { name: 'foto_id' },
    inverseJoinColumn: { name: 'etiqueta_id' },
  })
  etiquetas: Etiqueta[];
}
