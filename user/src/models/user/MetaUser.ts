import { Table, Column, Model, DataType } from "sequelize-typescript";
import { ForeignKey } from "sequelize-typescript";
import { User } from "./User";



@Table({
    timestamps: true,
})
export class MetaUser extends Model{
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true
    })
    declare id: number;

    @ForeignKey(()=>User)
    @Column({
        allowNull: false
    })
    declare userId: number;

    

    @Column({
        type: DataType.DATE,
    })
    declare lastTimeIn: Date;

    @Column({
        type: DataType.STRING,
    })
    declare lastPlaceIn: string;
    
}