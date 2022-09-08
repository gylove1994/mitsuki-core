import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GroupMassage {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  text!: string;
}
