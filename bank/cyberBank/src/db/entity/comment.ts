import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from "typeorm";
import { User } from "./user";
import { Product } from "./product";


@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(() => User, {onDelete: "CASCADE", eager: true})
    @JoinColumn()
    user!: User

    @ManyToOne(() => Product, {onDelete: "CASCADE", eager: true})
    @JoinColumn()
    product!: Product

    @Column({length: 100})
    content!: string

    @Column()
    created!: string
}