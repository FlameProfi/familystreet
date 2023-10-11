import * as rpc from 'rage-rpc';
import { isNumber } from 'lodash';

class GangActions {
    constructor() {
        mp.events.subscribe({
            'Gang-Menu': this.openInteractionMenu.bind(this),
            'Gang-UseRope': this.useRope.bind(this),
            'Gang-UseSack': this.useSack.bind(this)
        });

        mp.events.add({
            'Gang-ShowDocs': this.showDocs.bind(this)
        });
    }


    private openInteractionMenu(player: PlayerMp, target: number) {
        if (!player.family.name) return;

        const id = isNumber(target) ? target : -1;

        rpc.callClient(player, 'Gang-ShowMenu', id);
    }

    private showDocs(player: PlayerMp, id: number) {
        if (!isNumber(id) || !player.family.name) return;

        const player2 = mp.players.at(id);
        const { name, rank } = player.family;

        rpc.callClient(player2, 'Gang-ShowDocs', [
            player.getVariable('realName'),
            name,
            rank
        ]);

    }
}

const actions = new GangActions();
