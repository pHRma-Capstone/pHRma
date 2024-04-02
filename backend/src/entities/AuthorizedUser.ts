import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { Employee } from './Employee';

@Entity('authorized_users')
export class AuthorizedUser {
  @PrimaryColumn()
  employee_id: number;
  @OneToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ name: 'username', type: 'varchar', length: 20, unique: true, nullable: false })
  username: string;

  @Column({ name: 'hashed_password', type: 'binary', length: 32 })
  hashedPassword: string;

  @Column({ name: 'is_admin_privileges', type: 'boolean', default: false, nullable: false })
  isAdminPrivileges: boolean;

  @Column({ name: 'is_supervisor_privileges', type: 'boolean', default: false, nullable: false })
  isSupervisorPrivileges: boolean;
}
