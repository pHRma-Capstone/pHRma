import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { Employee } from './Employee';

@Entity('authorized_users')
export class AuthorizedUser {
  @PrimaryColumn({ name: 'employee_id', type: 'int' })
  @JoinColumn({ name: 'employee_id' })
  employeeId: number;

  @Column({ name: 'username', type: 'varchar', length: 20, unique: true, nullable: false })
  username: string;

  @Column({ name: 'hashed_password', type: 'binary', length: 32, nullable: true })
  hashedPassword: string;

  @Column({ name: 'is_admin_privileges', type: 'boolean', default: false, nullable: false })
  isAdminPrivileges: boolean;

  @Column({ name: 'is_supervisor_privileges', type: 'boolean', default: false, nullable: false })
  isSupervisorPrivileges: boolean;

  @OneToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}
