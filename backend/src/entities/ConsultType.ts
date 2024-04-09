import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('consult_types')
export class ConsultType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 50 })
  name: string;
}
