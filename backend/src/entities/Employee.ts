import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('employees')
export class Employee {
  @PrimaryColumn()
  id: number;

  @Column({ name: 'first_name', type: 'varchar', length: 50 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 50 })
  lastName: string;

  @Column({ name: 'is_med_history_technician', type: 'boolean', default: false })
  isMedHistoryTechnician: boolean;

  @Column({ name: 'is_med_history_intern', type: 'boolean', default: false })
  isMedHistoryIntern: boolean;

  @Column({ name: 'is_pharmacist', type: 'boolean', default: false })
  isPharmacist: boolean;

  @Column({ name: 'shift_schedule', type: 'int', nullable: true })
  shiftSchedule: number | null;
}
