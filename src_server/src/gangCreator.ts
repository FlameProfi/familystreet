import * as rpc from 'rage-rpc';
import Service from './family/service';
import coords from './family/gangCreator';
import hud from 'helpers/hud';
import gangs from './family';
import money from "./helpers/money";

class GangCreator extends Service {
    private creatingPrice: number;

    constructor() {
        const info = {
            name: 'Решала',
            entities: coords,
            markerData: { radius: 0.75 },
            blipData: { model: 525, color: 60 }
        };
        super(info.name, info.entities, info.markerData, info.blipData);

        this.creatingPrice = 5000000;

        this.subsribeToEvents();
    }

    private async buy(player: Player, name: string) {
        try {
            if (gangs.isAlreadyExists(name)) {
                return hud.showNotification(player, 'error', 'Банда с данным названием уже существует!');
            }

            await money.change(player, 'bank', this.creatingPrice, `family`);
            await gangs.create(player, name);

            hud.showNotification(player, 'success', 'Успешная покупка!');
        } catch (err) {
            return Promise.reject();
        }
    }

    pressedKeyOnMainShape(player: Player) {
        if (player.family.name || player.family.name) {
            return hud.showNotification(player, 'error','Вы уже состоите в организации!');
        }

        rpc.callClient(player, 'GangCreator-ShowBuyerMenu', this.creatingPrice);
    }

    private subsribeToEvents() {
        mp.events.subscribe({
            'GangCreator-Buy': this.buy.bind(this)
        });
    }
}

export default new GangCreator();
