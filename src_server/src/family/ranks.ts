import { last } from 'lodash';
import GangModel from '../models/Gang';
import { Fam } from './index';

export type Permission = 'inventory' | 'house';

export type Rank = {
    _id: string;
    name: string;
    permissions: {
        [key in Permission]: boolean;
    };
};

class GangRanks {
    readonly maxCount = 4;

    readonly price = 230;

    getAll(gang: Fam) {
        return gang.ranks;
    }

    getById(gang: Fam, id: string) {
        return id && gang.ranks.find((item) => item._id.toString() === id.toString());
    }

    async create(player: Player, gang: Fam, data: Rank) {

        await this.checkExists(gang, data.name);

        const { ranks } = await GangModel.findByIdAndUpdate(
            gang._id,
            { $push: { ranks: data } },
            { new: true }
        )
            .select({ ranks: 1 })
            .lean();

        const rank: Rank = last(ranks);

        gang.ranks.push(rank);

        return rank;
    }

    async update(gang: Fam, name: string, data: Rank) {
        if (name !== data.name) await this.checkExists(gang, data.name);

        await GangModel.findOneAndUpdate(
            { _id: gang._id, 'ranks._id': data._id },
            { $set: { 'ranks.$': data } }
        );

        gang.ranks = gang.ranks.map((item) =>
            item._id.toString() === data._id ? { ...item, ...data } : item
        );
    }

    async delete(gang: Fam, id: string) {
        await GangModel.findByIdAndUpdate(gang._id, { $pull: { ranks: { _id: id } } });

        gang.ranks = gang.ranks.filter((item) => item._id.toString() !== id);
    }

    private async checkExists(gang: Fam, name: string) {
        const index = gang.ranks.findIndex(
            (rank) => rank.name.toLowerCase() === name.toLowerCase()
        );

        if (index >= 0) return Promise.reject('Ранг, с указаным названием, уже существует');
    }
}

export default new GangRanks();
