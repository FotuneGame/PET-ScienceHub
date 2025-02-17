import { Table, Column, Model, DataType, Default} from "sequelize-typescript";
import { ForeignKey } from "sequelize-typescript";
import { User } from "./User";



@Table({
    timestamps: true,
})
export class Setting extends Model{
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

    


    @Default("en")
    @Column({
        type: DataType.STRING,
    })
    declare language: string;

    @Default(0)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare theme: number;
    
}