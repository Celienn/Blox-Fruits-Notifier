
export type Fruit = {
    name: string;
    price: number;
    priceStr: string;
};

// ? use this for unit test
function priceToNumber(priceStr : string){
    return Number(priceStr.split(',').join(''));
}

export default {
    rocket:     { name: "Rocket",   price: 5000,     priceStr: "5,000" },
    spin:       { name: "Spin",     price: 7500,     priceStr: "7,500" },
    blade:      { name: "Blade",    price: 30000,    priceStr: "30,000" },
    spring:     { name: "Spring",   price: 60000,    priceStr: "60,000" },
    bomb:       { name: "Bomb",     price: 80000,    priceStr: "80,000" },
    smoke:      { name: "Smoke",    price: 100000,   priceStr: "100,000" },
    spike:      { name: "Spike",    price: 180000,   priceStr: "180,000" },
    flame:      { name: "Flame",    price: 250000,   priceStr: "250,000" },
    falcon:     { name: "Falcon",   price: 300000,   priceStr: "300,000" },
    ice:        { name: "Ice",      price: 350000,   priceStr: "350,000" },
    sand:       { name: "Sand",     price: 420000,   priceStr: "420,000" },
    dark:       { name: "Dark",     price: 500000,   priceStr: "500,000" },
    ghost:      { name: "Ghost",    price: 550000,   priceStr: "550,000" },
    diamond:    { name: "Diamond",  price: 600000,   priceStr: "600,000" },
    light:      { name: "Light",    price: 650000,   priceStr: "650,000" },
    rubber:     { name: "Rubber",   price: 750000,   priceStr: "750,000" },
    barrier:    { name: "Barrier",  price: 800000,   priceStr: "800,000" },
    magma:      { name: "Magma",    price: 850000,   priceStr: "850,000" },
    quake:      { name: "Quake",    price: 1000000,  priceStr: "1,000,000" },
    buddha:     { name: "Buddha",   price: 1200000,  priceStr: "1,200,000" },
    love:       { name: "Love",     price: 1300000,  priceStr: "1,300,000" },
    creation:   { name: "Creation", price: 1400000,  priceStr: "1,400,000" },
    spider:     { name: "Spider",   price: 1500000,  priceStr: "1,500,000" },
    sound:      { name: "Sound",    price: 1700000,  priceStr: "1,700,000" },
    phoenix:    { name: "Phoenix",  price: 1800000,  priceStr: "1,800,000" },
    portal:     { name: "Portal",   price: 1900000,  priceStr: "1,900,000" },
    rumble:     { name: "Rumble",   price: 2100000,  priceStr: "2,100,000" },
    pain:       { name: "Pain",     price: 2300000,  priceStr: "2,300,000" },
    blizzard:   { name: "Blizzard", price: 2400000,  priceStr: "2,400,000" },
    gravity:    { name: "Gravity",  price: 2500000,  priceStr: "2,500,000" },
    mammoth:    { name: "Mammoth",  price: 2700000,  priceStr: "2,700,000" },
    trex:       { name: "Trex",     price: 2700000,  priceStr: "2,700,000" },
    dough:      { name: "Dough",    price: 2800000,  priceStr: "2,800,000" },
    shadow:     { name: "Shadow",   price: 2900000,  priceStr: "2,900,000" },
    venom:      { name: "Venom",    price: 3000000,  priceStr: "3,000,000" },
    control:    { name: "Control",  price: 3200000,  priceStr: "3,200,000" },
    gas:        { name: "Gas",      price: 3200000,  priceStr: "3,200,000" },
    spirit:     { name: "Spirit",   price: 3400000,  priceStr: "3,400,000" },
    leopard:    { name: "Leopard",  price: 5000000,  priceStr: "5,000,000" },
    yeti:       { name: "Yeti",     price: 5000000,  priceStr: "5,000,000" },
    kitsune:    { name: "Kitsune",  price: 8000000,  priceStr: "8,000,000" },
    dragon:     { name: "Dragon",   price: 15000000, priceStr: "15,000,000" },
} as Record<string, Fruit>;
