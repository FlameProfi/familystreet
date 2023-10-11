import * as rpc from 'rage-rpc';
import hud from 'helpers/hud';
import { isNumber } from 'lodash';
import house from '/house';
import members, { Member } from './members';
import ranks, { Rank } from './ranks';
import gangs from './index';


class GangLeader {
    constructor() {
        this.subscribeToEvents();
    }

    private async dissolve(player: Player) {
        const gang = gangs.get(player.family.name);

        if (!gangs.isOwner(player, gang)) return Promise.reject(new Error());

        const gangHouse = house.getPlayerItems(player).find((item) => item.active);

        if (gangHouse) this.setHouse(player, gangHouse.index, false);

        gangs.setPlayerData(player);
        gang.members.forEach((item) => {
            if (!isNumber(item.id)) return;

            const member = mp.players.at(item.id);

            gangs.setPlayerData(member);
            hud.showNotification(member,'info', 'Вас исключили из банды!');
        });

        await gangs.delete(gang);
    }

    private async setHouse(player: Player, index: number, status = true) {
        const gang = gangs.get(player.family.name);

        if (!gangs.isOwner(player, gang)) return Promise.reject(new Error());

        house.setGang(player, index, status ? gang._id : null);
    }

    private async addMember(player: Player, id: number) {
        try {
            const gang = gangs.get(player.family.name);
            const invited = mp.players.at(id);

            if (!invited || !gangs.isOwner(player, gang)) return Promise.reject(new Error());

            await members.add(player, gang, invited);

            return {
                id: invited.id,
                userId: invited.dbId,
                name: invited.getVariable('realName')
            };
        } catch (err) {
            hud.showNotification(player,'error',err);

            return Promise.reject(new Error());
        }
    }

    private async updateMember(player: Player, data: Member) {
        const gang = gangs.get(player.family.name);

        if (!gangs.isOwner(player, gang)) return Promise.reject(new Error());

        const rank = await members.update(gang, data);

        return rank.name;
    }

    private async kickMember(player: Player, id: string) {
        const gang = gangs.get(player.family.name);

        if (!gangs.isOwner(player, gang)) return Promise.reject(new Error());

        await members.kick(gang, id);
    }

    private async createRank(player: Player, data: Rank) {
        try {
            const gang = gangs.get(player.family.name);

            if (!gangs.isOwner(player, gang)) return Promise.reject(new Error());

            const rank = await ranks.create(player, gang, data);

            return rank;
        } catch (err) {
            hud.showNotification(player, 'error',err);

            return Promise.reject(new Error());
        }
    }

    private async updateRank(player: Player, name: string, data: Rank) {
        try {
            const gang = gangs.get(player.family.name);

            if (!gangs.isOwner(player, gang)) return Promise.reject(new Error());

            await ranks.update(gang, name, data);

            if (data.name === name) return;

            gang.members.forEach((member) => {
                if (member.rank?.toString() === data._id) {
                    gangs.setPlayerData(mp.players.at(member.id), gang.name, data.name);
                }
            });
        } catch (err) {
            hud.showNotification(player, 'error', err);

            return Promise.reject(new Error());
        }
    }

    private async deleteRank(player: Player, id: string) {
        const gang = gangs.get(player.family.name);

        if (!gangs.isOwner(player, gang)) return Promise.reject(new Error());

        await ranks.delete(gang, id);

        gang.members.forEach((member) => {
            if (member.rank?.toString() === id) {
                member.rank = null;

                gangs.setPlayerData(mp.players.at(member.id), gang.name);
            }
        });
    }

    private openMenu(player: Player) {
        if (gangs.isOwner(player, gangs.get(player.family.name))) {
            rpc.callClient(player, 'Gang-ShowLeaderMenu');
        } else if (player.family.name) {
            rpc.callClient(player, 'Gang-ShowLeaveMenu');
        }
    }

    private subscribeToEvents() {
        mp.events.subscribeToDefault({
            'Keys-F5': this.openMenu
        });

        mp.events.subscribe({
            'Gang-SetHouse': this.setHouse,
            'Gang-ChangeMoney': this.changeMoney,
            'Gang-AddMember': this.addMember,
            'Gang-UpdateMember': this.updateMember,
            'Gang-KickMember': this.kickMember,
            'Gang-CreateRank': this.createRank,
            'Gang-UpdateRank': this.updateRank,
            'Gang-DeleteRank': this.deleteRank,
            'Gang-Dissolve': this.dissolve.bind(this)
        });
    }
}

const leader = new GangLeader();
