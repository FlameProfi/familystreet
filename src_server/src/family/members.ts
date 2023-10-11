import { isNumber } from 'lodash';
import GangModel from '../models/Gang';
import UserModel from '../models/User';
import hud from 'helpers/hud';
import gangs, { Fam } from './index';
import ranks from './ranks';

export type Member = {
    userId: string;
    rank?: string;
    id?: number;
};

class GangMembers {
    readonly maxCount = 25;

    readonly price = 330;

    async getAll(gang: Fam) {
        const members: (Member & { name: string })[] = [];

        // eslint-disable-next-line no-restricted-syntax
        for (const member of gang.members) {
            let name: string;

            if (isNumber(member.id)) name = mp.players.at(member.id).getVariable('realName');
            else {
                const { firstName, lastName } = await UserModel.findById(member.userId)
                    .select({ firstName: 1, lastName: 1 })
                    .lean();

                name = `${firstName} ${lastName}`;
            }

            const rank = ranks.getById(gang, member.rank);

            members.push({ name, ...member, rank: rank ? rank.name : '' });
        }

        return members;
    }

    async add(player: Player, gang: Fam, invited: Player) {
        if (!invited || invited.family.name || invited.family.name) {
            return Promise.reject('Гражданин уже состоит в организации');
        }

        await GangModel.findByIdAndUpdate(gang._id, {
            $push: { members: { userId: invited.dbId } }
        });

        gang.members.push({ userId: invited.dbId, id: invited.id });

        gangs.setPlayerData(invited, gang.name);
        hud.showNotification(invited,'info',`Вас пригласили в банду "${gang.name}"`);
    }

    async update(gang: Fam, { userId, id, ...data }: Member) {
        await GangModel.findOneAndUpdate(
            { _id: gang._id, 'members.userId': userId },
            { $set: { 'members.$.rank': data.rank } }
        );

        gang.members = gang.members.map((item) =>
            item.userId.toString() === userId ? { ...item, ...data } : item
        );

        const rank = ranks.getById(gang, data.rank);

        if (rank && isNumber(id)) {
            const player = mp.players.at(id);

            gangs.setPlayerData(player, gang.name, rank.name);
            hud.showNotification(player, 'info',`Ваш ранк изменен на "${rank.name}"`);
        }

        return rank;
    }

    async kick(gang: Fam, id: string) {
        await GangModel.findByIdAndUpdate(gang._id, { $pull: { members: { userId: id } } });

        const index = gang.members.findIndex(
            (item) => item.userId.toString() === id.toString()
        );
        const { id: playerId } = gang.members[index];

        gang.members.splice(index, 1);

        if (isNumber(playerId)) {
            const player = mp.players.at(playerId);

            gangs.setPlayerData(player);
            hud.showNotification(player, 'info', 'Вас исключили из банды!');
        }
    }

    toggleOnline(player: Player, gang: Fam, status: boolean) {
        const member = gang.members.find(
            (item) => item.userId.toString() === player.dbId.toString()
        );

        if (member) Object.assign(member, { id: status ? player.dbId : null });
    }
}

export default new GangMembers();
