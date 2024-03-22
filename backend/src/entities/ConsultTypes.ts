import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Consults } from './Consults';

@Entity('consult_types')
export class ConsultTypes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 50 })
  name: string;

  @OneToMany(() => Consults, (consults: Consults) => consults.consulttype)
  consult: Consults[];
}
