const player = mp.players.local;

let leadeMenu = false;

mp.events.subscribe({
    'Gang-ShowMenu': (playerId: number) => {
        mp.browser.showPage('gang', { playerId }, false);
    },
    'Gang-ShowDocs': (name: string, gang: string, rank: string) => {
        mp.browser.showPage('gang/docs', { name, gang, rank });
    },
    'Gang-ShowLeaderMenu': () => {
        const name = player.getVariable('realName');
        const { rank } = player.getVariable('gang');

        mp.browser.showPage('gang/leader', { name, rank });

        leadeMenu = true;
    },
    'Gang-ShowLeaveMenu': () => {
        mp.browser.showPage('gang/leave');
    }
});

mp.keys.bind(114, false, () => {
    if (mp.gui.cursor.visible || player.isCuffed() || !player.getVariable('gang')) return;

    mp.browser.showPage('gang', { playerId }, false);
});

mp.keys.bind(116, false, () => {
    if (!leadeMenu) return;

    mp.browser.hidePage();

    leadeMenu = false;
});

