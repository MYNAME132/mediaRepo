import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";
import { Column, Entity, Index, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";

export enum Role {
    ADMIN = "admin",
    USER = "user"
}

@Entity()
@Unique(['email'])
@Index(['organization'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000'})
  id: string;

  @Column()
  @ApiProperty({ example: 'ordID' })//should be UUID v4 but let it be just string
  organization: string;

  @Column()
  @ApiProperty({ example: 'some@gmail.com'})
  email: string;

  @Column()
  @ApiProperty({ example: 'strongPassword123'})
  password: string;

  @Column()
  @ApiProperty({ example: 'John Doe'})
  name: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  @ApiProperty({ example: 'user', enum: Role })
  role: Role;
}