import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Consults } from './Consults';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 50 })
  name: string;

  @Column({ name: 'is_intensive', type: 'boolean', default: false })
  isIntensive: boolean;

  @OneToMany(() => Consults, (consults: Consults) => consults.location)
  consult: Consults[];
}
