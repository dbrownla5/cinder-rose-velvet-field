//#region node_modules/.nitro/vite/services/ssr/assets/catalog-code-DPvaKryE.js
/** Catalog naming template — one SKU per lot, one intake code per plate. */
var KIND_CODE = {
	coat: "COAT",
	jacket: "JKT",
	blazer: "BLZ",
	suit: "SUIT",
	dress: "DRESS",
	skirt: "SKRT",
	jumpsuit: "JUMP",
	top: "TOP",
	knit: "KNIT",
	hoodie: "HOOD",
	pants: "PANT",
	jeans: "JEAN",
	shorts: "SHRT",
	shoes: "SHOE",
	boots: "BOOT",
	sneakers: "SNEK",
	bag: "BAG",
	belt: "BELT",
	scarf: "SCRF",
	hat: "HAT",
	jewelry: "JWL",
	watch: "WATCH",
	other: "ITEM"
};
function letters(s, n) {
	return (s.toUpperCase().replace(/[^A-Z0-9]/g, "") || "X").slice(0, n).padEnd(n, "X");
}
function brandCode(brand) {
	const raw = (brand ?? "").trim();
	if (!raw || /^unbranded$|^none$|^unknown$/i.test(raw)) return "UNB";
	const words = raw.toUpperCase().replace(/[^A-Z0-9 ]+/g, " ").trim().split(/\s+/).filter(Boolean);
	if (words.length >= 2) return words.map((w) => w[0]).join("").slice(0, 4);
	return letters(words[0] ?? "UNB", 4);
}
function kindCode(kind) {
	const k = (kind ?? "item").toLowerCase().trim();
	if (KIND_CODE[k]) return KIND_CODE[k];
	return letters(k, 5);
}
function colorCode(color) {
	const raw = (color ?? "").trim();
	if (!raw) return "UNKN";
	const words = raw.toUpperCase().replace(/[^A-Z0-9 ]+/g, " ").trim().split(/\s+/).filter(Boolean);
	if (words.length >= 2) return (letters(words[0], 2) + letters(words[1], 2)).slice(0, 4);
	return letters(words[0], 4);
}
function lotPrefix(brand, kind, colorway) {
	return `${brandCode(brand)}-${kindCode(kind)}-${colorCode(colorway)}`;
}
function formatLotCode(prefix, seq) {
	return `${prefix}-${String(Math.max(1, seq)).padStart(4, "0")}`;
}
function prettyCatalogName(brand, style, colorway) {
	return [
		(brand ?? "").trim() || "Unbranded",
		(style ?? "").trim(),
		(colorway ?? "").trim()
	].filter(Boolean).join(" ");
}
function yyyymmdd(at = Date.now()) {
	const d = new Date(at);
	return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}
function formatIntakeCode(day, seq) {
	return `LB-${day}-${String(Math.max(1, seq)).padStart(4, "0")}`;
}
function inboxLotCode(day, seq) {
	return `INB-${day}-${String(Math.max(1, seq)).padStart(4, "0")}`;
}
var SKU_TEMPLATE = "BRAND-KIND-COLOR-0001";
var INTAKE_TEMPLATE = "LB-YYYYMMDD-0001";
//#endregion
export { inboxLotCode as a, yyyymmdd as c, formatLotCode as i, SKU_TEMPLATE as n, lotPrefix as o, formatIntakeCode as r, prettyCatalogName as s, INTAKE_TEMPLATE as t };
