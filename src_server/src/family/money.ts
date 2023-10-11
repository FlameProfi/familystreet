import GangModel from '../models/Gang';
import { Fam } from './index';

class GangMoney {
    async add(player: PlayerMp, gang: Fam, amount: number) {
        const canChange = await player.moneyHelper.change(-amount, 'bank', 'gang money add');

        if (!canChange) return Promise.reject();

        await this.change(gang, amount);
    }

    async withdraw(player: PlayerMp, gang: Fam, amount: number) {
        await this.change(gang, -amount);

        await player.moneyHelper.change(amount, 'bank', 'gang money withdraw');
    }

    private async change(gang: Fam, amount: number) {
        if (gang.money + amount < 0) return Promise.reject();

        await GangModel.findByIdAndUpdate(gang._id, { $inc: { money: amount } });

        gang.money += amount;
    }
}

export default new GangMoney();
