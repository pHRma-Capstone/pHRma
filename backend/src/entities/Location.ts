import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Consult } from './Consult';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 50 })
  name: string;

  @Column({ name: 'is_intensive', type: 'boolean', default: false })
  isIntensive: boolean;

  @OneToMany(() => Consult, (consults: Consult) => consults.location)
  consult: Consult[];
}
