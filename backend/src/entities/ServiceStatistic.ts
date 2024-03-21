import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('service_statistics')
export class ServiceStatistic {
  @PrimaryColumn({ name: 'day', type: 'date' })
  day: Date;

  @Column({ name: 'number_notes', type: 'tinyint', unsigned: true, default: 0 })
  numberNotes: number;

  @Column({ name: 'number_consult_notes', type: 'tinyint', unsigned: true, default: 0 })
  numberConsultNotes: number;

  @Column({ name: 'number_abbreviated_notes', type: 'tinyint', unsigned: true, default: 0 })
  numberAbbreviatedNotes: number;

  @Column({ name: 'number_medications', type: 'smallint', unsigned: true, default: 0 })
  numberMedications: number;

  @Column({ name: 'average_medications_per_consult', type: 'tinyint', unsigned: true, default: 0 })
  averageMedicationsPerConsult: number;

  @Column({ name: 'number_interventions', type: 'smallint', unsigned: true, default: 0 })
  numberInterventions: number;

  @Column({ name: 'average_interventions_per_consult', type: 'tinyint', unsigned: true, default: 0 })
  averageInterventionsPerConsult: number;

  @Column({ name: 'average_time_per_consult', type: 'tinyint', unsigned: true, default: 0 })
  averageTimePerConsult: number;

  @Column({ name: 'number_requests', type: 'tinyint', unsigned: true, default: 0 })
  numberRequests: number;

  @Column({ name: 'number_emergency_room', type: 'tinyint', unsigned: true, default: 0 })
  numberEmergencyRoom: number;

  @Column({ name: 'number_intensive_care_unit', type: 'tinyint', unsigned: true, default: 0 })
  numberIntensiveCareUnit: number;

  @Column({ name: 'number_progressive_care_unit', type: 'tinyint', unsigned: true, default: 0 })
  numberProgressiveCareUnit: number;

  @Column({ name: 'number_missouri_psychiatric_center', type: 'tinyint', unsigned: true, default: 0 })
  numberMissouriPsychiatricCenter: number;

  @Column({ name: 'number_other', type: 'tinyint', unsigned: true, default: 0 })
  numberOther: number;

  @Column({ name: 'number_referred_to_pharmacist', type: 'tinyint', unsigned: true, default: 0 })
  numberReferredToPharmacist: number;
}
