mp.peds.new(0x98c7404f, new mp.Vector3(2329.902, 3048.724, 48.151), 273.181);

mp.events.subscribe({
    'GangCreator-ShowBuyerMenu': (price: number) => {
        mp.browser.showPage('services/gang_creator', { price });
    }
});
