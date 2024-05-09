import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Employee } from './Employee';

export enum PTO_Type {
  PTO = 'PTO',
  Personal = 'Personal',
  Vacation = 'Vacation',
  Sick = 'Sick'
}

@Entity('exception_log')
export class ExceptionLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, (employee: Employee) => employee.id)
  employee: Employee;

  @Column({ name: 'exception_date', type: 'date', nullable: false })
  exceptionDate: Date;

  @Column({ name: 'missed_punch_in', type: 'boolean', default: false, nullable: false })
  missedPunchIn: boolean;

  @Column({ name: 'in_time', type: 'timestamp', nullable: true })
  inTime: Date | null;

  @Column({ name: 'missed_punch_lunch_in', type: 'boolean', default: false, nullable: false })
  missedPunchLunchIn: boolean;

  @Column({ name: 'lunch_in_time', type: 'timestamp', nullable: true })
  lunchInTime: Date | null;

  @Column({ name: 'missed_punch_lunch_out', type: 'boolean', default: false, nullable: false })
  missedPunchLunchOut: boolean;

  @Column({ name: 'lunch_out_time', type: 'timestamp', nullable: true })
  lunchOutTime: Date | null;

  @Column({ name: 'missed_punch_out', type: 'boolean', default: false, nullable: false })
  missedPunchOut: boolean;

  @Column({ name: 'out_time', type: 'timestamp', nullable: true })
  outTime: Date | null;

  @Column({ name: 'is_signed_employee', type: 'boolean', default: false, nullable: false })
  isSignedEmployee: boolean;

  @Column({ name: 'is_signed_supervisor', type: 'boolean', default: false, nullable: false })
  isSignedSupervisor: boolean;

  @Column({ name: 'reason', type: 'varchar', length: 100, nullable: true })
  reason: string | null;

  @Column({ name: 'hours_time_off', type: 'decimal', precision: 4, scale: 2, nullable: true })
  hoursTimeOff: number | null;

  @Column({ name: 'time_off_type', type: 'enum', enum: PTO_Type, nullable: true })
  timeOffType: PTO_Type | null;
}
