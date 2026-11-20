
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
  ruta: string; // URL de la imagen

  @Column({ type: 'varchar', nullable: true })
  fotografo: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  creadoEn: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  actualizadoEn: Date;
}
