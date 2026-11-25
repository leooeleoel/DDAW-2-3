import { Column, Entity, OneToMany, PrimaryGeneratedColumn }
    from 'typeorm';
import { Foto } from '../fotos/entities/foto.entity.js';
//import { Foto } from '../../fotos/entities/foto.entity.js';


@Entity('albumes')
export class Album {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 80 })
  nombre: string;

  // 1:N Un álbum tiene muchas fotos
  @OneToMany(() => Foto, (foto) => foto.album)
  fotos: Foto[];
}