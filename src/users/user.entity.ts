import { AfterInsert, AfterUpdate, AfterRemove, Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Report } from '../reports/report.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  admin: boolean;

  // () => Report: Accociate with report
  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log(`Insert User with id: ${this.id}`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`Update User with id: ${this.id}`);
  }

  @AfterRemove()
  logRemove() {
    console.log(`Remove User with id: ${this.id}`);
  }
}
