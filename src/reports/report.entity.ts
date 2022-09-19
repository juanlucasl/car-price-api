import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  price: number;

  @Column()
  year: number;

  @Column()
  kilometers: number;

  @Column()
  longitude: number;

  @Column()
  latitude: number;

  @ManyToOne(() => User, (user) => user.reports)
  user: User;
}
