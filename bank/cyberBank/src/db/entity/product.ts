import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from "typeorm";
import { User } from "./user";


@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({length: 300, unique: true})
    description!: string

    @Column({unique: true})
    content!: string

    @ManyToOne(() => User, {onDelete: "CASCADE", eager: true})
    @JoinColumn()
    owner!: User

    @Column()
    price!: number

    @Column()
    image_path!: string

    @Column()
    created!: string

    @Column({nullable: true})
    updated!: string
}