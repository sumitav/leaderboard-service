import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    tableName: 'player_scores',
    timestamps: false,
})
export default class PlayerScore extends Model{
    @PrimaryKey
    @Column({
    field: 'player_id',
    type: DataType.STRING,
    allowNull: false,
})
    player_id: string;
    @Column({
    field: 'score',
    type: DataType.INTEGER,
    allowNull: false,
})
    score: number;
}