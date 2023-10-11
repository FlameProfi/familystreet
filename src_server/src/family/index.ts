import GangModel from '../models/Gang';
import members, { Member } from './members';
import ranks, { Rank, Permission } from './ranks';
import './actions';
import './leader';

export type Fam = {
    _id: string;
    name: string;
    money: number;
    owner: string;
    members: Member[];
    ranks: Rank[];
};

class Fams {
    private items: Map<string, Fam>;

    constructor() {
        this.items = new Map();

        this.subscribeToEvents();
    }

    get(name: string) {
        return this.items.get(name);
    }

    isOwner(player: Player, gang: Fam) {
        return gang && gang.owner.toString() === mp.players.getByDbId(player);
    }

    isAlreadyExists(name: string) {
        return !!this.get(name);
    }

    async create(player: Player, name: string) {
        const doc = await new GangModel({
            name,
            owner: mp.players.getByDbId(player)
        }).save();

        const data = doc.toObject();

        this.items.set(data.name, data);

        this.setPlayerData(player, name, 'Глава');
    }

    async delete(gang: Fam) {
        await GangModel.findByIdAndDelete(gang._id);

        this.items.delete(gang.name);
    }

    setPlayerData(player: Player, gang?: string, rank?: string) {
        if (!player) return;

        player.family = {
            rank,
            name: gang
        };

        player.setVariable('gang', player.family);
    }

    hasPremission(player: Player, premission: Permission) {
        const gang = this.get(player.family.name);

        if (this.isOwner(player, gang)) return true;

        const rank = gang.ranks.find((item) => item.name === player.gang.rank);

        return rank && rank.permissions[premission];
    }

    async loadPlayer(player: Player) {
        const [data] = await GangModel.aggregate([
            { $match: { $or: [{ owner: player.dbId }, { 'members.userId': player.dbId }] } },
            {
                $project: {
                    name: 1,
                    members: {
                        $filter: {
                            input: '$members',
                            as: 'member',
                            cond: { $eq: ['$$member.userId', player.dbId] }
                        }
                    },
                    _id: 0
                }
            }
        ]);

        if (!data) return;

        const gang = this.get(data.name);
        const rank = data.members.length && ranks.getById(gang, data.members[0].rank);

        this.setPlayerData(
            player,
            data.name,
            this.isOwner(player, gang) ? 'Глава' : rank && rank.name
        );

        members.toggleOnline(player, gang, true);
    }

    private getNearbyPlayers(player: Player) {
        const players: { id: number; name: string }[] = [];

        mp.players.forEachInRange(player.position, 20, (item) => {
            if (
                !item.family.name ||
                item.family.name ||
                item.getVariable('invisible')
            )
                return;

            players.push({
                name: item.name,
                id: item.id
            });
        });

        return players;
    }

    private async loadItems() {
        const cursor = await GangModel.find()
            .lean()
            .cursor();

        cursor.on('data', (data) => this.items.set(data.name, data));
        cursor.on('close', () => console.log(`Gangs loaded. Count: ${this.items.size}`));
    }

    private subscribeToEvents() {
        mp.events.subscribeToDefault({
            databaseConnected: this.loadItems.bind(this)
        });

        mp.events.subscribe({
            'Gang-GetRanksData': (player: Player) => {
                const gang = this.get(player.family.name);

                if (gang)
                    return {
                        ranks: ranks.getAll(gang),
                        price: ranks.price,
                        limit: ranks.maxCount
                    };
            },
            'Gang-GetMembersData': async (player: Player) => {
                const gang = this.get(player.family.name);

                if (gang) {
                    const data = await members.getAll(gang);

                    return {
                        members: data,
                        price: members.price,
                        limit: members.maxCount
                    };
                }
            },
            'Gang-GetMoney': (player: Player) => {
                const gang = this.get(player.family.name);

                if (gang) return gang.money;
            },
            'Gang-GetNearbyPlayers': this.getNearbyPlayers,
            'Gang-Leave': (player: Player) => {
                const gang = this.get(player.family.name);

                if (gang) members.kick(gang, player.dbId);
            }
        });

        mp.events.add('playerQuit', (player: Player) => {
            const name = player?.family?.name;

            if (name) members.toggleOnline(player, this.get(name), false);
        });
    }
}

export default new Fams();
