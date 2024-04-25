import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Consult } from './Consult';

@Entity('consult_types')
export class ConsultType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 50 })
  name: string;

  @OneToMany(() => Consult, (consults: Consult) => consults.consultType)
  consult: Consult[];
}
