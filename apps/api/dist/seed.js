import { Service } from "./models.js";
export const DEFAULT_SERVICES = [
    { title: "Чоловіча стрижка", category: "Стрижки", durationMin: 30, priceFrom: 20, priceTo: 35 },
    { title: "Жіноча стрижка", category: "Стрижки", durationMin: 60, priceFrom: 35, priceTo: 70 },
    { title: "Дитяча стрижка", category: "Стрижки", durationMin: 30, priceFrom: 15, priceTo: 25 },
    { title: "Тонування / однотон", category: "Фарбування", durationMin: 120, priceFrom: 70, priceTo: 140 },
    { title: "AirTouch", category: "Фарбування", durationMin: 240, priceFrom: 160, priceTo: 280 },
    { title: "Balayage", category: "Фарбування", durationMin: 210, priceFrom: 140, priceTo: 260 },
    { title: "Ombre / Sombre", category: "Фарбування", durationMin: 180, priceFrom: 120, priceTo: 220 },
    { title: "Highlight / Melting", category: "Фарбування", durationMin: 210, priceFrom: 140, priceTo: 260 },
    { title: "Botox / Keratin", category: "Відновлення", durationMin: 150, priceFrom: 120, priceTo: 250, description: "Тривалість залежить від густоти/довжини." },
    { title: "Olaplex / Bonding", category: "Відновлення", durationMin: 75, priceFrom: 60, priceTo: 110 },
    { title: "Глибоке відновлення", category: "Відновлення", durationMin: 60, priceFrom: 50, priceTo: 90 },
];
export async function seedServicesIfEmpty() {
    const count = await Service.countDocuments();
    if (count > 0)
        return;
    await Service.insertMany(DEFAULT_SERVICES);
}
export async function resetServicesSeed() {
    await Service.deleteMany({});
    await Service.insertMany(DEFAULT_SERVICES);
}
