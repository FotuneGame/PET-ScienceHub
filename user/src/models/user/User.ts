import { Table, Column, Model,DataType } from "sequelize-typescript";
import {HasOne} from "sequelize-typescript";

import {Setting} from "./Setting";
import {MetaUser} from "./MetaUser";



@Table({
    timestamps: true 
})
export class User extends Model{

    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true
    })
    declare id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare name: string;


    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare phone: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare email: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare password: string;



    @HasOne(()=>Setting, 'userId')
    declare Setting: Setting

    @HasOne(()=>MetaUser, 'userId')
    declare Meta: MetaUser
}