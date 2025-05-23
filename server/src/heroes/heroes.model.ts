import { Column, Model, Table, DataType } from "sequelize-typescript"

interface HeroCreationAttrs {
    nickname: string;
    real_name: string;
    origin_description: string;
    superpowers: string;
    catch_phrase: string;
    images: string[];
}

@Table({ tableName: 'heroes' })
export class Hero extends Model<Hero, HeroCreationAttrs> {
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    declare id: number;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    declare nickname: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare real_name: string;

    @Column({ type: DataType.STRING })
    declare origin_description: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare superpowers: string;

    @Column({ type: DataType.STRING })
    declare catch_phrase: string;

    @Column({ type: DataType.ARRAY(DataType.STRING) })
    declare images: string[];
}