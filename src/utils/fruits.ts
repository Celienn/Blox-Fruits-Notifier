export type Fruit = {
    name: string;
    price: number;
    priceStr: string;
    rarity: Rarity;
};

export enum Rarity {
    Common      = "common",
    Uncommon    = "uncommon",
    Rare        = "rare",
    Legendary   = "legendary",
    Mythical    = "mythical"
}

// ? use this for unit test
function priceToNumber(priceStr : string){
    return Number(priceStr.split(',').join(''));
}
// ? use this for unit test
function rarityByPrice(price: number) : Rarity {
    if (price <= 180000 ) return Rarity.Common;
    if (price <= 600000 ) return Rarity.Uncommon;
    if (price <= 960000 ) return Rarity.Rare;
    if (price <= 2400000 ) return Rarity.Legendary;
    return Rarity.Mythical;
}

const fruits = {
    rocket:     { name: "Rocket",   price: 5000,     priceStr: "5,000",      rarity: Rarity.Common },
    spin:       { name: "Spin",     price: 7500,     priceStr: "7,500",      rarity: Rarity.Common },
    blade:      { name: "Blade",    price: 30000,    priceStr: "30,000",     rarity: Rarity.Common },
    spring:     { name: "Spring",   price: 60000,    priceStr: "60,000",     rarity: Rarity.Common },
    bomb:       { name: "Bomb",     price: 80000,    priceStr: "80,000",     rarity: Rarity.Common },
    smoke:      { name: "Smoke",    price: 100000,   priceStr: "100,000",    rarity: Rarity.Common },
    spike:      { name: "Spike",    price: 180000,   priceStr: "180,000",    rarity: Rarity.Common },
    flame:      { name: "Flame",    price: 250000,   priceStr: "250,000",    rarity: Rarity.Uncommon },
    ice:        { name: "Ice",      price: 350000,   priceStr: "350,000",    rarity: Rarity.Uncommon },
    sand:       { name: "Sand",     price: 420000,   priceStr: "420,000",    rarity: Rarity.Uncommon },
    dark:       { name: "Dark",     price: 500000,   priceStr: "500,000",    rarity: Rarity.Uncommon },
    eagle:      { name: "Eagle",    price: 550000,   priceStr: "550,000",    rarity: Rarity.Uncommon },
    diamond:    { name: "Diamond",  price: 600000,   priceStr: "600,000",    rarity: Rarity.Uncommon },
    light:      { name: "Light",    price: 650000,   priceStr: "650,000",    rarity: Rarity.Rare },
    rubber:     { name: "Rubber",   price: 750000,   priceStr: "750,000",    rarity: Rarity.Rare },
    ghost:      { name: "Ghost",    price: 940000,   priceStr: "940,000",    rarity: Rarity.Rare },
    magma:      { name: "Magma",    price: 960000,   priceStr: "960,000",    rarity: Rarity.Rare },
    quake:      { name: "Quake",    price: 1000000,  priceStr: "1,000,000",  rarity: Rarity.Legendary },
    buddha:     { name: "Buddha",   price: 1200000,  priceStr: "1,200,000",  rarity: Rarity.Legendary },
    love:       { name: "Love",     price: 1300000,  priceStr: "1,300,000",  rarity: Rarity.Legendary },
    creation:   { name: "Creation", price: 1400000,  priceStr: "1,400,000",  rarity: Rarity.Legendary },
    spider:     { name: "Spider",   price: 1500000,  priceStr: "1,500,000",  rarity: Rarity.Legendary },
    sound:      { name: "Sound",    price: 1700000,  priceStr: "1,700,000",  rarity: Rarity.Legendary },
    phoenix:    { name: "Phoenix",  price: 1800000,  priceStr: "1,800,000",  rarity: Rarity.Legendary },
    portal:     { name: "Portal",   price: 1900000,  priceStr: "1,900,000",  rarity: Rarity.Legendary },
    rumble:     { name: "Rumble",   price: 2100000,  priceStr: "2,100,000",  rarity: Rarity.Legendary },
    pain:       { name: "Pain",     price: 2300000,  priceStr: "2,300,000",  rarity: Rarity.Legendary },
    blizzard:   { name: "Blizzard", price: 2400000,  priceStr: "2,400,000",  rarity: Rarity.Legendary },
    gravity:    { name: "Gravity",  price: 2500000,  priceStr: "2,500,000",  rarity: Rarity.Mythical },
    mammoth:    { name: "Mammoth",  price: 2700000,  priceStr: "2,700,000",  rarity: Rarity.Mythical },
    trex:       { name: "Trex",     price: 2700000,  priceStr: "2,700,000",  rarity: Rarity.Mythical },
    dough:      { name: "Dough",    price: 2800000,  priceStr: "2,800,000",  rarity: Rarity.Mythical },
    shadow:     { name: "Shadow",   price: 2900000,  priceStr: "2,900,000",  rarity: Rarity.Mythical },
    venom:      { name: "Venom",    price: 3000000,  priceStr: "3,000,000",  rarity: Rarity.Mythical },
    control:    { name: "Control",  price: 3200000,  priceStr: "3,200,000",  rarity: Rarity.Mythical },
    gas:        { name: "Gas",      price: 3200000,  priceStr: "3,200,000",  rarity: Rarity.Mythical },
    spirit:     { name: "Spirit",   price: 3400000,  priceStr: "3,400,000",  rarity: Rarity.Mythical },
    leopard:    { name: "Leopard",  price: 5000000,  priceStr: "5,000,000",  rarity: Rarity.Mythical },
    yeti:       { name: "Yeti",     price: 5000000,  priceStr: "5,000,000",  rarity: Rarity.Mythical },
    kitsune:    { name: "Kitsune",  price: 8000000,  priceStr: "8,000,000",  rarity: Rarity.Mythical },
    dragon:     { name: "Dragon",   price: 15000000, priceStr: "15,000,000", rarity: Rarity.Mythical },
} as Record<string, Fruit>

export default {
    get: (name: string): Fruit | undefined => {
        return fruits[name.toLowerCase()];
    },
    list: (): Fruit[] => {
        return Object.values(fruits);
    }
};
