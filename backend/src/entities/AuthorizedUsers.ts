import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { Employee } from './Employees';

@Entity('authorized_users')
export class AuthorizedUsers {
  @PrimaryColumn()
  employee_id: number;
  @OneToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ name: 'username', type: 'varchar', length: 20, unique: true, nullable: false })
  username: string;

  @Column({ name: 'hashed_password', type: 'binary', length: 32 })
  hashed_password: string;

  @Column({ name: 'is_admin_privileges', type: 'boolean', default: false, nullable: false })
  is_admin_privileges: boolean;

  @Column({ name: 'is_supervisor_privileges', type: 'boolean', default: false, nullable: false })
  is_supervisor_privileges: boolean;
}
