import { o as __toESM } from "../_runtime.mjs";
import { y as require_jsx_runtime, z as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { n as SKU_TEMPLATE, s as prettyCatalogName, t as INTAKE_TEMPLATE } from "./catalog-code-DPvaKryE.mjs";
import { C as ChevronDown, E as Aperture, S as CirclePause, T as BookOpen, _ as Layers, b as Handshake, c as Shirt, d as Search, f as Scissors, g as LayoutGrid, h as Pause, i as Undo2, l as Shield, m as RotateCcw, n as User, o as Trash2, p as Scale, r as Upload, s as Table2, t as Watch, u as Send, v as Inbox, w as Check, x as Copy, y as ImageOff } from "../_libs/lucide-react.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-U3xMQkIS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[opacity,transform,background-color,border-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 active:scale-[0.98]", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:bg-accent/90",
			ghost: "text-fg hover:bg-fg/6",
			outline: "border border-border bg-transparent text-fg hover:bg-fg/6",
			subtle: "bg-raised text-fg hover:bg-fg/8"
		},
		size: {
			sm: "h-8 px-3 text-xs rounded-[8px]",
			md: "h-10 px-4 text-sm rounded-[12px]",
			lg: "h-11 px-5 text-sm rounded-[12px]",
			icon: "size-10 rounded-[12px]",
			iconSm: "size-8 rounded-[8px]"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "md"
	}
});
function Button({ className, variant, size, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var listCatalog = createServerFn({ method: "GET" }).handler(createSsrRpc("d655be3d0803c9d88938e58792559371382e340051d406ec336ce7b8b83df2d8"));
var mintIntakeCodes = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("c06899318ee208a45e9b1f3e3123e6e74bace9cd98c0864eb17231fe10bb86d5"));
var mintLotCode = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("ba62eb02230d1ba2e7ecc67cb87462acea1d3cfa789a26d10b4251962780299d"));
var upsertCatalog = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("e31ba9991a237849eae8ad22efbddb438db10d3165c79c2cfaa7ff2f6c81b3ac"));
createServerFn({ method: "POST" }).handler(createSsrRpc("23e188d81ff3d49ae6c2219f8b375d53d04ee666e8f41a11e6b2ab0c8f13f37c"));
var analyzeImage = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("015a029929a18376662584d0b4354db890240ce6033ee4eb68f8cff456f68ba0"));
var runWorkArea = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("b62114b84c9ba4a152c8bd194d66e1c3234c4b65f8ef1775d0e0083386ba52ed"));
var evaluatePrice = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("3ee3ec00493ee0890127353aa03e1e2c02722f756732d0cd0e87e775409d8699"));
var runSecondPass = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("2e2fa300a1a42494a450de5012b869adf0107515566e683a653f6005e5859525"));
var buildListingTemplate = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("04f5ba1bdb5b5f4d9888382b364e2081ae994c880070db60b21677d61ee35218"));
var EMPTY = {
	orientation: 1,
	make: null,
	model: null,
	lens: null,
	dateTime: null,
	dateTimeOriginal: null,
	iso: null,
	aperture: null,
	shutter: null,
	focalMm: null,
	hasGps: false
};
function ascii(view, offset, len) {
	let s = "";
	const end = Math.min(view.byteLength, offset + len);
	for (let i = offset; i < end; i++) {
		const c = view.getUint8(i);
		if (c === 0) break;
		if (c >= 32 && c < 127) s += String.fromCharCode(c);
	}
	return s.trim() || null;
}
function rational(view, offset, le) {
	if (offset + 8 > view.byteLength) return null;
	const n = le ? view.getUint32(offset, true) : view.getUint32(offset, false);
	const d = le ? view.getUint32(offset + 4, true) : view.getUint32(offset + 4, false);
	if (!d) return null;
	return n / d;
}
function exifDateToIso(raw) {
	if (!raw) return null;
	const m = raw.match(/^(\d{4}):(\d{2}):(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/);
	if (!m) return raw;
	return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}`;
}
function fmtAperture(n) {
	if (n == null || !Number.isFinite(n)) return null;
	return `f/${Number.isInteger(n) ? n : n.toFixed(1)}`;
}
function fmtShutter(n) {
	if (n == null || !Number.isFinite(n) || n <= 0) return null;
	if (n >= 1) return `${n.toFixed(n >= 10 ? 0 : 1)}s`;
	return `1/${Math.round(1 / n)}s`;
}
function readIfd(view, tiff, ifd, le, into, depth = 0) {
	if (depth > 3 || ifd + 2 > view.byteLength) return;
	const u16 = (o) => le ? view.getUint16(o, true) : view.getUint16(o, false);
	const u32 = (o) => le ? view.getUint32(o, true) : view.getUint32(o, false);
	const entries = u16(ifd);
	for (let i = 0; i < entries; i++) {
		const e = ifd + 2 + i * 12;
		if (e + 12 > view.byteLength) break;
		const tag = u16(e);
		const type = u16(e + 2);
		const count = u32(e + 4);
		const inline = e + 8;
		const dataOff = count * (type === 3 ? 2 : type === 4 || type === 9 ? 4 : type === 5 || type === 10 ? 8 : 1) > 4 ? tiff + u32(inline) : inline;
		if (tag === 274 && type === 3) into.orientation = u16(inline) || 1;
		else if (tag === 271) into.make = ascii(view, dataOff, count);
		else if (tag === 272) into.model = ascii(view, dataOff, count);
		else if (tag === 306) into.dateTime = ascii(view, dataOff, count);
		else if (tag === 36867) into.dateTimeOriginal = ascii(view, dataOff, count);
		else if (tag === 34855) into.iso = type === 3 ? u16(inline) : u32(inline);
		else if (tag === 33437) into.aperture = fmtAperture(rational(view, dataOff, le));
		else if (tag === 33434) into.shutter = fmtShutter(rational(view, dataOff, le));
		else if (tag === 37386) {
			const mm = rational(view, dataOff, le);
			into.focalMm = mm != null ? Math.round(mm * 10) / 10 : null;
		} else if (tag === 42036) into.lens = ascii(view, dataOff, count);
		else if (tag === 34665) readIfd(view, tiff, tiff + u32(inline), le, into, depth + 1);
		else if (tag === 34853) into.hasGps = true;
	}
}
function parseJpegExif(buf) {
	const view = new DataView(buf);
	if (view.byteLength < 4 || view.getUint16(0) !== 65496) return { ...EMPTY };
	let offset = 2;
	const out = { ...EMPTY };
	while (offset + 4 < view.byteLength) {
		const marker = view.getUint16(offset);
		if ((marker & 65280) !== 65280) break;
		const size = view.getUint16(offset + 2);
		if (marker === 65505 && offset + 8 < view.byteLength) {
			if (String.fromCharCode(view.getUint8(offset + 4), view.getUint8(offset + 5), view.getUint8(offset + 6), view.getUint8(offset + 7)) === "Exif") {
				const tiff = offset + 10;
				if (tiff + 8 > view.byteLength) break;
				const le = view.getUint16(tiff) === 18761;
				const u32 = (o) => le ? view.getUint32(o, true) : view.getUint32(o, false);
				readIfd(view, tiff, tiff + u32(tiff + 4), le, out);
				break;
			}
		}
		if (size < 2) break;
		offset += 2 + size;
	}
	return out;
}
async function sha256Hex(buf) {
	const digest = await crypto.subtle.digest("SHA-256", buf);
	return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function extractImageMeta(file) {
	const buf = await file.arrayBuffer();
	const exif = parseJpegExif(buf);
	const hash = await sha256Hex(buf);
	return {
		takenAt: exifDateToIso(exif.dateTimeOriginal ?? exif.dateTime),
		takenSource: exif.dateTimeOriginal ? "original" : exif.dateTime ? "modify" : null,
		make: exif.make,
		model: exif.model,
		lens: exif.lens,
		iso: exif.iso,
		aperture: exif.aperture,
		shutter: exif.shutter,
		focalMm: exif.focalMm,
		orientation: exif.orientation,
		hasGps: exif.hasGps,
		hashSha256: hash,
		contentHash: "",
		sourceMime: file.type || "application/octet-stream",
		sourceBytes: file.size,
		extractedAt: Date.now()
	};
}
function cameraLabel(meta) {
	if (!meta) return null;
	return [meta.make, meta.model].filter(Boolean).join(" ").trim() || null;
}
function hammingHex(a, b) {
	if (!a || !b || a.length !== b.length) return 64;
	let n = 0;
	for (let i = 0; i < a.length; i++) {
		let x = parseInt(a[i], 16) ^ parseInt(b[i], 16);
		while (x) {
			n += x & 1;
			x >>= 1;
		}
	}
	return n;
}
function contentHashFromImage(img) {
	const w = 9;
	const h = 8;
	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext("2d", { willReadFrequently: true });
	if (!ctx) return "0".repeat(16);
	ctx.drawImage(img, 0, 0, w, h);
	const { data } = ctx.getImageData(0, 0, w, h);
	let bits = 0n;
	let bit = 0n;
	for (let y = 0; y < h; y++) for (let x = 0; x < 8; x++) {
		const i = (y * w + x) * 4;
		const j = (y * w + x + 1) * 4;
		if (.299 * data[i] + .587 * data[i + 1] + .114 * data[i + 2] > .299 * data[j] + .587 * data[j + 1] + .114 * data[j + 2]) bits |= 1n << bit;
		bit += 1n;
	}
	return bits.toString(16).padStart(16, "0");
}
function exifAccuracy(meta, item) {
	if (!meta) return 0;
	let s = 0;
	if (meta.takenSource === "original") s += 40;
	else if (meta.takenSource === "modify") s += 12;
	if (meta.make) s += 16;
	if (meta.model) s += 12;
	if (meta.lens) s += 8;
	if (meta.iso != null) s += 6;
	if (meta.aperture) s += 6;
	if (meta.shutter) s += 6;
	if (meta.focalMm != null) s += 6;
	if (meta.hasGps) s += 8;
	const bytes = meta.sourceBytes || item?.bytes || 0;
	if (bytes > 0) s += Math.min(18, Math.log2(bytes) - 10);
	const px = (item?.width ?? 0) * (item?.height ?? 0);
	if (px > 0) s += Math.min(14, Math.log2(px) - 16);
	if (item?.lowLevel) s += Math.round(item.lowLevel.sharpness * 10);
	return Math.max(0, Math.round(s));
}
function aspectClose(a, b) {
	if (!a.width || !a.height || !b.width || !b.height) return true;
	const ra = a.width / a.height;
	const rb = b.width / b.height;
	return Math.abs(ra - rb) / Math.max(ra, rb) < .12;
}
function samePhoto(a, b) {
	const ha = a.meta?.hashSha256;
	const hb = b.meta?.hashSha256;
	if (ha && hb && ha === hb) return "hash";
	const ca = a.meta?.contentHash;
	const cb = b.meta?.contentHash;
	if (ca && cb && hammingHex(ca, cb) <= 8 && aspectClose(a, b)) return "content";
	return null;
}
function pickKeeper(cluster) {
	return [...cluster].sort((a, b) => {
		const sa = exifAccuracy(a.meta, a);
		const sb = exifAccuracy(b.meta, b);
		if (sb !== sa) return sb - sa;
		const pa = a.width * a.height;
		const pb = b.width * b.height;
		if (pb !== pa) return pb - pa;
		const ba = a.meta?.sourceBytes ?? a.bytes;
		const bb = b.meta?.sourceBytes ?? b.bytes;
		if (bb !== ba) return bb - ba;
		return a.createdAt - b.createdAt;
	})[0];
}
/** Cluster by exact SHA-256 or near content hash. Keep the richest EXIF. Never delete extras. */
function markDupes(items) {
	const n = items.length;
	const parent = items.map((_, i) => i);
	const find = (i) => {
		while (parent[i] !== i) {
			parent[i] = parent[parent[i]];
			i = parent[i];
		}
		return i;
	};
	const unite = (i, j) => {
		const a = find(i);
		const b = find(j);
		if (a !== b) parent[a] = b;
	};
	for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (samePhoto(items[i], items[j])) unite(i, j);
	const clusters = /* @__PURE__ */ new Map();
	for (let i = 0; i < n; i++) {
		const r = find(i);
		const list = clusters.get(r) ?? [];
		list.push(i);
		clusters.set(r, list);
	}
	const next = items.map((item) => ({
		...item,
		dupe: void 0
	}));
	for (const idxs of clusters.values()) {
		if (idxs.length < 2) continue;
		const cluster = idxs.map((i) => next[i]);
		const keeper = pickKeeper(cluster);
		const keeperScore = exifAccuracy(keeper.meta, keeper);
		const kind = cluster.some((c) => c.id !== keeper.id && c.meta?.hashSha256 && c.meta.hashSha256 === keeper.meta?.hashSha256) ? "hash" : "content";
		for (const i of idxs) {
			const item = next[i];
			const score = exifAccuracy(item.meta, item);
			const extra = item.id !== keeper.id;
			const dist = item.meta?.contentHash && keeper.meta?.contentHash ? hammingHex(item.meta.contentHash, keeper.meta.contentHash) : void 0;
			const rec = {
				kind: item.meta?.hashSha256 && item.meta.hashSha256 === keeper.meta?.hashSha256 ? "hash" : kind,
				ofId: keeper.id,
				ofIntake: keeper.intakeCode,
				score,
				keeperScore,
				distance: dist,
				status: extra ? "extra" : "keeper",
				reason: extra ? `Same ${item.meta?.hashSha256 === keeper.meta?.hashSha256 ? "bytes" : "content"} as ${keeper.intakeCode ?? keeper.id} · weaker EXIF (${score} vs ${keeperScore})` : `Canonical · richest EXIF in a ${idxs.length}-plate match`
			};
			const tags = extra ? [...item.tags.filter((t) => t !== "possible-duplicate" && t !== "duplicate-extra" && t !== "duplicate-keeper"), "duplicate-extra"] : [...item.tags.filter((t) => t !== "possible-duplicate" && t !== "duplicate-extra" && t !== "duplicate-keeper"), "duplicate-keeper"];
			next[i] = {
				...item,
				dupe: rec,
				tags
			};
		}
	}
	return next;
}
function formatClientName(first, last) {
	return [first?.trim(), last?.trim()].filter(Boolean).join(" ") || null;
}
function parseClientName(filename) {
	const parts = filename.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim().replace(/\b(client|cid|lot|img|dsc|img)\b/gi, "").replace(/\d+/g, " ").trim().split(/\s+/).filter((p) => /^[A-Za-z][A-Za-z']+$/.test(p));
	if (parts.length >= 2) {
		const first = cap(parts[0]);
		const last = cap(parts[parts.length - 1]);
		if (first.toLowerCase() !== last.toLowerCase()) return {
			first,
			last
		};
	}
	return null;
}
function cap(s) {
	return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}
function slug(s) {
	return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);
}
function prettyItemName(g) {
	if (!g?.isGarment) return "";
	return [
		g.brandVisible?.trim() || "Unbranded",
		(g.styleName || g.kind).trim(),
		(g.colorway || "").trim()
	].filter(Boolean).join(" ");
}
function prettyLotName(g, client) {
	const head = prettyItemName(g);
	if (!head) return client ?? "Unsorted";
	return client ? `${head} · ${client}` : head;
}
function groupKeyFor(item) {
	const g = item.garment;
	const client = slug(item.clientId || item.batchId || "unassigned");
	if (g?.isGarment) return [
		slug(g.brandVisible || "unbranded"),
		slug(g.styleName || g.kind || "garment"),
		slug(g.colorway || "unknown"),
		client
	].join("::");
	const hint = g?.groupHint?.trim();
	if (hint) return [slug(hint), client].join("::");
	return item.id;
}
function groupLabelFor(items) {
	const first = items[0];
	return prettyLotName(first?.garment, first?.clientId);
}
function catalogSortKey(item) {
	const g = item.garment;
	return `${g?.isGarment ? "0" : "1"}\u0000${g?.isGarment ? [
		g.brandVisible || "unbranded",
		g.styleName || g.kind,
		g.colorway
	].join(" ").toLowerCase() : (item.highLevel?.title || item.name).toLowerCase()}\u0000${(item.clientLast || item.clientId || "zzz").toLowerCase()}\u0000${(item.clientFirst || "").toLowerCase()}`;
}
function accessoryKind(kind) {
	return /^(shoes|boots|sneakers|bag|belt|scarf|hat|jewelry|watch)$/i.test(kind);
}
function collectionFor(item) {
	if (item.lane === "social") return "social";
	if (item.lane === "log" || item.ledger === "personal") return "personal";
	if (item.garment?.isGarment) return accessoryKind(item.garment.kind) ? "accessories" : "garments";
	return item.highLevel?.suggestedCollection ?? "inbox";
}
function laneForLedger(ledger, explicit) {
	if (explicit) return explicit;
	return ledger === "personal" ? "log" : "resell";
}
function editPlanFor(item) {
	if (item.lane === "social") return {
		recipe: "social-minimal",
		bgRemoval: "not-needed",
		enhance: "preview-local",
		notes: ["Minimal grade only — no cutout, no beauty filter"],
		crops: [
			"4:5",
			"1:1",
			"9:16"
		]
	};
	const role = item.garment?.photoRole;
	if (role === "fit-on-body" || role === "in-situ") return {
		recipe: "resell-batch",
		bgRemoval: "skipped-on-body",
		enhance: "preview-local",
		notes: [
			"Do not cut a person out of this plate",
			"Preview enhance only",
			"Still need a flat-lay for listing"
		],
		crops: ["4:5"]
	};
	const keepContext = role === "label" || role === "hangtag" || role === "defect";
	return {
		recipe: "resell-batch",
		bgRemoval: keepContext ? "not-needed" : "pending-tbd",
		enhance: "pending-tbd",
		notes: keepContext ? ["Keep context — no background removal on labels or defects"] : [
			"Background removal — program TBD",
			"Auto enhance — program TBD",
			"Local preview grade until the program is locked"
		],
		crops: ["1:1", "4:5"]
	};
}
function uniqueById(rows) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const row of rows) {
		if (seen.has(row.id)) continue;
		seen.add(row.id);
		out.push(row);
	}
	return out;
}
function needsResellEdit(item) {
	if (item.lane !== "resell" || !item.garment?.isGarment) return false;
	const st = item.edit?.status ?? "none";
	return st === "none" || st === "queued" || st === "processing";
}
function isListingPlate(item) {
	const st = item.edit?.status;
	return st === "ready-to-post" || st === "recataloged";
}
var DB_NAME = "strata-catalog";
var STORE = "blobs";
function openDb() {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB_NAME, 1);
		req.onupgradeneeded = () => {
			const db = req.result;
			if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}
async function putBlob(id, blob) {
	const db = await openDb();
	await new Promise((resolve, reject) => {
		const tx = db.transaction(STORE, "readwrite");
		tx.objectStore(STORE).put(blob, id);
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
	});
}
async function getBlob(id) {
	const db = await openDb();
	return new Promise((resolve, reject) => {
		const req = db.transaction(STORE, "readonly").objectStore(STORE).get(id);
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}
async function deleteBlob(id) {
	const db = await openDb();
	await new Promise((resolve, reject) => {
		const tx = db.transaction(STORE, "readwrite");
		tx.objectStore(STORE).delete(id);
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
	});
}
async function readJpegOrientation(file) {
	if (!/jpe?g/i.test(file.type) && !/\.jpe?g$/i.test(file.name)) return 1;
	return parseJpegExif(await file.arrayBuffer()).orientation || 1;
}
function drawOriented(img, orientation, maxEdge = 2400) {
	const srcW = img.naturalWidth || img.width;
	const srcH = img.naturalHeight || img.height;
	const swap = orientation >= 5 && orientation <= 8;
	const scale = Math.min(1, maxEdge / Math.max(srcW, srcH));
	const w = Math.max(1, Math.round(srcW * scale));
	const h = Math.max(1, Math.round(srcH * scale));
	const canvas = document.createElement("canvas");
	canvas.width = swap ? h : w;
	canvas.height = swap ? w : h;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Canvas unavailable");
	switch (orientation) {
		case 2:
			ctx.transform(-1, 0, 0, 1, w, 0);
			break;
		case 3:
			ctx.transform(-1, 0, 0, -1, w, h);
			break;
		case 4:
			ctx.transform(1, 0, 0, -1, 0, h);
			break;
		case 5:
			ctx.transform(0, 1, 1, 0, 0, 0);
			break;
		case 6:
			ctx.transform(0, 1, -1, 0, h, 0);
			break;
		case 7:
			ctx.transform(0, -1, -1, 0, h, w);
			break;
		case 8: ctx.transform(0, -1, 1, 0, 0, w);
	}
	ctx.drawImage(img, 0, 0, w, h);
	return {
		canvas,
		width: canvas.width,
		height: canvas.height
	};
}
async function prepImageFile(file) {
	const orientation = await readJpegOrientation(file);
	const { canvas, width, height } = drawOriented(await loadImage(await fileToDataUrl(file)), orientation, 2400);
	return {
		blob: await new Promise((resolve, reject) => {
			canvas.toBlob((b) => b ? resolve(b) : reject(/* @__PURE__ */ new Error("Could not encode plate")), "image/jpeg", .88);
		}),
		dataUrl: canvas.toDataURL("image/jpeg", .88),
		width,
		height,
		orientation
	};
}
function loadImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => resolve(img);
		img.onerror = () => reject(/* @__PURE__ */ new Error("Could not read image"));
		img.src = src;
	});
}
function fileToDataUrl(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result));
		reader.onerror = () => reject(/* @__PURE__ */ new Error("Could not read file"));
		reader.readAsDataURL(file);
	});
}
function drawToCanvas(img, w, h, type = "image/jpeg", quality = .82) {
	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Canvas unavailable");
	ctx.drawImage(img, 0, 0, w, h);
	return canvas.toDataURL(type, quality);
}
function makeThumb(img, maxEdge = 360) {
	const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
	return drawToCanvas(img, Math.max(1, Math.round(img.width * scale)), Math.max(1, Math.round(img.height * scale)), "image/jpeg", .72);
}
function enhancePlate(img, recipe, maxEdge = 1600) {
	const scale = Math.min(1, maxEdge / Math.max(img.naturalWidth || img.width, img.naturalHeight || img.height));
	const w = Math.max(1, Math.round((img.naturalWidth || img.width) * scale));
	const h = Math.max(1, Math.round((img.naturalHeight || img.height) * scale));
	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Canvas unavailable");
	ctx.filter = recipe === "resell-batch" ? "contrast(1.12) saturate(1.05) brightness(1.04)" : "contrast(1.04) saturate(1.02) brightness(1.03)";
	ctx.drawImage(img, 0, 0, w, h);
	ctx.filter = "none";
	return canvas.toDataURL("image/jpeg", .88);
}
function compressForApi(img, maxEdge = 1280) {
	const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
	return drawToCanvas(img, Math.max(1, Math.round(img.width * scale)), Math.max(1, Math.round(img.height * scale)), "image/jpeg", .8);
}
function gcd(a, b) {
	let x = Math.abs(a);
	let y = Math.abs(b);
	while (y) {
		const t = y;
		y = x % y;
		x = t;
	}
	return x || 1;
}
function aspectLabel(width, height) {
	if (!width || !height) return "—";
	const g = gcd(width, height);
	let a = Math.round(width / g);
	let b = Math.round(height / g);
	const ratio = width / height;
	for (const [r, x, y] of [
		[
			1,
			1,
			1
		],
		[
			3 / 2,
			3,
			2
		],
		[
			2 / 3,
			2,
			3
		],
		[
			4 / 3,
			4,
			3
		],
		[
			3 / 4,
			3,
			4
		],
		[
			16 / 9,
			16,
			9
		],
		[
			9 / 16,
			9,
			16
		],
		[
			5 / 4,
			5,
			4
		],
		[
			4 / 5,
			4,
			5
		]
	]) if (Math.abs(ratio - r) < .04) return `${x}:${y}`;
	if (a > 21 || b > 21) {
		a = Math.round(ratio * 10);
		b = 10;
	}
	return `${a}:${b}`;
}
function formatBytes(n) {
	if (n < 1024) return `${n} B`;
	if (n < 1048576) return `${(n / 1024).toFixed(0)} KB`;
	return `${(n / 1048576).toFixed(1)} MB`;
}
function hex(r, g, b) {
	const h = (n) => n.toString(16).padStart(2, "0");
	return `#${h(r)}${h(g)}${h(b)}`;
}
function luma(r, g, b) {
	return (.2126 * r + .7152 * g + .0722 * b) / 255;
}
function analyzeLowLevel(img) {
	const size = 64;
	const canvas = document.createElement("canvas");
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext("2d", { willReadFrequently: true });
	if (!ctx) return {
		palette: [],
		brightness: 0,
		contrast: 0,
		saturation: 0,
		sharpness: 0,
		temperature: "neutral",
		histogram: Array(24).fill(0),
		orientation: img.width === img.height ? "square" : img.width > img.height ? "landscape" : "portrait",
		aspectLabel: aspectLabel(img.width, img.height)
	};
	ctx.drawImage(img, 0, 0, size, size);
	const { data } = ctx.getImageData(0, 0, size, size);
	const buckets = /* @__PURE__ */ new Map();
	let sumY = 0;
	let sumY2 = 0;
	let sumSat = 0;
	let sumR = 0;
	let sumB = 0;
	const hist = Array(24).fill(0);
	const n = 4096;
	let edge = 0;
	for (let i = 0, p = 0; i < n; i++, p += 4) {
		const r = data[p];
		const g = data[p + 1];
		const b = data[p + 2];
		const y = luma(r, g, b);
		sumY += y;
		sumY2 += y * y;
		sumR += r;
		sumB += b;
		const max = Math.max(r, g, b) / 255;
		const min = Math.min(r, g, b) / 255;
		sumSat += max === 0 ? 0 : (max - min) / max;
		const bin = Math.min(23, Math.floor(y * 24));
		hist[bin] += 1;
		const q = (v) => Math.round(v / 24) * 24;
		const key = `${q(r)}:${q(g)}:${q(b)}`;
		const rec = buckets.get(key);
		if (rec) rec.n += 1;
		else buckets.set(key, {
			r: q(r),
			g: q(g),
			b: q(b),
			n: 1
		});
		if (i % size !== 63) {
			const r2 = data[p + 4];
			const g2 = data[p + 5];
			const b2 = data[p + 6];
			edge += Math.abs(y - luma(r2, g2, b2));
		}
		if (i < 4032) {
			const r2 = data[p + 256];
			const g2 = data[p + 256 + 1];
			const b2 = data[p + 256 + 2];
			edge += Math.abs(y - luma(r2, g2, b2));
		}
	}
	const mean = sumY / n;
	const variance = Math.max(0, sumY2 / n - mean * mean);
	const contrast = Math.min(1, Math.sqrt(variance) * 2.4);
	const sharpness = Math.min(1, edge / n * 3.2);
	const delta = sumR / n - sumB / n;
	const temperature = delta > 12 ? "warm" : delta < -12 ? "cool" : "neutral";
	const palette = [...buckets.values()].sort((a, b) => b.n - a.n).slice(0, 7).map((s) => ({
		hex: hex(Math.min(255, s.r), Math.min(255, s.g), Math.min(255, s.b)),
		pct: s.n / n
	}));
	const ratio = img.width / img.height;
	const orientation = Math.abs(ratio - 1) < .05 ? "square" : ratio > 1 ? "landscape" : "portrait";
	return {
		palette,
		brightness: mean,
		contrast,
		saturation: sumSat / n,
		sharpness,
		temperature,
		histogram: hist.map((v) => v / n),
		orientation,
		aspectLabel: aspectLabel(img.width, img.height)
	};
}
var now = Date.now() - 1728e5;
var SAMPLES = [
	{
		id: "sample-coat",
		src: "/samples/coat.jpg",
		name: "Charcoal coat — wet street, dusk",
		bytes: 470960,
		ledger: "business",
		lane: "resell",
		clientId: "Maya Chen",
		clientFirst: "Maya",
		clientLast: "Chen",
		batchId: "batch-maya",
		groupId: "group-coat",
		catalogCode: "UNB-COAT-CHAR-0001",
		intakeCode: "LB-20260823-0001",
		garment: {
			isGarment: true,
			kind: "coat",
			styleName: "wool coat",
			category: "contemporary",
			colorway: "charcoal",
			pattern: "solid",
			fiberVisible: "wool-look (not confirmed)",
			brandVisible: null,
			sizeVisible: null,
			yearMade: null,
			condition: "excellent",
			defects: [],
			noticeableFeatures: [
				"Long silhouette",
				"Wool-look texture",
				"On-body street plate at dusk"
			],
			era: null,
			photoRole: "fit-on-body",
			resellChannels: ["poshmark", "ebay"],
			groupHint: "charcoal-wool-coat",
			measurementsNeeded: [
				"length",
				"chest",
				"shoulder",
				"label-photo"
			],
			uniqueOrRare: false,
			highEnd: false
		},
		highLevel: {
			title: "Figure in a charcoal coat on a wet dusk street",
			summary: "Editorial fashion frame, subject walking away. Long charcoal wool-look coat, wet pavement, fogged city lights. Shallow depth of field, cool color, 2:3 portrait crop. Usable as an on-body plate for a resale lot, but a flat-lay and label shot are still missing.",
			scene: "Urban sidewalk at dusk, wet weather",
			subjects: [{
				name: "Person in charcoal coat",
				prominence: .7,
				location: "center"
			}, {
				name: "Wet street / city bokeh",
				prominence: .22,
				location: "background"
			}],
			composition: "Vertical. Subject slightly left of center, walking away. Background collapses to lights. Strong figure-ground.",
			mood: [
				"cinematic",
				"solitary",
				"cool",
				"dusk"
			],
			lighting: "Available dusk + street lamps, cool highlights on wet stone",
			style: "Fashion editorial / lookbook",
			quality: {
				score: 8,
				issues: ["Face not visible (intentional)", "Not a packshot — street grade"],
				strengths: [
					"Clear silhouette",
					"Mood-consistent grade",
					"Portrait crop"
				]
			},
			objects: [
				"wool coat",
				"wet pavement",
				"street lights",
				"building facade"
			],
			textInImage: [],
			suggestedCategory: "coat",
			suggestedTags: [
				"coat",
				"charcoal",
				"on-body",
				"dusk",
				"wet-street",
				"resale",
				"missing-label",
				"maya-chen"
			],
			suggestedWorkArea: "resale",
			suggestedCollection: "garments",
			suggestedLedger: "business",
			confidence: .91
		},
		workflow: {
			workArea: "resale",
			title: "Intake note — charcoal coat",
			ranAt: now,
			fields: [
				{
					label: "Kind",
					value: "Coat, long, charcoal"
				},
				{
					label: "Style",
					value: "Wool coat"
				},
				{
					label: "Condition",
					value: "Excellent — observed, no defects in frame"
				},
				{
					label: "Brand",
					value: "None visible"
				},
				{
					label: "Photo role",
					value: "On-body / street"
				},
				{
					label: "Client",
					value: "Maya Chen"
				}
			],
			sections: [{
				heading: "Observed description",
				body: "Long charcoal coat worn on a wet dusk street. Silhouette reads wool-look; fiber, size, and year are not readable. No hangtag or interior label in this plate."
			}, {
				heading: "Catalog note",
				body: "Filed as a business lot for Maya Chen. Sized and rotated. Waiting on your pass-through before any valuation. Need a flat-lay front/back and a label photo before publish."
			}],
			checklist: [
				{ item: "Shoot front and back flat-lay" },
				{ item: "Photograph the care label" },
				{ item: "Record length, chest, and shoulder" },
				{ item: "Do not claim a brand or authenticity" }
			]
		}
	},
	{
		id: "sample-watch",
		src: "/samples/watch.jpg",
		name: "Matte black watch on slate",
		bytes: 479929,
		ledger: "business",
		lane: "resell",
		clientId: "Maya Chen",
		clientFirst: "Maya",
		clientLast: "Chen",
		batchId: "batch-maya",
		groupId: "group-watch",
		catalogCode: "UNB-WATCH-MABL-0001",
		intakeCode: "LB-20260823-0002",
		garment: {
			isGarment: true,
			kind: "watch",
			styleName: "watch",
			category: "accessories",
			colorway: "matte black",
			pattern: "solid",
			fiberVisible: null,
			brandVisible: null,
			sizeVisible: null,
			yearMade: null,
			condition: "like-new",
			defects: [],
			noticeableFeatures: [
				"Matte black case",
				"Dark leather strap",
				"Analog dial, no house mark in frame"
			],
			era: null,
			photoRole: "hero-front",
			resellChannels: ["ebay", "grailed"],
			groupHint: "matte-black-watch",
			measurementsNeeded: [
				"case-diameter",
				"lug-width",
				"case-back"
			],
			uniqueOrRare: false,
			highEnd: true
		},
		edit: {
			recipe: "resell-batch",
			status: "recataloged",
			program: "preview-local",
			bgRemoval: "preview-only",
			enhance: "preview-local",
			recatalogedAt: now - 3e6,
			notes: ["Already a packshot — preview grade only, program TBD for a true cutout"],
			crops: ["1:1"]
		},
		highLevel: {
			title: "Matte black mechanical watch on dark slate",
			summary: "A square studio packshot of a matte-black round watch with a dark leather strap, resting on a slab of dark stone. Soft side light, seamless cool-gray field — ecommerce-ready. No house mark is readable.",
			scene: "Tabletop product still life on stone",
			subjects: [{
				name: "Wristwatch",
				prominence: .72,
				location: "center"
			}, {
				name: "Slate slab",
				prominence: .2,
				location: "under subject"
			}],
			composition: "Dead-center, slight top-down. Square frame. Strap describes a loose S-curve for rhythm.",
			mood: [
				"precise",
				"quiet",
				"premium",
				"studio"
			],
			lighting: "Soft side key, long speculars on the case, no hard shadows",
			style: "Commercial catalog / packshot",
			quality: {
				score: 9,
				issues: ["No scale reference; brand marks not visible"],
				strengths: [
					"Seamless background",
					"Sharp on the dial",
					"Square crop for PDP"
				]
			},
			objects: [
				"watch",
				"leather strap",
				"slate",
				"seamless backdrop"
			],
			textInImage: [],
			suggestedCategory: "watch",
			suggestedTags: [
				"watch",
				"packshot",
				"matte-black",
				"leather-strap",
				"unbranded",
				"resale",
				"maya-chen"
			],
			suggestedWorkArea: "resale",
			suggestedCollection: "accessories",
			suggestedLedger: "business",
			confidence: .95
		},
		workflow: {
			workArea: "resale",
			title: "Intake note — watch packshot",
			ranAt: now,
			fields: [
				{
					label: "Kind",
					value: "Wristwatch, matte black, leather strap"
				},
				{
					label: "Condition",
					value: "Like new — observed"
				},
				{
					label: "Brand",
					value: "None visible"
				},
				{
					label: "Photo role",
					value: "Hero front / packshot"
				},
				{
					label: "Client",
					value: "Maya Chen"
				}
			],
			sections: [{
				heading: "Observed description",
				body: "Round matte-black analog watch with a dark leather strap on slate. Studio lighting, no brand, no serial in this plate."
			}, {
				heading: "Catalog note",
				body: "Same Maya Chen drop as the coat, separate like-item group. You already passed it to valuation. High-end second pass ran — authenticity unverified. Not an appraisal."
			}],
			checklist: [
				{ item: "Photograph case back and any movement marks" },
				{ item: "Measure case diameter and lug width" },
				{ item: "Do not invent a house or movement" }
			]
		}
	},
	{
		id: "sample-living-room",
		src: "/samples/living-room.jpg",
		name: "Living room — steel garden windows",
		bytes: 773343,
		ledger: "personal",
		lane: "log",
		clientId: null,
		clientFirst: null,
		clientLast: null,
		batchId: null,
		groupId: null,
		catalogCode: "LOG-ROOM-OAKX-0001",
		intakeCode: "LB-20260823-0004",
		highLevel: {
			title: "Sunlit mid-century living room with steel garden windows",
			summary: "A staged living room photographed in bright daylight. A low oatmeal sofa sits on oak herringbone floors, facing floor-to-ceiling black steel windows that open the room to a garden.",
			scene: "Furnished residential living room with indoor-outdoor glazing",
			subjects: [
				{
					name: "Linen sofa",
					prominence: .38,
					location: "center"
				},
				{
					name: "Steel-framed windows",
					prominence: .32,
					location: "rear wall"
				},
				{
					name: "Ceramic table lamp",
					prominence: .14,
					location: "right of sofa"
				},
				{
					name: "Abstract painting",
					prominence: .1,
					location: "left wall"
				}
			],
			composition: "Centered, eye-level wide. Furniture is pulled off the walls; the window wall is the vanishing plane.",
			mood: [
				"calm",
				"bright",
				"residential",
				"staged"
			],
			lighting: "Hard natural daylight from rear windows, soft fill from the room",
			style: "Editorial real-estate / architectural interior",
			quality: {
				score: 9,
				issues: ["Slightly cool window highlight; verticals are true"],
				strengths: ["Hero staging with a clear subject", "Uncluttered"]
			},
			objects: [
				"sofa",
				"oak herringbone floor",
				"steel windows",
				"ceramic lamp",
				"side table",
				"abstract painting",
				"garden"
			],
			textInImage: [],
			suggestedCategory: "living-room",
			suggestedTags: [
				"living-room",
				"personal-log",
				"mid-century",
				"steel-windows",
				"oak-herringbone"
			],
			suggestedWorkArea: "real-estate",
			suggestedCollection: "personal",
			suggestedLedger: "personal",
			confidence: .93
		},
		workflow: {
			workArea: "real-estate",
			title: "Personal log — living room",
			ranAt: now,
			fields: [
				{
					label: "Ledger",
					value: "Personal — not in the resale queue"
				},
				{
					label: "Room",
					value: "Living room"
				},
				{
					label: "Light",
					value: "Daylight, rear-lit windows"
				}
			],
			sections: [{
				heading: "Headline",
				body: "Sunlit living room with floor-to-ceiling garden windows"
			}, {
				heading: "Alt text",
				body: "Bright living room with an oatmeal sofa on oak herringbone floors, facing large black steel windows onto a garden."
			}],
			checklist: [{ item: "Keep on the personal ledger unless this is a listing job" }]
		}
	},
	{
		id: "sample-foundation",
		src: "/samples/foundation.jpg",
		name: "Hairline crack — concrete wall",
		bytes: 1079258,
		ledger: "personal",
		lane: "log",
		clientId: null,
		clientFirst: null,
		clientLast: null,
		batchId: null,
		groupId: null,
		catalogCode: "LOG-WALL-CRCK-0001",
		intakeCode: "LB-20260823-0005",
		highLevel: {
			title: "Diagonal hairline crack in poured concrete",
			summary: "Close documentary frame of a poured concrete wall. A fine crack runs diagonally through the field; the surface is stained and slightly damp.",
			scene: "Concrete foundation or retaining wall, close-up",
			subjects: [{
				name: "Hairline crack",
				prominence: .55,
				location: "diagonal across frame"
			}, {
				name: "Poured concrete surface",
				prominence: .35,
				location: "full frame"
			}],
			composition: "Fill-the-frame close-up. The crack is the subject; no scale ruler is present.",
			mood: [
				"forensic",
				"dry",
				"documentary"
			],
			lighting: "Hard daylight, raking across the relief of the crack",
			style: "Inspection / site photography",
			quality: {
				score: 7,
				issues: ["No scale reference", "No wider context shot"],
				strengths: ["Crack path is readable", "Surface texture is clear"]
			},
			objects: [
				"concrete",
				"crack",
				"mineral staining"
			],
			textInImage: [],
			suggestedCategory: "defect",
			suggestedTags: [
				"concrete",
				"hairline-crack",
				"personal-log",
				"inspection"
			],
			suggestedWorkArea: "inspection",
			suggestedCollection: "personal",
			suggestedLedger: "personal",
			confidence: .9
		},
		workflow: {
			workArea: "inspection",
			title: "Personal log — concrete crack",
			ranAt: now,
			fields: [{
				label: "Finding",
				value: "Diagonal hairline crack in poured concrete"
			}, {
				label: "Severity",
				value: "Observe — not a legal or structural verdict"
			}],
			sections: [{
				heading: "Field note",
				body: "Close-up of a hairline crack traversing a poured concrete wall. Record only — this plate does not establish structural cause."
			}],
			checklist: [{ item: "Re-shoot with a scale ruler" }, { item: "Do not write a structural verdict from this close-up" }]
		}
	},
	{
		id: "sample-fern",
		src: "/samples/fern.jpg",
		name: "Framed botanical — fern plate",
		bytes: 609848,
		ledger: "personal",
		lane: "log",
		clientId: null,
		clientFirst: null,
		clientLast: null,
		batchId: null,
		groupId: null,
		catalogCode: "LOG-ART-FERN-0001",
		intakeCode: "LB-20260823-0006",
		highLevel: {
			title: "Framed 19th-century botanical illustration of a fern",
			summary: "Museum lighting on a dark-wood frame. Inside, a cream plate with foxing holds a detailed fern illustration in brown ink.",
			scene: "Framed work on a gallery wall, isolated",
			subjects: [{
				name: "Botanical fern illustration",
				prominence: .62,
				location: "center of plate"
			}, {
				name: "Dark wood frame",
				prominence: .22,
				location: "surround"
			}],
			composition: "Straight-on catalog shot. Frame concentric with the photograph.",
			mood: [
				"archival",
				"quiet",
				"studied"
			],
			lighting: "Soft gallery spotlight, slight falloff at the corners of the frame",
			style: "Collection documentation",
			quality: {
				score: 8,
				issues: ["No verso or scale bar"],
				strengths: ["True color of paper", "Subject fully in frame"]
			},
			objects: [
				"frame",
				"botanical print",
				"fern",
				"foxed paper"
			],
			textInImage: [],
			suggestedCategory: "artwork",
			suggestedTags: [
				"botanical",
				"fern",
				"personal-log",
				"archive"
			],
			suggestedWorkArea: "archive",
			suggestedCollection: "personal",
			suggestedLedger: "personal",
			confidence: .92
		},
		workflow: {
			workArea: "archive",
			title: "Personal log — fern plate",
			ranAt: now,
			fields: [{
				label: "Object type",
				value: "Framed botanical illustration"
			}, {
				label: "Condition",
				value: "Foxing and age toning on the plate; frame intact"
			}],
			sections: [{
				heading: "Description",
				body: "A framed botanical illustration of a fern, photographed straight-on under gallery light."
			}],
			checklist: [{ item: "Photograph verso and any plate inscriptions" }]
		}
	},
	{
		id: "sample-coffee",
		src: "/samples/coffee.jpg",
		name: "Pour-over still life on marble",
		bytes: 359264,
		ledger: "personal",
		lane: "social",
		clientId: null,
		clientFirst: null,
		clientLast: null,
		batchId: null,
		groupId: null,
		catalogCode: "SOC-STILL-MRBL-0001",
		intakeCode: "LB-20260823-0003",
		highLevel: {
			title: "Stoneware pour-over, kettle, and cup on marble",
			summary: "Overhead still life: matte grey stoneware dripper, brushed-steel gooseneck kettle, small unglazed cup, on honed white marble.",
			scene: "Tabletop coffee service, overhead",
			subjects: [
				{
					name: "Gooseneck kettle",
					prominence: .4,
					location: "upper right"
				},
				{
					name: "Pour-over dripper",
					prominence: .28,
					location: "lower left"
				},
				{
					name: "Cup",
					prominence: .14,
					location: "lower right of dripper"
				}
			],
			composition: "Overhead 4:3. Diagonal from kettle to dripper.",
			mood: [
				"ritual",
				"cool",
				"domestic",
				"precise"
			],
			lighting: "Soft north-window daylight, gentle shadows",
			style: "Commercial still life / lifestyle product",
			quality: {
				score: 9,
				issues: ["No steam or pour in progress"],
				strengths: ["Clean marble ground", "Materials readable"]
			},
			objects: [
				"kettle",
				"pour-over dripper",
				"cup",
				"marble slab"
			],
			textInImage: [],
			suggestedCategory: "lifestyle",
			suggestedTags: [
				"coffee",
				"pour-over",
				"social",
				"still-life"
			],
			suggestedWorkArea: "editorial",
			suggestedCollection: "social",
			suggestedLedger: "personal",
			confidence: .94
		},
		workflow: {
			workArea: "editorial",
			title: "Social task — pour-over still life",
			ranAt: now,
			fields: [{
				label: "Lane",
				value: "Social — not inventory"
			}, {
				label: "Edit",
				value: "Minimal grade, crop notes only"
			}],
			sections: [{
				heading: "Caption seed",
				body: "Stoneware pour-over and gooseneck kettle on honed marble."
			}],
			checklist: [{ item: "Throw in the social minimal-edit task" }, { item: "Do not send through resell background removal" }]
		}
	}
];
function sampleToItem(sample, extras) {
	const pretty = sample.garment?.isGarment ? prettyLotName(sample.garment, sample.clientId) : sample.name;
	return {
		id: sample.id,
		name: pretty,
		createdAt: now,
		collectionId: sample.lane === "social" ? "social" : sample.lane === "log" ? "personal" : sample.highLevel.suggestedCollection,
		ledger: sample.ledger,
		lane: sample.lane,
		clientId: sample.clientId,
		clientFirst: sample.clientFirst,
		clientLast: sample.clientLast,
		batchId: sample.batchId,
		groupId: sample.groupId,
		catalogCode: sample.catalogCode,
		intakeCode: sample.intakeCode,
		prepped: true,
		orientationApplied: 1,
		tags: sample.highLevel.suggestedTags,
		mime: "image/jpeg",
		bytes: sample.bytes,
		width: 0,
		height: 0,
		thumbDataUrl: sample.src,
		sampleSrc: sample.src,
		isSample: true,
		category: sample.highLevel.suggestedCategory,
		highLevel: sample.highLevel,
		garment: sample.garment,
		edit: sample.edit,
		workflows: [sample.workflow],
		...extras
	};
}
var COLLECTIONS = [
	{
		id: "inbox",
		label: "Inbox",
		hint: "Unsorted intake"
	},
	{
		id: "garments",
		label: "Garments",
		hint: "Clothes to sell"
	},
	{
		id: "accessories",
		label: "Accessories",
		hint: "Bags, shoes, jewelry, watches"
	},
	{
		id: "social",
		label: "Social",
		hint: "Content for socials — not inventory"
	},
	{
		id: "personal",
		label: "Log",
		hint: "Camera-roll notes, not for resale"
	},
	{
		id: "archive",
		label: "Archive",
		hint: "Listed, done, or reference"
	}
];
var LANES = [
	{
		id: "resell",
		label: "Resell",
		hint: "Items backlogged to sell"
	},
	{
		id: "social",
		label: "Social",
		hint: "Content of you for socials"
	},
	{
		id: "log",
		label: "Log",
		hint: "Personal notes, rooms, field shots"
	}
];
var CONDITIONS = [
	{
		id: "nwt",
		label: "NWT",
		hint: "New with tags visible"
	},
	{
		id: "like-new",
		label: "Like new",
		hint: "No tags, no wear"
	},
	{
		id: "excellent",
		label: "Excellent",
		hint: "Light wear"
	},
	{
		id: "good",
		label: "Good",
		hint: "Normal wear, listable"
	},
	{
		id: "fair",
		label: "Fair",
		hint: "Obvious wear"
	},
	{
		id: "as-is",
		label: "As-is",
		hint: "Damage is the story"
	}
];
var PHOTO_ROLES = [
	{
		id: "hero-front",
		label: "Front"
	},
	{
		id: "hero-back",
		label: "Back"
	},
	{
		id: "side",
		label: "Side"
	},
	{
		id: "detail",
		label: "Detail"
	},
	{
		id: "label",
		label: "Label"
	},
	{
		id: "hangtag",
		label: "Hangtag"
	},
	{
		id: "defect",
		label: "Defect"
	},
	{
		id: "fit-on-body",
		label: "On body"
	},
	{
		id: "in-situ",
		label: "In situ"
	},
	{
		id: "flat-lay",
		label: "Flat lay"
	},
	{
		id: "other",
		label: "Other"
	}
];
var LEDGERS = [{
	id: "business",
	label: "Business",
	hint: "Client lots and resale"
}, {
	id: "personal",
	label: "Personal",
	hint: "Camera-roll catch-up"
}];
function collectionLabel(id) {
	return COLLECTIONS.find((c) => c.id === id)?.label ?? id;
}
function laneLabel(id) {
	return LANES.find((l) => l.id === id)?.label ?? id;
}
function conditionLabel(id) {
	return CONDITIONS.find((c) => c.id === id)?.label ?? id;
}
function roleLabel(id) {
	return PHOTO_ROLES.find((r) => r.id === id)?.label ?? id;
}
function money(n, currency = "USD") {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
		maximumFractionDigits: 0
	}).format(n);
}
function moneyOrDash(n, currency = "USD") {
	if (n == null || !Number.isFinite(n)) return "—";
	return money(n, currency);
}
function uid(prefix) {
	return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}
function persistable(items) {
	return items.map((item) => ({
		...item,
		objectUrl: void 0,
		analyzing: false,
		runningWorkflow: false,
		editing: false,
		analysisError: void 0
	}));
}
function persistGroups(groups) {
	return groups.map((g) => ({
		...g,
		pricing: false,
		templating: false
	}));
}
function plateWrite(item) {
	const m = item.meta;
	return {
		id: item.id,
		lot_id: item.groupId ?? item.id,
		intake_code: item.intakeCode ?? item.id,
		role: item.garment?.photoRole ?? null,
		lane: item.lane,
		bytes: item.bytes,
		width: item.width,
		height: item.height,
		edit_status: item.edit?.status ?? "none",
		taken_at: m?.takenAt ?? null,
		camera: cameraLabel(m),
		iso: m?.iso ?? null,
		focal_mm: m?.focalMm != null ? Math.round(m.focalMm) : null,
		has_gps: m?.hasGps ?? false,
		hash_sha256: m?.hashSha256 ?? null,
		content_hash: m?.contentHash || null,
		dupe_of: item.dupe?.status === "extra" ? item.dupe.ofId : null,
		dupe_kind: item.dupe?.kind ?? null,
		exif_score: item.meta ? exifAccuracy(item.meta, item) : null,
		aperture: m?.aperture ?? null,
		shutter: m?.shutter ?? null
	};
}
var seedItems = SAMPLES.map((sample) => sampleToItem(sample, { thumbDataUrl: sample.src }));
function buildClientPacket(group, price) {
	const r = price.report;
	const ask = price.userList ?? price.listSuggested;
	const round = (group.handshake?.round ?? 0) + 1;
	const who = group.clientId ?? "Client";
	const top = r.market.topOfMarket ?? price.listHigh;
	const faster = r.market.fasterSell ?? price.listLow;
	const features = r.noticeableFeatures.length ? `Features as seen: ${r.noticeableFeatures.join(", ")}.` : null;
	const auth = r.authenticity.status === "not-required" ? null : `Authenticity: ${r.authenticity.status}. ${r.authenticity.note}`.trim();
	return [
		`${who} — round ${round}`,
		group.prettyName,
		"",
		`Condition as observed: ${conditionLabel(r.condition)}.`,
		`Ask: ${money(ask)} on ${price.channel}.`,
		`Top of market ~${money(top)} · faster sell ~${money(faster)}.`,
		`Brand: ${r.brand ?? "none visible"}. Not verified.`,
		features,
		auth,
		r.market.notes || null,
		"",
		"This is an estimated listing range, not an appraisal.",
		"Send back: approve, a different ask, or hold.",
		"Listing is not live until the handshake closes."
	].filter((line) => line !== null).join("\n");
}
function seedLog() {
	const coat = seedItems.find((i) => i.id === "sample-coat");
	const watch = seedItems.find((i) => i.id === "sample-watch");
	const living = seedItems.find((i) => i.id === "sample-living-room");
	const t = coat?.createdAt ?? Date.now();
	return [
		{
			id: "log-intake-maya",
			at: t - 36e5,
			actor: "user",
			type: "intake",
			ledger: "business",
			message: "Maya Chen drop — 2 plates filed, sorted by item then client",
			clientId: "Maya Chen",
			batchId: "batch-maya",
			itemIds: [coat?.id, watch?.id].filter(Boolean)
		},
		{
			id: "log-prep-maya",
			at: t - 34e5,
			actor: "system",
			type: "prep",
			ledger: "business",
			message: "Plates sized and rotated upright — ready for selection",
			clientId: "Maya Chen",
			batchId: "batch-maya"
		},
		{
			id: "log-classify-coat",
			at: t - 33e5,
			actor: "system",
			type: "classify",
			ledger: "business",
			message: "Unbranded wool coat charcoal · Maya Chen · excellent · waiting on pass-through",
			clientId: "Maya Chen",
			groupId: "group-coat",
			itemIds: coat ? [coat.id] : []
		},
		{
			id: "log-pass-watch",
			at: t - 31e5,
			actor: "user",
			type: "select-pass",
			ledger: "business",
			message: "Passed matte black watch to valuation",
			clientId: "Maya Chen",
			groupId: "group-watch"
		},
		{
			id: "log-val-watch",
			at: t - 28e5,
			actor: "system",
			type: "valuation",
			ledger: "business",
			message: "Watch valuation paused · top of market $280 · faster $160 — not an appraisal",
			clientId: "Maya Chen",
			groupId: "group-watch"
		},
		{
			id: "log-auth-watch",
			at: t - 27e5,
			actor: "system",
			type: "auth-pass",
			ledger: "business",
			message: "High-end second pass: no house mark readable — authenticity unverified",
			clientId: "Maya Chen",
			groupId: "group-watch"
		},
		{
			id: "log-pause-watch",
			at: t - 265e4,
			actor: "system",
			type: "price-pause",
			ledger: "business",
			message: "Watch round ready to send to Maya Chen — listing not ready yet",
			clientId: "Maya Chen",
			groupId: "group-watch"
		},
		{
			id: "log-personal",
			at: living?.createdAt ?? t,
			actor: "system",
			type: "intake",
			ledger: "personal",
			message: "Personal roll catch-up — rooms, objects, field notes filed off the resale queue",
			itemIds: seedItems.filter((i) => i.lane === "log").map((i) => i.id)
		},
		{
			id: "log-social-coffee",
			at: t - 24e5,
			actor: "user",
			type: "intake",
			ledger: "personal",
			message: "Social pile — pour-over still life waiting on a minimal edit task",
			itemIds: seedItems.filter((i) => i.lane === "social").map((i) => i.id)
		},
		{
			id: "log-edit-coat-need",
			at: t - 22e5,
			actor: "system",
			type: "edit-queue",
			ledger: "business",
			message: "Coat is on-body street — sell backlog, not ready to post until the resell edit batch",
			clientId: "Maya Chen",
			groupId: "group-coat",
			itemIds: coat ? [coat.id] : []
		}
	];
}
function seedBatches() {
	const coat = seedItems.find((i) => i.id === "sample-coat");
	const watch = seedItems.find((i) => i.id === "sample-watch");
	return [{
		id: "batch-maya",
		label: "Maya Chen intake",
		clientId: "Maya Chen",
		clientFirst: "Maya",
		clientLast: "Chen",
		ledger: "business",
		lane: "resell",
		createdAt: coat?.createdAt ?? Date.now(),
		itemIds: [coat?.id, watch?.id].filter(Boolean),
		status: "ready"
	}];
}
function seedGroups() {
	const coat = seedItems.find((i) => i.id === "sample-coat");
	const watch = seedItems.find((i) => i.id === "sample-watch");
	const draftedAt = (watch?.createdAt ?? Date.now()) - 28e5;
	return [{
		id: "group-coat",
		batchId: "batch-maya",
		key: "unbranded::wool-coat::charcoal::maya-chen",
		label: "Unbranded wool coat charcoal · Maya Chen",
		prettyName: "Unbranded wool coat charcoal · Maya Chen",
		clientId: "Maya Chen",
		clientFirst: "Maya",
		clientLast: "Chen",
		ledger: "business",
		itemIds: coat ? [coat.id] : [],
		catalogCode: "UNB-COAT-CHAR-0001",
		status: "ready"
	}, {
		id: "group-watch",
		batchId: "batch-maya",
		key: "unbranded::watch::matte-black::maya-chen",
		label: "Unbranded watch matte black · Maya Chen",
		prettyName: "Unbranded watch matte black · Maya Chen",
		clientId: "Maya Chen",
		clientFirst: "Maya",
		clientLast: "Chen",
		ledger: "business",
		itemIds: watch ? [watch.id] : [],
		catalogCode: "UNB-WATCH-MABL-0001",
		status: "paused",
		price: {
			listLow: 160,
			listHigh: 280,
			listSuggested: 220,
			userList: null,
			currency: "USD",
			channel: "ebay",
			compsNote: "Unbranded matte-black analog watch on slate, studio packshot. Estimated sold band for similar unbranded fashion watches in like-new condition. Not an appraisal.",
			confidence: .58,
			flags: [
				"no-brand-visible",
				"needs-measurements",
				"high-end-second-pass"
			],
			status: "paused",
			draftedAt,
			report: {
				brand: null,
				size: null,
				yearMade: null,
				yearBasis: "unknown",
				condition: "like-new",
				noticeableFeatures: [
					"Matte black case",
					"Dark leather strap",
					"Analog dial, no house mark in frame"
				],
				vintage30: false,
				vintageNote: null,
				designerVerifiable: "unverified",
				uniqueOrRare: false,
				uniqueNote: null,
				highEnd: true,
				market: {
					soldHigh: 280,
					soldLow: 150,
					daysToSell: 21,
					topOfMarket: 280,
					fasterSell: 165,
					channels: ["ebay", "grailed"],
					notes: "Estimate only. Clean packshot helps; missing case-back and lug width will slow a sale."
				},
				authenticity: {
					status: "unverified",
					tells: [
						"No readable house mark on the dial",
						"Case-back not photographed",
						"Movement not visible"
					],
					note: "Second pass: cannot verify a designer house from this plate. Do not list as a named brand.",
					ranAt: draftedAt
				},
				deeper: {
					ran: false,
					findings: ""
				}
			}
		}
	}];
}
function appendLog(log, partial) {
	return [{
		id: uid("log"),
		at: partial.at ?? Date.now(),
		...partial
	}, ...log].slice(0, 400);
}
function handshakeStatus(h) {
	if (!h) return null;
	if (h.waiting) return "sent";
	if (h.reply?.decision === "decline") return "hold";
	if (h.reply?.decision === "approve") return "client-back";
	return null;
}
function rebuildGroups(items, existing) {
	const buckets = /* @__PURE__ */ new Map();
	for (const item of items) {
		if (!item.garment?.isGarment) continue;
		const key = groupKeyFor(item);
		const list = buckets.get(key) ?? [];
		list.push(item);
		buckets.set(key, list);
	}
	const next = [];
	const used = /* @__PURE__ */ new Set();
	for (const [key, members] of buckets) {
		const prior = existing.find((g) => g.key === key || members.some((m) => g.itemIds.includes(m.id)));
		const id = prior?.id ?? uid("grp");
		used.add(id);
		const ledger = members.every((m) => m.ledger === "personal") ? "personal" : "business";
		let status = prior?.status ?? "sorting";
		const allClassed = members.every((m) => m.highLevel && m.prepped);
		const fromHandshake = handshakeStatus(prior?.handshake);
		if (ledger === "personal") status = prior?.status === "approved" ? prior.status : "ready";
		else if (fromHandshake) status = fromHandshake;
		else if (prior?.price?.status === "paused") status = "paused";
		else if (prior?.price?.status === "sent") status = "sent";
		else if (prior?.price?.status === "approved") status = prior.status === "client-back" ? "client-back" : "approved";
		else if (prior?.price?.status === "hold") status = "hold";
		else if (prior?.status === "pricing") status = "pricing";
		else if (allClassed && !prior?.price) status = "ready";
		const pretty = prettyLotName(members[0]?.garment, members[0]?.clientId);
		next.push({
			...prior ?? { batchId: members[0]?.batchId ?? null },
			id,
			batchId: members[0]?.batchId ?? prior?.batchId ?? null,
			key,
			label: groupLabelFor(members),
			prettyName: pretty,
			clientId: members[0]?.clientId ?? prior?.clientId ?? null,
			clientFirst: members[0]?.clientFirst ?? prior?.clientFirst ?? null,
			clientLast: members[0]?.clientLast ?? prior?.clientLast ?? null,
			ledger,
			itemIds: members.map((m) => m.id),
			catalogCode: prior?.catalogCode ?? members.find((m) => m.catalogCode)?.catalogCode,
			status,
			price: prior?.price,
			template: prior?.template,
			handshake: prior?.handshake
		});
	}
	for (const g of existing) if (!used.has(g.id) && (g.price || g.template || g.handshake)) next.push(g);
	return next;
}
function patchItemsGroupIds(items, groups) {
	const map = /* @__PURE__ */ new Map();
	for (const g of groups) for (const id of g.itemIds) map.set(id, g.id);
	return items.map((i) => ({
		...i,
		groupId: map.get(i.id) ?? i.groupId ?? null
	}));
}
var useStudio = create()(persist((set, get) => ({
	hydrated: true,
	seeded: true,
	items: uniqueById(seedItems),
	batches: seedBatches(),
	groups: seedGroups(),
	log: seedLog(),
	selectedId: seedItems.find((i) => i.id === "sample-coat")?.id ?? seedItems[0]?.id ?? null,
	view: "rail",
	collection: "all",
	ledgerFilter: "all",
	laneFilter: "all",
	query: "",
	lastClientId: "Maya Chen",
	lastClientFirst: "Maya",
	lastClientLast: "Chen",
	lastLedger: "business",
	lastLane: "resell",
	railMode: "sheet",
	hydrate: async () => {
		const existing = get().items;
		if (existing.length === 0 && !get().seeded) set({
			items: uniqueById(seedItems),
			batches: seedBatches(),
			groups: seedGroups(),
			log: seedLog(),
			selectedId: seedItems[0]?.id ?? null,
			hydrated: true,
			seeded: true
		});
		else {
			const next = [];
			for (const item of existing) {
				if (item.isSample && item.sampleSrc) {
					next.push({
						...item,
						analyzing: false,
						runningWorkflow: false
					});
					continue;
				}
				try {
					const blob = await getBlob(item.id);
					if (blob) next.push({
						...item,
						objectUrl: URL.createObjectURL(blob),
						analyzing: false,
						runningWorkflow: false
					});
					else next.push({
						...item,
						analyzing: false,
						runningWorkflow: false
					});
				} catch {
					next.push({
						...item,
						analyzing: false,
						runningWorkflow: false
					});
				}
			}
			set({
				items: uniqueById(next),
				selectedId: get().selectedId ?? next[0]?.id ?? null,
				hydrated: true
			});
		}
		for (const item of get().items) {
			if (!item.isSample || !item.sampleSrc) continue;
			try {
				const img = await loadImage(item.sampleSrc);
				const low = item.lowLevel ?? analyzeLowLevel(img);
				let meta = item.meta;
				if (!meta || !meta.contentHash) {
					const blob = await (await fetch(item.sampleSrc)).blob();
					const file = new File([blob], `${item.id}.jpg`, { type: blob.type || "image/jpeg" });
					meta = {
						...meta ?? await extractImageMeta(file),
						contentHash: contentHashFromImage(img)
					};
				}
				set((s) => ({ items: s.items.map((i) => i.id === item.id ? {
					...i,
					width: img.naturalWidth,
					height: img.naturalHeight,
					thumbDataUrl: i.thumbDataUrl?.startsWith("data:") ? i.thumbDataUrl : makeThumb(img),
					lowLevel: low,
					meta,
					prepped: true
				} : i) }));
			} catch {}
		}
		listCatalog().then(async () => {
			const ready = get().items.filter((i) => i.intakeCode);
			if (!ready.length) return;
			await upsertCatalog({ data: {
				lots: [],
				plates: ready.map((a) => plateWrite(a))
			} });
		}).catch(() => void 0);
	},
	select: (id) => set({
		selectedId: id,
		view: "inspect"
	}),
	setView: (view) => set({ view }),
	setRailMode: (railMode) => set({
		railMode,
		view: "rail"
	}),
	setCollection: (collection) => set({ collection }),
	setLedgerFilter: (ledgerFilter) => set({ ledgerFilter }),
	setLaneFilter: (laneFilter) => set({ laneFilter }),
	setQuery: (query) => set({ query }),
	setLastIntake: (first, last, ledger, lane) => set({
		lastClientFirst: first,
		lastClientLast: last,
		lastClientId: formatClientName(first, last) ?? "",
		lastLedger: ledger,
		lastLane: lane ?? laneForLedger(ledger)
	}),
	addFiles: async (files, opts) => {
		const accepted = files.filter((f) => f.type.startsWith("image/"));
		if (!accepted.length) return;
		const lane = opts?.lane ?? get().lastLane;
		const ledger = opts?.ledger ?? (lane === "resell" ? "business" : "personal");
		const labeled = opts?.labeled === true;
		const first = labeled && lane === "resell" ? (opts?.clientFirst ?? "").trim() : "";
		const last = labeled && lane === "resell" ? (opts?.clientLast ?? "").trim() : "";
		const batchId = uid("batch");
		let minted = [];
		try {
			minted = (await mintIntakeCodes({ data: { count: accepted.length } })).codes;
		} catch {
			minted = accepted.map((_, i) => ({
				intakeCode: `LB-LOCAL-${Date.now().toString(36)}-${i + 1}`,
				inboxCode: `INB-LOCAL-${Date.now().toString(36)}-${i + 1}`
			}));
		}
		const added = [];
		for (let idx = 0; idx < accepted.length; idx++) {
			const file = accepted[idx];
			const id = uid("img");
			const codes = minted[idx] ?? minted[0];
			try {
				const prepped = await prepImageFile(file);
				const meta = await extractImageMeta(file);
				await putBlob(id, prepped.blob);
				const img = await loadImage(prepped.dataUrl);
				const objectUrl = URL.createObjectURL(prepped.blob);
				const fromName = parseClientName(file.name);
				const clientFirst = fromName?.first ?? (first || null);
				const clientLast = fromName?.last ?? (last || null);
				const clientId = formatClientName(clientFirst, clientLast);
				added.push({
					id,
					name: codes.intakeCode,
					createdAt: Date.now(),
					collectionId: lane === "social" ? "social" : lane === "log" ? "personal" : "inbox",
					ledger,
					lane,
					clientId,
					clientFirst,
					clientLast,
					batchId,
					groupId: null,
					catalogCode: codes.inboxCode,
					intakeCode: codes.intakeCode,
					prepped: true,
					orientationApplied: prepped.orientation,
					tags: [],
					mime: file.type || "image/jpeg",
					bytes: prepped.blob.size,
					width: prepped.width,
					height: prepped.height,
					thumbDataUrl: makeThumb(img),
					objectUrl,
					lowLevel: analyzeLowLevel(img),
					meta: {
						...meta,
						contentHash: contentHashFromImage(img)
					},
					workflows: []
				});
			} catch (err) {
				console.error(err);
			}
		}
		if (!added.length) return;
		const marked = uniqueById(markDupes([...added, ...get().items]));
		const addedIds = new Set(added.map((a) => a.id));
		const markedAdded = marked.filter((i) => addedIds.has(i.id));
		const extras = markedAdded.filter((i) => i.dupe?.status === "extra");
		const keepers = markedAdded.filter((i) => i.dupe?.status === "keeper");
		const clientId = lane === "social" || lane === "log" ? null : added[0]?.clientId ?? formatClientName(first, last);
		const batch = {
			id: batchId,
			label: lane === "social" ? "Social dump" : clientId ? `${clientId} intake` : `Dump ${added.length}`,
			clientId,
			clientFirst: clientId ? added[0]?.clientFirst ?? null : null,
			clientLast: clientId ? added[0]?.clientLast ?? null : null,
			ledger,
			lane,
			createdAt: Date.now(),
			itemIds: added.map((a) => a.id),
			status: "sorting"
		};
		set((s) => ({
			items: marked,
			batches: [batch, ...s.batches],
			selectedId: (keepers[0] ?? markedAdded[0]).id,
			view: "rail",
			railMode: "sheet",
			collection: "all",
			seeded: true,
			lastLedger: ledger,
			lastLane: lane,
			log: appendLog(appendLog(appendLog(s.log, {
				actor: "user",
				type: "intake",
				ledger,
				message: `Dump ${added.length} photo${added.length === 1 ? "" : "s"} · ${lane} · no label required`,
				clientId,
				batchId,
				itemIds: added.map((a) => a.id)
			}), {
				actor: "system",
				type: "prep",
				ledger,
				message: `${added.length} plate${added.length === 1 ? "" : "s"} sized, rotated, and given intake codes`,
				clientId,
				batchId
			}), {
				actor: "system",
				type: extras.length ? "dupe" : "meta-extract",
				ledger,
				message: extras.length ? `${keepers.length} keeper${keepers.length === 1 ? "" : "s"} on richest EXIF · ${extras.length} extra${extras.length === 1 ? "" : "s"} filed (hash + content, not deleted)` : `${added.length} plate${added.length === 1 ? "" : "s"} hashed and EXIF-read · no dupes · GPS coords never stored`,
				clientId,
				batchId,
				itemIds: extras.length ? extras.map((e) => e.id) : added.map((a) => a.id)
			})
		}));
		try {
			await upsertCatalog({ data: {
				lots: markedAdded.map((a) => ({
					id: a.id,
					catalog_code: a.catalogCode ?? a.intakeCode ?? a.id,
					pretty_name: a.intakeCode ?? a.name,
					brand: null,
					kind: null,
					style_name: null,
					colorway: null,
					condition: null,
					lane: a.lane,
					collection: a.collectionId,
					status: "intake",
					plate_count: 1
				})),
				plates: markedAdded.map((a) => plateWrite(a))
			} });
		} catch {}
		for (const item of markedAdded) {
			if (item.dupe?.status === "extra") continue;
			get().analyze(item.id);
		}
	},
	remove: async (id) => {
		const item = get().items.find((i) => i.id === id);
		if (item?.objectUrl) URL.revokeObjectURL(item.objectUrl);
		if (item && !item.isSample) await deleteBlob(id).catch(() => void 0);
		set((s) => {
			const items = s.items.filter((i) => i.id !== id);
			return {
				items,
				groups: rebuildGroups(items, s.groups).map((g) => ({
					...g,
					itemIds: g.itemIds.filter((x) => x !== id)
				})),
				batches: s.batches.map((b) => ({
					...b,
					itemIds: b.itemIds.filter((x) => x !== id)
				})),
				selectedId: s.selectedId === id ? items[0]?.id ?? null : s.selectedId,
				log: appendLog(s.log, {
					actor: "user",
					type: "delete",
					ledger: item?.ledger ?? "business",
					message: `Removed ${item?.name ?? "plate"} from the working catalog`,
					clientId: item?.clientId,
					itemIds: [id]
				})
			};
		});
	},
	promoteKeeper: (id) => {
		set((s) => {
			const target = s.items.find((i) => i.id === id);
			if (!target) return s;
			const ofId = target.dupe?.ofId ?? target.id;
			const cluster = s.items.filter((i) => i.id === ofId || i.dupe?.ofId === ofId);
			if (cluster.length < 2) return s;
			const keeperScore = exifAccuracy(target.meta, target);
			return {
				items: s.items.map((i) => {
					if (!cluster.some((c) => c.id === i.id)) return i;
					const extra = i.id !== target.id;
					const score = exifAccuracy(i.meta, i);
					const rec = {
						kind: i.meta?.hashSha256 && i.meta.hashSha256 === target.meta?.hashSha256 ? "hash" : "content",
						ofId: target.id,
						ofIntake: target.intakeCode,
						score,
						keeperScore,
						status: extra ? "extra" : "keeper",
						reason: extra ? `Operator picked ${target.intakeCode ?? target.id} as canonical` : `Canonical · operator override`
					};
					return {
						...i,
						dupe: rec,
						tags: extra ? [...i.tags.filter((t) => t !== "duplicate-keeper" && t !== "duplicate-extra"), "duplicate-extra"] : [...i.tags.filter((t) => t !== "duplicate-keeper" && t !== "duplicate-extra"), "duplicate-keeper"]
					};
				}),
				selectedId: id,
				log: appendLog(s.log, {
					actor: "user",
					type: "dupe",
					ledger: target.ledger,
					message: `Promoted ${target.intakeCode ?? target.name} as canonical EXIF plate`,
					itemIds: cluster.map((c) => c.id)
				})
			};
		});
	},
	recategorize: (id, collectionId) => set((s) => ({ items: s.items.map((i) => i.id === id ? {
		...i,
		collectionId
	} : i) })),
	setItemLedger: (id, ledger) => {
		set((s) => {
			const items = s.items.map((i) => {
				if (i.id !== id) return i;
				const lane = ledger === "personal" && i.lane === "resell" ? "log" : i.lane;
				return {
					...i,
					ledger,
					lane,
					collectionId: collectionFor({
						...i,
						ledger,
						lane
					})
				};
			});
			const groups = rebuildGroups(items, s.groups);
			const item = items.find((i) => i.id === id);
			return {
				items: patchItemsGroupIds(items, groups),
				groups,
				log: appendLog(s.log, {
					actor: "user",
					type: "move-ledger",
					ledger,
					message: `Moved ${item?.name ?? "plate"} to ${ledger} ledger`,
					clientId: item?.clientId,
					itemIds: [id]
				})
			};
		});
	},
	setItemLane: (id, lane) => {
		set((s) => {
			const items = s.items.map((i) => {
				if (i.id !== id) return i;
				const ledger = lane === "resell" ? "business" : "personal";
				return {
					...i,
					lane,
					ledger,
					collectionId: collectionFor({
						...i,
						lane,
						ledger
					})
				};
			});
			const groups = rebuildGroups(items, s.groups);
			const item = items.find((i) => i.id === id);
			return {
				items: patchItemsGroupIds(items, groups),
				groups,
				lastLane: lane,
				log: appendLog(s.log, {
					actor: "user",
					type: "lane-move",
					ledger: item?.ledger ?? "business",
					message: `Moved ${item?.name ?? "plate"} to the ${lane} lane`,
					clientId: item?.clientId,
					itemIds: [id]
				})
			};
		});
	},
	setItemClient: (id, first, last) => {
		const clientId = formatClientName(first, last);
		set((s) => {
			const items = s.items.map((i) => i.id === id ? {
				...i,
				clientId,
				clientFirst: first,
				clientLast: last
			} : i);
			const groups = rebuildGroups(items, s.groups);
			const item = items.find((i) => i.id === id);
			return {
				items: patchItemsGroupIds(items, groups),
				groups,
				lastClientId: clientId ?? s.lastClientId,
				lastClientFirst: first ?? s.lastClientFirst,
				lastClientLast: last ?? s.lastClientLast,
				log: appendLog(s.log, {
					actor: "user",
					type: "assign-client",
					ledger: item?.ledger ?? "business",
					message: clientId ? `Assigned ${prettyLotName(item?.garment, clientId)}` : `Cleared client on ${item?.name ?? "plate"}`,
					clientId,
					itemIds: [id]
				})
			};
		});
	},
	analyze: async (id) => {
		const item = get().items.find((i) => i.id === id);
		if (!item) return;
		set((s) => ({ items: s.items.map((i) => i.id === id ? {
			...i,
			analyzing: true,
			analysisError: void 0
		} : i) }));
		try {
			const src = item.objectUrl ?? item.sampleSrc;
			if (!src) throw new Error("Image bytes missing");
			const result = await analyzeImage({ data: { imageDataUrl: compressForApi(await loadImage(src)) } });
			if (!result.ok) throw new Error(result.error);
			const hl = result.analysis;
			const garment = result.garment;
			set((s) => {
				const items = s.items.map((i) => {
					if (i.id !== id) return i;
					const lane = i.lane;
					const ledger = i.collectionId === "inbox" ? lane === "resell" ? "business" : "personal" : i.ledger;
					const catalogPretty = garment?.isGarment ? prettyCatalogName(garment.brandVisible, garment.styleName || garment.kind, garment.colorway) : "";
					const pretty = garment?.isGarment ? i.clientId ? `${catalogPretty} · ${i.clientId}` : catalogPretty : prettyLotName(garment, i.clientId);
					return {
						...i,
						analyzing: false,
						highLevel: hl,
						garment,
						name: pretty || hl.title || i.name,
						tags: hl.suggestedTags.length ? hl.suggestedTags : i.tags,
						category: hl.suggestedCategory,
						ledger,
						lane,
						collectionId: i.collectionId === "inbox" ? collectionFor({
							ledger,
							lane,
							garment,
							highLevel: hl
						}) : i.collectionId
					};
				});
				const groups = rebuildGroups(items, s.groups);
				const patched = patchItemsGroupIds(items, groups);
				const row = patched.find((i) => i.id === id);
				return {
					items: patched,
					groups,
					log: appendLog(s.log, {
						actor: "system",
						type: "classify",
						ledger: row?.ledger ?? "business",
						message: garment?.isGarment ? `${prettyLotName(garment, row?.clientId)} · ${garment.condition} · ready for selection` : `${hl.title} filed (not a garment)`,
						clientId: row?.clientId,
						itemIds: [id],
						groupId: row?.groupId ?? void 0
					})
				};
			});
			if (garment?.isGarment) {
				const row = get().items.find((i) => i.id === id);
				const needsSku = !row?.catalogCode || /^(INB-|LB-LOCAL)/.test(row.catalogCode);
				let catalogCode = row?.catalogCode;
				let prettyName = prettyCatalogName(garment.brandVisible, garment.styleName || garment.kind, garment.colorway);
				if (needsSku) try {
					const minted = await mintLotCode({ data: {
						brand: garment.brandVisible,
						kind: garment.kind,
						colorway: garment.colorway,
						style: garment.styleName
					} });
					catalogCode = minted.catalogCode;
					prettyName = minted.prettyName;
				} catch {}
				if (catalogCode) {
					set((s) => {
						const items = s.items.map((i) => i.id === id ? {
							...i,
							catalogCode,
							name: i.clientId ? `${prettyName} · ${i.clientId}` : prettyName
						} : i);
						const groups = rebuildGroups(items, s.groups).map((g) => g.itemIds.includes(id) ? {
							...g,
							catalogCode: catalogCode ?? g.catalogCode
						} : g);
						return {
							items: patchItemsGroupIds(items, groups),
							groups
						};
					});
					const updated = get().items.find((i) => i.id === id);
					if (updated) try {
						await upsertCatalog({ data: {
							lots: [{
								id: updated.groupId ?? updated.id,
								catalog_code: catalogCode,
								pretty_name: prettyName,
								brand: garment.brandVisible || "Unbranded",
								kind: garment.kind,
								style_name: garment.styleName,
								colorway: garment.colorway,
								condition: garment.condition,
								lane: updated.lane,
								collection: updated.collectionId,
								status: "ready",
								plate_count: 1
							}],
							plates: [plateWrite({
								...updated,
								catalogCode
							})]
						} });
					} catch {}
				}
			}
		} catch (err) {
			set((s) => ({ items: s.items.map((i) => i.id === id ? {
				...i,
				analyzing: false,
				analysisError: err instanceof Error ? err.message : "Analysis failed"
			} : i) }));
		}
	},
	runWorkflow: async (id, workArea) => {
		const item = get().items.find((i) => i.id === id);
		if (!item?.highLevel) return;
		if (workArea === "resale") {
			const gid = item.groupId;
			set({ view: gid ? "rail" : "inspect" });
			return;
		}
		set((s) => ({
			items: s.items.map((i) => i.id === id ? {
				...i,
				runningWorkflow: true
			} : i),
			view: "inspect"
		}));
		try {
			const src = item.objectUrl ?? item.sampleSrc;
			if (!src) throw new Error("Image bytes missing");
			const img = await loadImage(src);
			const ll = item.lowLevel;
			const lowLevelSummary = ll ? `aspect ${ll.aspectLabel}, ${ll.orientation}, brightness ${ll.brightness.toFixed(2)}, contrast ${ll.contrast.toFixed(2)}, saturation ${ll.saturation.toFixed(2)}, sharpness ${ll.sharpness.toFixed(2)}, temperature ${ll.temperature}, palette ${ll.palette.map((p) => p.hex).join(", ")}` : "none";
			const result = await runWorkArea({ data: {
				imageDataUrl: compressForApi(img),
				workArea,
				highLevel: item.highLevel,
				lowLevelSummary
			} });
			if (!result.ok) throw new Error(result.error);
			set((s) => ({ items: s.items.map((i) => i.id === id ? {
				...i,
				runningWorkflow: false,
				workflows: [result.workflow, ...i.workflows.filter((w) => w.workArea !== workArea)]
			} : i) }));
		} catch (err) {
			set((s) => ({ items: s.items.map((i) => i.id === id ? {
				...i,
				runningWorkflow: false,
				analysisError: err instanceof Error ? err.message : "Workflow failed"
			} : i) }));
		}
	},
	queueForEdit: (ids, recipe) => {
		const unique = [...new Set(ids)];
		if (!unique.length) return;
		set((s) => {
			const items = s.items.map((i) => {
				if (!unique.includes(i.id)) return i;
				const plan = editPlanFor({
					...i,
					lane: recipe === "social-minimal" ? "social" : "resell"
				});
				return {
					...i,
					edit: {
						recipe,
						status: "queued",
						program: "tbd",
						queuedAt: Date.now(),
						bgRemoval: plan.bgRemoval,
						enhance: plan.enhance,
						notes: plan.notes,
						crops: plan.crops,
						previewUrl: i.edit?.previewUrl
					}
				};
			});
			const first = items.find((i) => unique.includes(i.id));
			return {
				items,
				view: "edit",
				log: appendLog(s.log, {
					actor: "user",
					type: "edit-queue",
					ledger: first?.ledger ?? "business",
					message: recipe === "social-minimal" ? `Threw ${unique.length} plate${unique.length === 1 ? "" : "s"} into the social minimal-edit task` : `Queued ${unique.length} plate${unique.length === 1 ? "" : "s"} for the resell ready-to-post batch · program TBD`,
					clientId: first?.clientId,
					itemIds: unique
				})
			};
		});
	},
	dequeueEdit: (ids) => {
		const unique = [...new Set(ids)];
		if (!unique.length) return;
		set((s) => ({ items: s.items.map((i) => {
			if (!unique.includes(i.id) || !i.edit) return i;
			if (i.edit.status !== "queued" && i.edit.status !== "processing") return i;
			return {
				...i,
				editing: false,
				edit: {
					...i.edit,
					status: "none"
				}
			};
		}) }));
	},
	runQueuedEdits: async (recipe) => {
		const queued = uniqueById(get().items.filter((i) => i.edit?.recipe === recipe && (i.edit.status === "queued" || i.edit.status === "processing")));
		if (!queued.length) return;
		for (const item of queued) {
			set((s) => ({ items: s.items.map((i) => i.id === item.id ? {
				...i,
				editing: true,
				edit: i.edit ? {
					...i.edit,
					status: "processing"
				} : i.edit
			} : i) }));
			try {
				const previewUrl = enhancePlate(await loadImage(item.objectUrl ?? item.sampleSrc ?? item.thumbDataUrl), recipe);
				const plan = editPlanFor(item);
				set((s) => ({
					items: s.items.map((i) => i.id === item.id ? {
						...i,
						editing: false,
						edit: {
							recipe,
							status: "ready-to-post",
							program: "preview-local",
							queuedAt: i.edit?.queuedAt,
							ranAt: Date.now(),
							bgRemoval: plan.bgRemoval,
							enhance: "preview-local",
							previewUrl,
							notes: plan.notes,
							crops: plan.crops
						}
					} : i),
					log: appendLog(s.log, {
						actor: "system",
						type: "ready-to-post",
						ledger: item.ledger,
						message: recipe === "social-minimal" ? `${item.name} social-ready · minimal preview grade` : `${item.name} ready-to-post preview · bg ${plan.bgRemoval} · program still TBD`,
						clientId: item.clientId,
						itemIds: [item.id],
						groupId: item.groupId ?? void 0
					})
				}));
			} catch (err) {
				set((s) => ({ items: s.items.map((i) => i.id === item.id ? {
					...i,
					editing: false,
					analysisError: err instanceof Error ? err.message : "Edit failed",
					edit: i.edit ? {
						...i.edit,
						status: "queued"
					} : i.edit
				} : i) }));
			}
		}
	},
	recatalogEdited: (ids) => {
		const unique = [...new Set(ids)];
		set((s) => {
			const items = s.items.map((i) => {
				if (!unique.includes(i.id) || i.edit?.status !== "ready-to-post") return i;
				const tags = i.tags.includes("ready-to-post") ? i.tags : [...i.tags, "ready-to-post"];
				return {
					...i,
					tags,
					edit: {
						...i.edit,
						status: "recataloged",
						recatalogedAt: Date.now()
					}
				};
			});
			const groups = rebuildGroups(items, s.groups);
			const first = items.find((i) => unique.includes(i.id));
			return {
				items: patchItemsGroupIds(items, groups),
				groups,
				view: first?.lane === "resell" ? "rail" : "edit",
				log: appendLog(s.log, {
					actor: "user",
					type: "recatalog",
					ledger: first?.ledger ?? "business",
					message: first?.lane === "resell" ? `Recataloged ${unique.length} listing plate${unique.length === 1 ? "" : "s"} — valuation may run or refine` : `Recataloged ${unique.length} social plate${unique.length === 1 ? "" : "s"} — not inventory`,
					clientId: first?.clientId,
					itemIds: unique
				})
			};
		});
	},
	rejectEdited: (ids) => {
		const unique = [...new Set(ids)];
		if (!unique.length) return;
		set((s) => {
			const items = s.items.map((i) => {
				if (!unique.includes(i.id) || i.edit?.status !== "ready-to-post") return i;
				const notes = i.edit.notes.includes("Rejected from ready-to-post") ? i.edit.notes : [...i.edit.notes, "Rejected from ready-to-post"];
				return {
					...i,
					editing: false,
					edit: {
						...i.edit,
						status: "queued",
						notes,
						previewUrl: i.edit.previewUrl
					}
				};
			});
			const first = items.find((i) => unique.includes(i.id));
			return {
				items,
				log: appendLog(s.log, {
					actor: "user",
					type: "edit-queue",
					ledger: first?.ledger ?? "business",
					message: `Sent ${unique.length} plate${unique.length === 1 ? "" : "s"} back to the batch`,
					clientId: first?.clientId,
					itemIds: unique
				})
			};
		});
	},
	passToValuation: async (groupIds) => {
		const unique = [...new Set(groupIds)];
		if (!unique.length) return;
		set((s) => ({
			log: appendLog(s.log, {
				actor: "user",
				type: "select-pass",
				ledger: "business",
				message: `Passed ${unique.length} lot${unique.length === 1 ? "" : "s"} to valuation`,
				itemIds: unique.flatMap((id) => s.groups.find((g) => g.id === id)?.itemIds ?? [])
			}),
			view: "approve"
		}));
		for (const id of unique) await get().priceGroup(id);
	},
	priceGroup: async (groupId) => {
		const group = get().groups.find((g) => g.id === groupId);
		if (!group || group.ledger !== "business") return;
		const members = get().items.filter((i) => group.itemIds.includes(i.id));
		const hero = members.find((m) => m.garment?.photoRole === "hero-front") ?? members.find((m) => m.garment?.isGarment) ?? members[0];
		if (!hero?.garment?.isGarment || !hero.highLevel) return;
		set((s) => ({
			groups: s.groups.map((g) => g.id === groupId ? {
				...g,
				pricing: true,
				status: "pricing"
			} : g),
			view: "approve"
		}));
		try {
			const src = hero.objectUrl ?? hero.sampleSrc;
			if (!src) throw new Error("Image bytes missing");
			const img = await loadImage(src);
			const ll = hero.lowLevel;
			const lowLevelSummary = ll ? `aspect ${ll.aspectLabel}, sharpness ${ll.sharpness.toFixed(2)}, brightness ${ll.brightness.toFixed(2)}, temperature ${ll.temperature}` : "none";
			const result = await evaluatePrice({ data: {
				imageDataUrl: compressForApi(img),
				garment: hero.garment,
				highLevel: hero.highLevel,
				lowLevelSummary,
				photoCount: members.length,
				roles: members.map((m) => m.garment?.photoRole ?? "other")
			} });
			if (!result.ok) throw new Error(result.error);
			let price = result.price;
			const payload = compressForApi(img);
			if (price.report.uniqueOrRare || price.report.vintage30) {
				const deep = await runSecondPass({ data: {
					imageDataUrl: payload,
					kind: "deeper",
					garment: hero.garment,
					report: price.report,
					highLevel: hero.highLevel
				} });
				if (deep.ok && deep.deeper) price = {
					...price,
					report: {
						...price.report,
						deeper: deep.deeper
					}
				};
			}
			if (price.report.highEnd || price.report.designerVerifiable === "needs-second-pass" || price.report.designerVerifiable === "label-present") {
				const auth = await runSecondPass({ data: {
					imageDataUrl: payload,
					kind: "authenticity",
					garment: hero.garment,
					report: price.report,
					highLevel: hero.highLevel
				} });
				if (auth.ok && auth.authenticity) price = {
					...price,
					report: {
						...price.report,
						authenticity: auth.authenticity
					}
				};
			}
			set((s) => ({
				groups: s.groups.map((g) => g.id === groupId ? {
					...g,
					pricing: false,
					status: "paused",
					price,
					template: void 0
				} : g),
				log: appendLog(appendLog(appendLog(s.log, {
					actor: "system",
					type: "valuation",
					ledger: "business",
					message: `${group.prettyName} valuation · top ${price.report.market.topOfMarket ?? price.listHigh} · faster ${price.report.market.fasterSell ?? price.listLow}`,
					clientId: group.clientId,
					groupId
				}), {
					actor: "system",
					type: "price-pause",
					ledger: "business",
					message: `${group.prettyName} paused — send this round to ${group.clientId ?? "the client"}`,
					clientId: group.clientId,
					groupId
				}), price.report.authenticity.status !== "not-required" ? {
					actor: "system",
					type: "auth-pass",
					ledger: "business",
					message: `${group.prettyName} authenticity ${price.report.authenticity.status}`,
					clientId: group.clientId,
					groupId
				} : price.report.deeper.ran ? {
					actor: "system",
					type: "deeper-pass",
					ledger: "business",
					message: `${group.prettyName} deeper vintage/unique pass filed`,
					clientId: group.clientId,
					groupId
				} : {
					actor: "system",
					type: "price-draft",
					ledger: "business",
					message: `${group.prettyName} draft range ${price.listLow}–${price.listHigh}`,
					clientId: group.clientId,
					groupId
				})
			}));
		} catch (err) {
			set((s) => ({
				groups: s.groups.map((g) => g.id === groupId ? {
					...g,
					pricing: false,
					status: "ready"
				} : g),
				items: s.items.map((i) => group.itemIds.includes(i.id) ? {
					...i,
					analysisError: err instanceof Error ? err.message : "Valuation failed"
				} : i)
			}));
		}
	},
	adjustPrice: (groupId, userList) => {
		const n = Math.max(1, Math.round(userList));
		set((s) => {
			const group = s.groups.find((g) => g.id === groupId);
			return {
				groups: s.groups.map((g) => g.id === groupId && g.price ? {
					...g,
					price: {
						...g.price,
						userList: n,
						status: "paused"
					},
					template: void 0
				} : g),
				log: appendLog(s.log, {
					actor: "user",
					type: "price-adjust",
					ledger: "business",
					message: `${group?.prettyName ?? "Lot"} list price adjusted to $${n} — still paused`,
					clientId: group?.clientId,
					groupId
				})
			};
		});
	},
	sendToClient: (groupId) => {
		const group = get().groups.find((g) => g.id === groupId);
		if (!group?.price) return;
		const ask = group.price.userList ?? group.price.listSuggested;
		const packet = buildClientPacket(group, {
			...group.price,
			userList: ask
		});
		const handshake = {
			id: uid("hs"),
			round: (group.handshake?.round ?? 0) + 1,
			sentAt: Date.now(),
			packet,
			listAsk: ask,
			channel: group.price.channel,
			waiting: true
		};
		set((s) => ({
			groups: s.groups.map((g) => g.id === groupId ? {
				...g,
				status: "sent",
				price: {
					...g.price,
					userList: ask,
					status: "sent"
				},
				handshake
			} : g),
			view: "clients",
			log: appendLog(appendLog(s.log, {
				actor: "user",
				type: "send-client",
				ledger: "business",
				message: `Round ${handshake.round} sent to ${group.clientId ?? "unassigned"} · ask ${money(ask)} · waiting on send-back`,
				clientId: group.clientId,
				groupId
			}), {
				actor: "system",
				type: "list-hold",
				ledger: "business",
				message: `${group.prettyName} listing not ready yet — handshake open in the CRM`,
				clientId: group.clientId,
				groupId
			})
		}));
	},
	recordClientBack: async (groupId, decision, opts) => {
		const group = get().groups.find((g) => g.id === groupId);
		const handshake = group?.handshake;
		if (!group || !handshake || !group.price) return;
		const note = opts?.note?.trim() ?? "";
		const listPrice = decision === "adjust" ? Math.max(1, Math.round(opts?.listPrice ?? handshake.listAsk)) : decision === "approve" ? opts?.listPrice ?? handshake.listAsk : null;
		const reply = {
			at: Date.now(),
			decision,
			listPrice,
			note
		};
		const who = group.clientId ?? "Client";
		if (decision === "decline") {
			set((s) => ({
				groups: s.groups.map((g) => g.id === groupId ? {
					...g,
					status: "hold",
					price: g.price ? {
						...g.price,
						status: "hold"
					} : g.price,
					handshake: {
						...g.handshake,
						waiting: false,
						reply
					}
				} : g),
				log: appendLog(s.log, {
					actor: "client",
					type: "client-back",
					ledger: "business",
					message: `${who} sent back decline on ${group.prettyName}${note ? ` — ${note}` : ""} · held, not listed`,
					clientId: group.clientId,
					groupId
				})
			}));
			return;
		}
		if (decision === "adjust") {
			const n = listPrice ?? handshake.listAsk;
			set((s) => ({
				groups: s.groups.map((g) => g.id === groupId ? {
					...g,
					status: "paused",
					price: g.price ? {
						...g.price,
						userList: n,
						status: "paused"
					} : g.price,
					handshake: {
						...g.handshake,
						waiting: false,
						reply
					},
					template: void 0
				} : g),
				view: "approve",
				log: appendLog(appendLog(s.log, {
					actor: "client",
					type: "client-back",
					ledger: "business",
					message: `${who} sent back a different ask · ${money(n)} on ${group.prettyName}`,
					clientId: group.clientId,
					groupId
				}), {
					actor: "system",
					type: "price-pause",
					ledger: "business",
					message: `Round ${handshake.round + 1} waiting — send the revised ask back to ${who}`,
					clientId: group.clientId,
					groupId
				})
			}));
			return;
		}
		set((s) => ({
			groups: s.groups.map((g) => g.id === groupId ? {
				...g,
				status: "client-back",
				price: g.price ? {
					...g.price,
					userList: listPrice ?? handshake.listAsk,
					status: "approved"
				} : g.price,
				handshake: {
					...g.handshake,
					waiting: false,
					reply
				}
			} : g),
			log: appendLog(s.log, {
				actor: "client",
				type: "client-back",
				ledger: "business",
				message: `${who} sent back approval on ${group.prettyName} at ${money(listPrice ?? handshake.listAsk)}${note ? ` — ${note}` : ""}`,
				clientId: group.clientId,
				groupId
			})
		}));
		await get().approveGroup(groupId);
	},
	approveGroup: async (groupId) => {
		const group = get().groups.find((g) => g.id === groupId);
		if (!group?.price) return;
		const approved = group.price.userList ?? group.price.listSuggested;
		const members = get().items.filter((i) => group.itemIds.includes(i.id));
		const hero = members.find((m) => m.garment?.photoRole === "hero-front") ?? members[0];
		if (!hero?.garment || !hero.highLevel) return;
		const fromClient = group.handshake?.reply?.decision === "approve";
		set((s) => ({ groups: s.groups.map((g) => g.id === groupId ? {
			...g,
			templating: true
		} : g) }));
		try {
			const src = hero.objectUrl ?? hero.sampleSrc;
			if (!src) throw new Error("Image bytes missing");
			const result = await buildListingTemplate({ data: {
				imageDataUrl: compressForApi(await loadImage(src)),
				garment: hero.garment,
				highLevel: hero.highLevel,
				approvedList: approved,
				channel: group.price.channel,
				compsNote: group.price.compsNote
			} });
			if (!result.ok) throw new Error(result.error);
			set((s) => ({
				groups: s.groups.map((g) => g.id === groupId ? {
					...g,
					templating: false,
					status: fromClient ? "client-back" : "approved",
					price: {
						...g.price,
						userList: approved,
						status: "approved",
						approvedAt: Date.now()
					},
					template: result.template
				} : g),
				log: appendLog(appendLog(appendLog(s.log, {
					actor: fromClient ? "client" : "user",
					type: "approve",
					ledger: "business",
					message: `${group.prettyName} stamped at $${approved} · ${group.price?.channel ?? "channel"}`,
					clientId: group.clientId,
					groupId
				}), {
					actor: "system",
					type: "template",
					ledger: "business",
					message: `Listing copy drafted for ${group.prettyName} after handshake`,
					clientId: group.clientId,
					groupId
				}), {
					actor: "system",
					type: "list-hold",
					ledger: "business",
					message: `${group.prettyName} is not ready to list — packet lives in the CRM`,
					clientId: group.clientId,
					groupId
				})
			}));
		} catch (err) {
			set((s) => ({
				groups: s.groups.map((g) => g.id === groupId ? {
					...g,
					templating: false,
					status: fromClient ? "client-back" : "approved",
					price: {
						...g.price,
						userList: approved,
						status: "approved",
						approvedAt: Date.now()
					}
				} : g),
				items: s.items.map((i) => i.id === hero.id ? {
					...i,
					analysisError: err instanceof Error ? err.message : "Template failed after approval"
				} : i),
				log: appendLog(s.log, {
					actor: fromClient ? "client" : "user",
					type: "approve",
					ledger: "business",
					message: `${group.prettyName} stamped at $${approved} (template pending retry)`,
					clientId: group.clientId,
					groupId
				})
			}));
		}
	},
	holdGroup: (groupId) => {
		set((s) => {
			const group = s.groups.find((g) => g.id === groupId);
			return {
				groups: s.groups.map((g) => g.id === groupId ? {
					...g,
					status: "hold",
					price: g.price ? {
						...g.price,
						status: "hold"
					} : g.price
				} : g),
				log: appendLog(s.log, {
					actor: "user",
					type: "hold",
					ledger: "business",
					message: `${group?.prettyName ?? "Lot"} held — no send, no list`,
					clientId: group?.clientId,
					groupId
				})
			};
		});
	}
}), {
	name: "lotbook-intake-v7",
	skipHydration: true,
	partialize: (s) => ({
		items: persistable(s.items),
		batches: s.batches,
		groups: persistGroups(s.groups),
		log: s.log.slice(0, 200),
		selectedId: s.selectedId,
		collection: s.collection,
		ledgerFilter: s.ledgerFilter,
		laneFilter: s.laneFilter,
		seeded: s.seeded,
		lastClientId: s.lastClientId,
		lastClientFirst: s.lastClientFirst,
		lastClientLast: s.lastClientLast,
		lastLedger: s.lastLedger,
		lastLane: s.lastLane,
		railMode: s.railMode
	})
}));
function itemSrc(item, preferEdit = true) {
	if (preferEdit && item.edit?.previewUrl && (item.edit.status === "ready-to-post" || item.edit.status === "recataloged")) return item.edit.previewUrl;
	return item.objectUrl ?? item.sampleSrc ?? item.thumbDataUrl;
}
function matchesQuery(item, query, collection, ledger = "all", lane = "all") {
	if (collection !== "all" && item.collectionId !== collection) return false;
	if (ledger !== "all" && item.ledger !== ledger) return false;
	if (lane !== "all" && item.lane !== lane) return false;
	const q = query.trim().toLowerCase();
	if (!q) return true;
	return [
		item.name,
		item.category,
		item.collectionId,
		item.ledger,
		item.lane,
		item.clientId,
		item.clientFirst,
		item.clientLast,
		...item.tags,
		item.highLevel?.title,
		item.highLevel?.summary,
		item.garment?.kind,
		item.garment?.styleName,
		item.garment?.colorway,
		item.garment?.brandVisible,
		item.garment?.condition
	].filter(Boolean).join(" ").toLowerCase().includes(q);
}
function copy(text) {
	navigator.clipboard.writeText(text);
}
function localLotRows(items) {
	const byCode = /* @__PURE__ */ new Map();
	for (const item of items) {
		const code = item.catalogCode ?? item.intakeCode ?? item.id;
		const list = byCode.get(code) ?? [];
		list.push(item);
		byCode.set(code, list);
	}
	return [...byCode.entries()].map(([code, members]) => {
		const hero = members[0];
		const g = hero.garment;
		return {
			id: hero.groupId ?? hero.id,
			catalog_code: code,
			pretty_name: g?.isGarment ? [
				g.brandVisible || "Unbranded",
				g.styleName || g.kind,
				g.colorway
			].filter(Boolean).join(" ") : hero.highLevel?.title ?? hero.name,
			brand: g?.brandVisible ?? null,
			kind: g?.kind ?? null,
			style_name: g?.styleName ?? null,
			colorway: g?.colorway ?? null,
			condition: g?.condition ?? null,
			lane: hero.lane,
			collection: hero.collectionId,
			status: hero.edit?.status && hero.edit.status !== "none" ? hero.edit.status : hero.collectionId === "inbox" ? "intake" : "ready",
			plate_count: members.length,
			created_at: new Date(hero.createdAt).toISOString(),
			updated_at: new Date(hero.createdAt).toISOString()
		};
	});
}
function localPlateRows(items) {
	return items.map((item) => ({
		id: item.id,
		lot_id: item.groupId ?? item.id,
		intake_code: item.intakeCode ?? item.id,
		role: item.garment?.photoRole ?? null,
		lane: item.lane,
		bytes: item.bytes,
		width: item.width,
		height: item.height,
		edit_status: item.edit?.status ?? "none",
		created_at: new Date(item.createdAt).toISOString(),
		taken_at: item.meta?.takenAt ?? null,
		camera: [item.meta?.make, item.meta?.model].filter(Boolean).join(" ") || null,
		iso: item.meta?.iso ?? null,
		focal_mm: item.meta?.focalMm != null ? Math.round(item.meta.focalMm) : null,
		has_gps: item.meta?.hasGps ?? false,
		hash_sha256: item.meta?.hashSha256 ?? null,
		aperture: item.meta?.aperture ?? null,
		shutter: item.meta?.shutter ?? null,
		content_hash: item.meta?.contentHash ?? null,
		dupe_of: item.dupe?.status === "extra" ? item.dupe.ofId : null,
		dupe_kind: item.dupe?.kind ?? null,
		exif_score: item.dupe?.score ?? null
	}));
}
function CatalogSheet({ onDump }) {
	const items = useStudio((s) => s.items);
	const select = useStudio((s) => s.select);
	const setRailMode = useStudio((s) => s.setRailMode);
	const [lots, setLots] = (0, import_react.useState)([]);
	const [plates, setPlates] = (0, import_react.useState)([]);
	const [tab, setTab] = (0, import_react.useState)("lots");
	const [q, setQ] = (0, import_react.useState)("");
	const [loaded, setLoaded] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let alive = true;
		listCatalog().then((snap) => {
			if (!alive) return;
			setLots(snap.lots);
			setPlates(snap.plates);
			setLoaded(true);
		}).catch(() => {
			if (!alive) return;
			setLoaded(true);
		});
		return () => {
			alive = false;
		};
	}, [items]);
	const lotRows = lots.length ? lots : localLotRows(items);
	const plateRows = plates.length ? plates : localPlateRows(items);
	const filteredLots = (0, import_react.useMemo)(() => {
		const t = q.trim().toLowerCase();
		if (!t) return lotRows;
		return lotRows.filter((r) => [
			r.catalog_code,
			r.pretty_name,
			r.brand,
			r.kind,
			r.style_name,
			r.colorway,
			r.lane,
			r.status
		].filter(Boolean).join(" ").toLowerCase().includes(t));
	}, [lotRows, q]);
	const filteredPlates = (0, import_react.useMemo)(() => {
		const t = q.trim().toLowerCase();
		if (!t) return plateRows;
		return plateRows.filter((r) => [
			r.intake_code,
			r.role,
			r.lane,
			r.edit_status,
			r.id
		].join(" ").toLowerCase().includes(t));
	}, [plateRows, q]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "shrink-0 border-b border-border px-3 py-4 sm:px-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-end justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] tracking-[0.16em] text-subtle uppercase",
							children: "Catalog"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-2xl sm:text-3xl",
							children: "Batch"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 max-w-xl text-sm text-muted",
							children: [
								"Add photos first — no labels. Hash and content scan on drop; the plate with the richest EXIF is keeper. Extras stay filed. SKU: ",
								SKU_TEMPLATE,
								"."
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => setRailMode("grid"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "size-3.5" }), "Photos"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: onDump,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3.5" }), "Add photos"]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-col gap-2 sm:flex-row sm:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex rounded-md bg-surface p-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setTab("lots"),
							className: cn("h-8 rounded-sm px-3 text-xs font-medium", tab === "lots" ? "bg-raised text-fg" : "text-muted"),
							children: ["Lots", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-1.5 font-mono tabular-nums text-subtle",
								children: filteredLots.length
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setTab("plates"),
							className: cn("h-8 rounded-sm px-3 text-xs font-medium", tab === "plates" ? "bg-raised text-fg" : "text-muted"),
							children: ["Plates", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-1.5 font-mono tabular-nums text-subtle",
								children: filteredPlates.length
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Filter SKU, kind, color…",
						className: "h-9 min-w-0 flex-1 rounded-md border border-border bg-surface px-3 text-sm text-fg placeholder:text-subtle"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 font-mono text-[10px] text-subtle",
					children: [
						"Lot ",
						SKU_TEMPLATE,
						" · plate ",
						INTAKE_TEMPLATE,
						loaded ? "" : " · loading"
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-0 flex-1 overflow-auto",
			children: tab === "lots" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[720px] border-separate border-spacing-0 text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "sticky top-0 z-10 bg-bg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "text-[10px] tracking-[0.14em] text-subtle uppercase",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "border-b border-border px-3 py-2 font-medium",
								children: "SKU"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "border-b border-border px-3 py-2 font-medium",
								children: "Name"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "border-b border-border px-3 py-2 font-medium",
								children: "Kind"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "border-b border-border px-3 py-2 font-medium",
								children: "Brand"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "border-b border-border px-3 py-2 font-medium",
								children: "Color"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "border-b border-border px-3 py-2 font-medium",
								children: "Lane"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "border-b border-border px-3 py-2 font-medium",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "border-b border-border px-3 py-2 font-medium text-right",
								children: "Plates"
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [filteredLots.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "cursor-pointer hover:bg-raised/60",
					onClick: () => {
						const hit = items.find((i) => i.catalogCode === row.catalog_code || i.groupId === row.id);
						if (hit) select(hit.id);
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "border-b border-border px-3 py-2 font-mono text-xs whitespace-nowrap",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "inline-flex items-center gap-1.5",
								onClick: (e) => {
									e.stopPropagation();
									copy(row.catalog_code);
								},
								children: [row.catalog_code, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3 text-subtle" })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "border-b border-border px-3 py-2",
							children: row.pretty_name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "border-b border-border px-3 py-2 text-muted",
							children: row.kind ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "border-b border-border px-3 py-2 text-muted",
							children: row.brand ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "border-b border-border px-3 py-2 text-muted",
							children: row.colorway ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "border-b border-border px-3 py-2 text-muted",
							children: row.lane
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "border-b border-border px-3 py-2 text-muted",
							children: row.status
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "border-b border-border px-3 py-2 text-right font-mono tabular-nums",
							children: row.plate_count
						})
					]
				}, row.id)), !filteredLots.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: 8,
					className: "px-3 py-12 text-center text-muted",
					children: "Catalog is empty. Add photos — names are optional and come later."
				}) }) : null] })]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[920px] border-separate border-spacing-0 text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "sticky top-0 z-10 bg-bg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "text-[10px] tracking-[0.14em] text-subtle uppercase",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "border-b border-border px-3 py-2 font-medium",
								children: "Intake"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "border-b border-border px-3 py-2 font-medium",
								children: "SKU"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "border-b border-border px-3 py-2 font-medium",
								children: "Taken"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "border-b border-border px-3 py-2 font-medium",
								children: "Camera"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "border-b border-border px-3 py-2 font-medium",
								children: "Dupe"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "border-b border-border px-3 py-2 font-medium",
								children: "Hash"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "border-b border-border px-3 py-2 font-medium",
								children: "Lane"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "border-b border-border px-3 py-2 font-medium",
								children: "Edit"
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filteredPlates.map((row) => {
					const item = items.find((i) => i.id === row.id);
					const sku = item?.catalogCode ?? lots.find((l) => l.id === row.lot_id)?.catalog_code;
					const taken = row.taken_at ?? item?.meta?.takenAt;
					const camera = row.camera ?? [item?.meta?.make, item?.meta?.model].filter(Boolean).join(" ");
					const hash = row.hash_sha256 ?? item?.meta?.hashSha256;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "cursor-pointer hover:bg-raised/60",
						onClick: () => select(row.id),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "border-b border-border px-3 py-2 font-mono text-xs whitespace-nowrap",
								children: row.intake_code
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "border-b border-border px-3 py-2 font-mono text-xs whitespace-nowrap",
								children: sku ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "border-b border-border px-3 py-2 font-mono text-xs whitespace-nowrap text-muted",
								children: taken ? taken.replace("T", " ").slice(0, 16) : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "border-b border-border px-3 py-2 text-muted",
								children: camera || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "border-b border-border px-3 py-2 text-muted",
								children: item?.dupe ? item.dupe.status === "keeper" ? `Keeper · ${item.dupe.score}` : `Extra · ${item.dupe.kind}` : row.dupe_of ? "Extra" : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "border-b border-border px-3 py-2 font-mono text-xs text-muted",
								children: hash ? hash.slice(0, 12) : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "border-b border-border px-3 py-2 text-muted",
								children: row.lane
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "border-b border-border px-3 py-2 text-muted",
								children: row.edit_status
							})
						]
					}, row.id);
				}) })]
			})
		})]
	});
}
function plateTitle$1(item) {
	if (item.garment?.isGarment) return prettyItemName(item.garment);
	return item.highLevel?.title ?? item.name;
}
function bgLabel(item) {
	switch (item.edit?.bgRemoval ?? editPlanFor(item).bgRemoval) {
		case "skipped-on-body": return "No cutout — on-body";
		case "pending-tbd": return "Bg-remove · TBD";
		case "preview-only": return "Preview only";
		default: return "No bg-remove";
	}
}
function byStatus(items, statuses) {
	return uniqueById(items.filter((i) => {
		const st = i.edit?.status ?? "none";
		return statuses.includes(st);
	}));
}
function EditDesk() {
	const items = useStudio((s) => s.items);
	const queueForEdit = useStudio((s) => s.queueForEdit);
	const dequeueEdit = useStudio((s) => s.dequeueEdit);
	const runQueuedEdits = useStudio((s) => s.runQueuedEdits);
	const recatalogEdited = useStudio((s) => s.recatalogEdited);
	const rejectEdited = useStudio((s) => s.rejectEdited);
	const select = useStudio((s) => s.select);
	const [tab, setTab] = (0, import_react.useState)("resell");
	const resell = uniqueById(items.filter((i) => i.lane === "resell"));
	const social = uniqueById(items.filter((i) => i.lane === "social"));
	const resellBacklog = byStatus(resell, ["none"]);
	const resellQueued = byStatus(resell, ["queued", "processing"]);
	const resellReady = byStatus(resell, ["ready-to-post"]);
	const socialBacklog = byStatus(social, ["none"]);
	const socialQueued = byStatus(social, ["queued", "processing"]);
	const socialReady = byStatus(social, ["ready-to-post"]);
	const [picked, setPicked] = (0, import_react.useState)([]);
	const board = tab === "resell" ? resellBacklog : socialBacklog;
	const queued = tab === "resell" ? resellQueued : socialQueued;
	const ready = tab === "resell" ? resellReady : socialReady;
	const recipe = tab === "resell" ? "resell-batch" : "social-minimal";
	const allowed = (0, import_react.useMemo)(() => new Set(board.map((i) => i.id)), [board]);
	const chosen = picked.filter((id) => allowed.has(id));
	function toggle(id) {
		setPicked((ids) => ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-0 flex-1 overflow-y-auto p-3 sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl sm:text-3xl",
				children: "Edit"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-xl text-sm text-muted",
				children: "Sell backlog and social content stay apart. A plate lives in one place: pick list, in the batch, or ready to post."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex rounded-lg bg-surface p-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						setTab("resell");
						setPicked([]);
					},
					className: cn("h-9 flex-1 rounded-md text-xs font-medium whitespace-nowrap", tab === "resell" ? "bg-raised text-fg" : "text-muted"),
					children: ["Resell batch", resellBacklog.length + resellQueued.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-1.5 font-mono tabular-nums text-warn",
						children: resellBacklog.length + resellQueued.length
					}) : null]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						setTab("social");
						setPicked([]);
					},
					className: cn("h-9 flex-1 rounded-md text-xs font-medium whitespace-nowrap", tab === "social" ? "bg-raised text-fg" : "text-muted"),
					children: ["Social task", socialBacklog.length + socialQueued.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-1.5 font-mono tabular-nums text-ok",
						children: socialBacklog.length + socialQueued.length
					}) : null]
				})]
			}),
			tab === "resell" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 rounded-lg border border-border bg-surface px-3 py-3 text-xs leading-relaxed text-muted",
				children: "Background removal and auto-enhance run through a program we have not locked. This batch queues plates, applies a local preview grade, and stamps ready-to-post. On-body shots are never cut out. Swap the real program in later — the catalog does not care which tool."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 rounded-lg border border-border bg-surface px-3 py-3 text-xs leading-relaxed text-muted",
				children: "Throw social plates in here. Light exposure only, crop notes for 4:5 · 1:1 · 9:16. No background removal, no beauty filter, not inventory."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] tracking-[0.16em] text-subtle uppercase",
					children: tab === "resell" ? "Sell backlog" : "Social pile"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: tab === "resell" ? "Ready-to-post batch" : "Minimal edit task"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						disabled: !chosen.length,
						onClick: () => {
							queueForEdit(chosen, recipe);
							setPicked([]);
						},
						children: [tab === "resell" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageOff, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scissors, { className: "size-3.5" }), tab === "resell" ? `Queue${chosen.length ? ` ${chosen.length}` : ""}` : "Throw in task"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						disabled: !queued.length,
						onClick: () => void runQueuedEdits(recipe),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aperture, { className: "size-3.5" }), "Run preview grade"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				"data-board": `${tab}-backlog`,
				className: "mt-4 flex flex-col gap-2",
				children: [board.map((item) => {
					const on = chosen.includes(item.id);
					const plan = editPlanFor(item);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						"data-item-id": item.id,
						"data-edit-stage": "backlog",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: cn("flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2", on ? "border-border-strong bg-raised" : "border-border bg-surface"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: on,
									onChange: () => toggle(item.id),
									className: "size-4 shrink-0 accent-accent"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: (e) => {
										e.preventDefault();
										select(item.id);
									},
									className: "size-12 shrink-0 overflow-hidden rounded-md bg-raised",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: item.thumbDataUrl,
										alt: "",
										className: "size-full object-cover"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate text-sm",
										children: plateTitle$1(item)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "truncate text-[11px] text-muted",
										children: [bgLabel(item), plan.crops.length ? ` · crops ${plan.crops.join(" ")}` : ""]
									})]
								})
							]
						})
					}, item.id);
				}), !board.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "rounded-lg border border-border bg-surface px-4 py-8 text-center text-sm text-muted",
					children: queued.length ? tab === "resell" ? "Nothing left in the pick list — finish the batch below." : "Pile is empty. Finish the task below." : tab === "resell" ? "No sell plates waiting on the batch." : "Social task is empty."
				}) : null]
			}),
			queued.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				"data-board": `${tab}-queued`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-end justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] tracking-[0.16em] text-subtle uppercase",
						children: "In the batch"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl",
						children: queued.some((i) => i.editing || i.edit?.status === "processing") ? "Grading…" : "Queued — not ready yet"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Program still TBD. Run the preview grade to move them."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 flex gap-3 overflow-x-auto pb-1",
					children: queued.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						"data-item-id": item.id,
						"data-edit-stage": "queued",
						className: "w-40 shrink-0 overflow-hidden rounded-lg border border-border-strong bg-raised",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => select(item.id),
							className: "block w-full text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: item.thumbDataUrl,
								alt: "",
								className: "aspect-square w-full object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-2.5 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-sm",
									children: plateTitle$1(item)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "truncate text-[11px] text-muted",
									children: [item.editing || item.edit?.status === "processing" ? "Grading · " : "Queued · ", bgLabel(item)]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border-t border-border px-2 py-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "ghost",
								className: "h-8 w-full",
								onClick: () => dequeueEdit([item.id]),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "size-3.5" }), "Back to pile"]
							})
						})]
					}, item.id))
				})]
			}) : null,
			ready.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				"data-board": `${tab}-ready`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-end justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] tracking-[0.16em] text-subtle uppercase",
						children: "Ready to post"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl",
						children: "File the ready photos"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => recatalogEdited(ready.map((i) => i.id)),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }),
							"File",
							tab === "resell" ? " · then price" : ""
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3",
					children: ready.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						"data-item-id": item.id,
						"data-edit-stage": "ready",
						className: "overflow-hidden rounded-lg border border-border bg-surface",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => select(item.id),
							className: "block w-full text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: item.thumbDataUrl,
									alt: "",
									className: "aspect-square object-cover"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: item.edit?.previewUrl ?? item.thumbDataUrl,
									alt: "",
									className: "aspect-square object-cover"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-2.5 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-sm",
									children: plateTitle$1(item)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] text-muted",
									children: ["Original · preview · ", bgLabel(item)]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border-t border-border px-2 py-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "ghost",
								className: "h-8 w-full",
								onClick: () => rejectEdited([item.id]),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3.5" }), "Send back"]
							})
						})]
					}, item.id))
				})]
			}) : null
		]
	});
}
function Mark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className,
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "32",
				height: "32",
				rx: "8",
				fill: "currentColor",
				opacity: "0.08"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "6",
				y: "6",
				width: "9",
				height: "9",
				rx: "1.5",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "17",
				y: "6",
				width: "9",
				height: "9",
				rx: "1.5",
				fill: "currentColor",
				opacity: "0.72"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "6",
				y: "17",
				width: "9",
				height: "9",
				rx: "1.5",
				fill: "currentColor",
				opacity: "0.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "17",
				y: "17",
				width: "9",
				height: "9",
				rx: "1.5",
				fill: "currentColor",
				opacity: "0.32"
			})
		]
	});
}
function copyText(label, text) {
	navigator.clipboard.writeText(text).then(() => toast.success(`Copied ${label}`), () => toast.error("Clipboard blocked"));
}
function plateTitle(item) {
	if (item.garment?.isGarment) return prettyItemName(item.garment);
	return item.highLevel?.title ?? item.name;
}
var NAV = [
	{
		id: "rail",
		label: "Batch",
		Icon: LayoutGrid
	},
	{
		id: "inspect",
		label: "Open",
		Icon: Layers
	},
	{
		id: "edit",
		label: "Edit",
		Icon: Aperture
	},
	{
		id: "approve",
		label: "Price",
		Icon: Scale
	},
	{
		id: "clients",
		label: "Send",
		Icon: Handshake
	},
	{
		id: "log",
		label: "Log",
		Icon: BookOpen
	}
];
function handshakeLabel(group) {
	const h = group.handshake;
	if (group.status === "listed") return "Listed";
	if (group.status === "hold") return "Held";
	if (h?.waiting) return `Round ${h.round} · waiting`;
	if (h?.reply?.decision === "approve") return "Client sent back · not ready to list";
	if (h?.reply?.decision === "adjust") return `They asked ${money(h.reply.listPrice ?? h.listAsk)}`;
	if (h?.reply?.decision === "decline") return "They declined";
	if (group.status === "paused" || group.status === "pricing") return group.pricing ? "Pricing" : "Paused";
	if (group.status === "approved") return "Approved";
	if (group.status === "client-back") return "Client sent back · not ready to list";
	if (group.status === "sent") return "Waiting on client";
	return group.status;
}
function Studio() {
	const fileRef = (0, import_react.useRef)(null);
	const labeledRef = (0, import_react.useRef)(false);
	const [dragging, setDragging] = (0, import_react.useState)(false);
	const [intakeOpen, setIntakeOpen] = (0, import_react.useState)(false);
	const [draftFirst, setDraftFirst] = (0, import_react.useState)("");
	const [draftLast, setDraftLast] = (0, import_react.useState)("");
	const [draftLedger, setDraftLedger] = (0, import_react.useState)("business");
	const [draftLane, setDraftLane] = (0, import_react.useState)("resell");
	const items = useStudio((s) => s.items);
	const selectedId = useStudio((s) => s.selectedId);
	const view = useStudio((s) => s.view);
	const collection = useStudio((s) => s.collection);
	const ledgerFilter = useStudio((s) => s.ledgerFilter);
	const query = useStudio((s) => s.query);
	const addFiles = useStudio((s) => s.addFiles);
	const setView = useStudio((s) => s.setView);
	const setQuery = useStudio((s) => s.setQuery);
	const setCollection = useStudio((s) => s.setCollection);
	const setLedgerFilter = useStudio((s) => s.setLedgerFilter);
	const lastClientFirst = useStudio((s) => s.lastClientFirst);
	const lastClientLast = useStudio((s) => s.lastClientLast);
	const lastLedger = useStudio((s) => s.lastLedger);
	const lastLane = useStudio((s) => s.lastLane);
	const laneFilter = useStudio((s) => s.laneFilter);
	const setLaneFilter = useStudio((s) => s.setLaneFilter);
	const railMode = useStudio((s) => s.railMode);
	useStudio((s) => s.setRailMode);
	const groups = useStudio((s) => s.groups);
	const paused = groups.filter((g) => g.status === "paused" || g.status === "pricing").length;
	const waiting = groups.filter((g) => g.status === "sent" || g.handshake?.waiting).length;
	const editBacklog = items.filter((i) => i.lane === "resell" && needsResellEdit(i) || i.lane === "social" && (!i.edit || i.edit.status === "none" || i.edit.status === "queued")).length;
	(0, import_react.useEffect)(() => {
		let alive = true;
		(async () => {
			await useStudio.persist.rehydrate();
			if (alive) await useStudio.getState().hydrate();
		})();
		return () => {
			alive = false;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		setDraftFirst(lastClientFirst);
		setDraftLast(lastClientLast);
		setDraftLedger(lastLedger);
		setDraftLane(lastLane);
	}, [
		lastClientFirst,
		lastClientLast,
		lastLedger,
		lastLane
	]);
	(0, import_react.useEffect)(() => {
		function onDrag(e) {
			if (![...e.dataTransfer?.types ?? []].includes("Files")) return;
			e.preventDefault();
			setDragging(true);
		}
		function onLeave(e) {
			e.preventDefault();
			if (e.relatedTarget === null) setDragging(false);
		}
		function onDrop(e) {
			e.preventDefault();
			setDragging(false);
			const files = [...e.dataTransfer?.files ?? []];
			if (files.length) {
				addFiles(files, {
					ledger: lastLane === "resell" ? "business" : "personal",
					lane: lastLane,
					labeled: false
				});
				toast.message(`Added · ${lastLane} · no labels`);
			}
		}
		window.addEventListener("dragenter", onDrag);
		window.addEventListener("dragover", onDrag);
		window.addEventListener("dragleave", onLeave);
		window.addEventListener("drop", onDrop);
		return () => {
			window.removeEventListener("dragenter", onDrag);
			window.removeEventListener("dragover", onDrag);
			window.removeEventListener("dragleave", onLeave);
			window.removeEventListener("drop", onDrop);
		};
	}, [addFiles, lastLane]);
	const visible = (0, import_react.useMemo)(() => items.filter((i) => matchesQuery(i, query, collection, ledgerFilter, laneFilter)).sort((a, b) => catalogSortKey(a).localeCompare(catalogSortKey(b))), [
		items,
		query,
		collection,
		ledgerFilter,
		laneFilter
	]);
	const selected = items.find((i) => i.id === selectedId) ?? visible[0] ?? items[0];
	const counts = (0, import_react.useMemo)(() => {
		const map = { all: items.length };
		for (const c of COLLECTIONS) map[c.id] = items.filter((i) => i.collectionId === c.id).length;
		return map;
	}, [items]);
	function pickFiles() {
		labeledRef.current = true;
		useStudio.getState().setLastIntake(draftFirst.trim(), draftLast.trim(), draftLane === "resell" ? "business" : "personal", draftLane);
		fileRef.current?.click();
		setIntakeOpen(false);
	}
	function dumpNow() {
		labeledRef.current = false;
		setIntakeOpen(false);
		fileRef.current?.click();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh flex-col overflow-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: "dark",
				position: "bottom-center",
				toastOptions: { style: {
					background: "#1c1a18",
					border: "1px solid color-mix(in oklab, #f0ece4 12%, transparent)",
					color: "#f0ece4"
				} }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: fileRef,
				type: "file",
				accept: "image/jpeg,image/png,image/webp,image/gif",
				multiple: true,
				className: "hidden",
				onChange: (e) => {
					const files = [...e.target.files ?? []];
					e.target.value = "";
					if (files.length) addFiles(files, {
						clientFirst: labeledRef.current && draftLane === "resell" ? draftFirst.trim() || null : null,
						clientLast: labeledRef.current && draftLane === "resell" ? draftLast.trim() || null : null,
						ledger: draftLane === "resell" ? "business" : "personal",
						lane: draftLane,
						labeled: labeledRef.current && draftLane === "resell"
					});
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex h-14 shrink-0 items-center gap-3 border-b border-border px-3 sm:px-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: "size-7 text-fg" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "leading-tight",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-[1.15rem] tracking-tight",
								children: "Lotbook"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "hidden text-[10px] uppercase tracking-[0.18em] text-subtle sm:block",
								children: "Sort · catalog · send"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "ml-2 hidden items-center rounded-lg bg-surface p-1 md:flex",
						children: NAV.map(({ id, label, Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setView(id),
							className: cn("relative flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium whitespace-nowrap", view === id ? "bg-raised text-fg" : "text-muted hover:text-fg"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5" }),
								label,
								id === "approve" && paused > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-0.5 min-w-4 rounded-full bg-warn/20 px-1 text-[10px] text-warn tabular-nums",
									children: paused
								}) : null,
								id === "clients" && waiting > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-0.5 min-w-4 rounded-full bg-ok/20 px-1 text-[10px] text-ok tabular-nums",
									children: waiting
								}) : null,
								id === "edit" && editBacklog > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-0.5 min-w-4 rounded-full bg-warn/20 px-1 text-[10px] text-warn tabular-nums",
									children: editBacklog
								}) : null
							]
						}, id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative hidden sm:block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: query,
									onChange: (e) => setQuery(e.target.value),
									placeholder: "Search lots, names, tags",
									className: "h-9 w-48 rounded-md border border-border bg-surface pr-3 pl-8 text-sm text-fg placeholder:text-subtle focus:ring-2 focus:ring-ring/50 focus:outline-none lg:w-64"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "hidden rounded-md bg-surface p-1 sm:flex",
								children: LANES.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										setDraftLane(l.id);
										setDraftLedger(l.id === "resell" ? "business" : "personal");
										useStudio.getState().setLastIntake(draftFirst, draftLast, l.id === "resell" ? "business" : "personal", l.id);
									},
									className: cn("h-8 rounded-sm px-2.5 text-xs font-medium", draftLane === l.id ? "bg-raised text-fg" : "text-muted"),
									children: l.label
								}, l.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										onClick: dumpNow,
										className: "rounded-r-none",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3.5" }), "Add photos"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										className: "rounded-l-none border-l-0 px-2",
										"aria-label": "Optional lot ticket",
										onClick: () => setIntakeOpen((o) => !o),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3.5" })
									}),
									intakeOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute top-11 right-0 z-30 w-[min(20rem,calc(100vw-2rem))] rounded-lg border border-border bg-surface p-3 shadow-[var(--shadow-panel)]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] tracking-[0.16em] text-subtle uppercase",
												children: "Optional ticket"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-[11px] leading-snug text-muted",
												children: "Drop needs no names. Fill this only when you already know the client."
											}),
											draftLane === "resell" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-2 grid grid-cols-2 gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "block text-xs text-muted",
													children: ["First name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														value: draftFirst,
														onChange: (e) => setDraftFirst(e.target.value),
														placeholder: "Maya",
														className: "mt-1 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "block text-xs text-muted",
													children: ["Last name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														value: draftLast,
														onChange: (e) => setDraftLast(e.target.value),
														placeholder: "Chen",
														className: "mt-1 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg"
													})]
												})]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-2 text-[11px] leading-snug text-muted",
												children: draftLane === "social" ? "Social pile — not inventory." : "Personal log — rooms, notes, field shots."
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												className: "mt-3 w-full",
												size: "sm",
												onClick: pickFiles,
												children: "Add with this name"
											})
										]
									}) : null
								]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "hidden w-[220px] shrink-0 flex-col border-r border-border bg-surface/60 lg:flex",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-4 pt-5 pb-2 text-[10px] font-medium tracking-[0.16em] text-subtle uppercase",
							children: "Ledger"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "flex flex-col gap-0.5 px-2",
							children: [{
								id: "all",
								label: "Both ledgers"
							}, ...LEDGERS].map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setLedgerFilter(l.id),
								className: cn("flex items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm", ledgerFilter === l.id ? "bg-raised text-fg" : "text-muted hover:bg-fg/5 hover:text-fg"),
								children: [l.id === "personal" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-3.5" }) : l.id === "business" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shirt, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-1 truncate",
									children: l.label
								})]
							}, l.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-4 pt-5 pb-2 text-[10px] font-medium tracking-[0.16em] text-subtle uppercase",
							children: "Lane"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "flex flex-col gap-0.5 px-2",
							children: [{
								id: "all",
								label: "All lanes"
							}, ...LANES].map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setLaneFilter(l.id),
								className: cn("flex items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm", laneFilter === l.id ? "bg-raised text-fg" : "text-muted hover:bg-fg/5 hover:text-fg"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-1 truncate",
									children: l.label
								})
							}, l.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-4 pt-5 pb-2 text-[10px] font-medium tracking-[0.16em] text-subtle uppercase",
							children: "Collections"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "flex flex-col gap-0.5 px-2",
							children: [{
								id: "all",
								label: "All plates"
							}, ...COLLECTIONS].map((c) => {
								const active = collection === c.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										setCollection(c.id);
										setView("rail");
									},
									className: cn("flex items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm", active ? "bg-raised text-fg" : "text-muted hover:bg-fg/5 hover:text-fg"),
									children: [
										c.id === "inbox" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "size-3.5 shrink-0" }) : c.id === "accessories" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Watch, { className: "size-3.5 shrink-0" }) : c.id === "social" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aperture, { className: "size-3.5 shrink-0" }) : c.id === "personal" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-3.5 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shirt, { className: "size-3.5 shrink-0" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex-1 truncate",
											children: c.label
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[10px] text-subtle tabular-nums",
											children: c.id === "all" ? items.length : counts[c.id] ?? 0
										})
									]
								}, c.id);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-auto border-t border-border p-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-sm leading-snug text-muted",
								children: "Sell one way. Social another. You pick what goes next."
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex min-w-0 flex-1 flex-col",
					children: view === "rail" ? railMode === "sheet" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatalogSheet, { onDump: dumpNow }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RailGrid, {
						items: visible,
						selectedId: selected?.id,
						empty: items.length === 0,
						onAdd: dumpNow
					}) : view === "edit" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditDesk, {}) : view === "approve" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApproveQueue, {}) : view === "clients" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientsBoard, {}) : view === "log" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogView, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InspectLayout, { item: selected })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex shrink-0 border-t border-border bg-surface md:hidden",
				children: NAV.map(({ id, label, Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setView(id),
					className: cn("relative flex h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[10px]", view === id ? "text-fg" : "text-muted"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }),
						label,
						id === "approve" && paused > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-1.5 right-[18%] size-1.5 rounded-full bg-warn" }) : null,
						id === "clients" && waiting > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-1.5 right-[12%] size-1.5 rounded-full bg-ok" }) : null,
						id === "edit" && editBacklog > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-1.5 right-[12%] size-1.5 rounded-full bg-warn" }) : null
					]
				}, id))
			}),
			dragging ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none fixed inset-0 z-40 flex items-center justify-center bg-bg/80",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border-strong bg-surface px-10 py-8 text-center shadow-[var(--shadow-panel)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mx-auto mb-3 size-6 text-accent" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-2xl",
							children: "Add photos"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "No labels needed. Drop them in — they size, code, and file."
						})
					]
				})
			}) : null
		]
	});
}
function RailGrid({ items, selectedId, empty, onAdd }) {
	const select = useStudio((s) => s.select);
	const collection = useStudio((s) => s.collection);
	const setCollection = useStudio((s) => s.setCollection);
	const query = useStudio((s) => s.query);
	const setQuery = useStudio((s) => s.setQuery);
	const itemsAll = useStudio((s) => s.items);
	const batches = useStudio((s) => s.batches);
	const groups = useStudio((s) => s.groups);
	const setView = useStudio((s) => s.setView);
	const passToValuation = useStudio((s) => s.passToValuation);
	const setRailMode = useStudio((s) => s.setRailMode);
	const weekCount = useStudio((s) => s.items.filter((i) => Date.now() - i.createdAt < 6048e5).length);
	const [picked, setPicked] = (0, import_react.useState)([]);
	const readyLots = groups.filter((g) => {
		if (g.ledger !== "business" || g.status !== "ready" || g.price) return false;
		const members = itemsAll.filter((i) => g.itemIds.includes(i.id));
		return members.length > 0 && members.every((m) => isListingPlate(m));
	});
	const editLots = itemsAll.filter((i) => needsResellEdit(i) || i.lane === "social" && (!i.edit || i.edit.status === "none" || i.edit.status === "queued"));
	const valuingLots = groups.filter((g) => g.ledger === "business" && (g.status === "paused" || g.status === "pricing"));
	const handshakeLots = groups.filter((g) => g.ledger === "business" && (g.status === "sent" || g.status === "client-back" || g.handshake?.waiting));
	const readyIds = readyLots.map((g) => g.id).join("|");
	(0, import_react.useEffect)(() => {
		const allowed = new Set(readyIds.split("|").filter(Boolean));
		setPicked((ids) => ids.filter((id) => allowed.has(id)));
	}, [readyIds]);
	if (empty) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: "size-12 text-muted" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "Empty batch"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-sm text-sm text-muted",
				children: "Drop a roll. Photos size and rotate, file by item then client, and wait for you to pick what to price."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: onAdd,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }), "Add photos"]
			})
		]
	});
	function toggle(id) {
		setPicked((ids) => ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 border-b border-border px-3 py-2 lg:hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: query,
				onChange: (e) => setQuery(e.target.value),
				placeholder: "Find",
				className: "h-9 w-24 shrink-0 rounded-md border border-border bg-surface px-3 text-sm"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex min-w-0 flex-1 gap-1 overflow-x-auto",
				children: [{
					id: "all",
					label: "All"
				}, ...COLLECTIONS].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setCollection(c.id),
					className: cn("h-9 shrink-0 rounded-md px-2.5 text-xs whitespace-nowrap", collection === c.id ? "bg-raised text-fg" : "text-muted"),
					children: c.label
				}, c.id))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-0 flex-1 overflow-y-auto p-3 sm:p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-end justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl sm:text-3xl",
						children: collection === "all" ? "This batch" : collectionLabel(collection)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							items.length,
							" plate",
							items.length === 1 ? "" : "s",
							" · catalogued item then client ·",
							" ",
							weekCount,
							" this week of ~100"
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex rounded-md bg-surface p-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setRailMode("grid"),
							className: "flex h-8 items-center gap-1.5 rounded-sm bg-raised px-3 text-xs font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "size-3.5" }), "Grid"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setRailMode("sheet"),
							className: "flex h-8 items-center gap-1.5 rounded-sm px-3 text-xs font-medium text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table2, { className: "size-3.5" }), "Catalog"]
						})]
					})]
				}),
				editLots.length || valuingLots.length || handshakeLots.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 flex gap-2 overflow-x-auto pb-1",
					children: [
						editLots.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setView("edit"),
							className: "min-w-[200px] shrink-0 rounded-lg border border-border bg-surface px-3 py-3 text-left",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 text-[10px] tracking-[0.14em] text-warn uppercase",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aperture, { className: "size-3" }), "Two backlogs"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 truncate font-display text-base",
									children: "Edit desk"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-0.5 text-[11px] text-muted",
									children: [
										editLots.filter((i) => i.lane === "resell").length,
										" to sell ·",
										" ",
										editLots.filter((i) => i.lane === "social").length,
										" social"
									]
								})
							]
						}) : null,
						valuingLots.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setView("approve"),
							className: "min-w-[200px] shrink-0 rounded-lg border border-border bg-surface px-3 py-3 text-left",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 text-[10px] tracking-[0.14em] text-warn uppercase",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePause, { className: "size-3" }), g.status === "pricing" ? "Pricing" : "Send this round"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 truncate font-display text-base",
									children: g.prettyName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-0.5 text-[11px] text-muted",
									children: [
										g.clientId ?? "Unassigned",
										" · ",
										g.itemIds.length,
										" photo",
										g.itemIds.length === 1 ? "" : "s",
										g.price ? ` · ${money(g.price.userList ?? g.price.listSuggested)}` : ""
									]
								})
							]
						}, g.id)),
						handshakeLots.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setView("clients"),
							className: "min-w-[200px] shrink-0 rounded-lg border border-border bg-surface px-3 py-3 text-left",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 text-[10px] tracking-[0.14em] text-ok uppercase",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handshake, { className: "size-3" }), g.handshake?.waiting ? "Waiting on them" : "Send"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 truncate font-display text-base",
									children: g.prettyName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-0.5 text-[11px] text-muted",
									children: [
										g.clientId ?? "Unassigned",
										" · ",
										handshakeLabel(g)
									]
								})
							]
						}, g.id))
					]
				}) : null,
				readyLots.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mb-6 rounded-xl border border-border bg-surface p-3 sm:p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] tracking-[0.16em] text-subtle uppercase",
								children: "Ready to pass"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl",
								children: "You pick what goes next"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-xs text-muted",
								children: "Sized and rotated. Listing plates only — street shots go through the edit batch first."
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							className: "w-full sm:w-auto",
							disabled: !picked.length,
							onClick: () => {
								const ids = [...picked];
								setPicked([]);
								toast.message(`Sent ${ids.length} lot${ids.length === 1 ? "" : "s"} to price`);
								passToValuation(ids);
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-3.5" }),
								"Price",
								picked.length ? ` ${picked.length}` : ""
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 flex flex-col gap-2",
						children: readyLots.map((g) => {
							const on = picked.includes(g.id);
							const member = items.find((i) => g.itemIds.includes(i.id));
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: cn("flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2", on ? "border-border-strong bg-raised" : "border-border bg-bg"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: on,
										onChange: () => toggle(g.id),
										className: "size-4 shrink-0 accent-accent"
									}),
									member ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: member.thumbDataUrl,
										alt: "",
										className: "size-10 shrink-0 rounded-sm object-cover"
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "truncate text-sm",
											children: g.prettyName
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "truncate text-[11px] text-muted",
											children: [
												g.itemIds.length,
												" plate",
												g.itemIds.length === 1 ? "" : "s",
												" · prepped"
											]
										})]
									})
								]
							}) }, g.id);
						})
					})]
				}) : null,
				batches[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-3 text-[11px] text-subtle",
					children: [
						"Latest lot ",
						batches[0].label,
						" · ",
						batches[0].itemIds.length,
						" files · ",
						batches[0].status
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
					children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => select(item.id),
						className: cn("group flex w-full flex-col overflow-hidden rounded-lg border bg-surface text-left", selectedId === item.id ? "border-border-strong" : "border-border"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative aspect-[4/3] overflow-hidden bg-raised",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: item.thumbDataUrl,
									alt: "",
									className: "size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
								}),
								item.analyzing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-0 flex items-center justify-center bg-bg/50 text-[10px] tracking-wider uppercase",
									children: "Scanning"
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute top-1.5 left-1.5 flex gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-bg/70 px-1.5 py-0.5 text-[9px] tracking-wider text-fg uppercase",
										children: item.ledger
									}), item.prepped ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-bg/70 px-1.5 py-0.5 text-[9px] tracking-wider text-fg uppercase",
										children: "Prepped"
									}) : null]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-2.5 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-sm",
								children: plateTitle(item)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-0.5 truncate text-[11px] text-muted",
								children: item.clientId ? item.clientId : item.garment?.isGarment ? `${item.garment.kind} · ${conditionLabel(item.garment.condition)}` : item.category ?? collectionLabel(item.collectionId)
							})]
						})]
					}) }, item.id))
				})
			]
		})]
	});
}
function InspectLayout({ item }) {
	if (!item) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-1 items-center justify-center text-sm text-muted",
		children: "Open a photo from the batch."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col lg:flex-row",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-[40vh] min-h-0 min-w-0 shrink-0 flex-col lg:h-auto lg:flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlateStage, { item }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filmstrip, { currentId: item.id })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
			className: "flex min-h-0 w-full flex-1 flex-col overflow-y-auto border-t border-border bg-surface lg:w-[400px] lg:flex-none lg:border-t-0 lg:border-l",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayersPanel, { item })
		})]
	});
}
function PlateStage({ item }) {
	const src = itemSrc(item);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative flex min-h-0 flex-1 items-center justify-center bg-[radial-gradient(ellipse_at_center,rgba(240,236,228,0.04),transparent_60%)] p-3 sm:p-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
			className: "flex max-h-full max-w-full flex-col items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src,
				alt: item.highLevel?.title ?? item.name,
				className: "max-h-[calc(40vh-3.5rem)] max-w-full rounded-xs object-contain shadow-[var(--shadow-panel)] lg:max-h-[min(58dvh,720px)]"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
				className: "mt-2 flex w-full items-baseline justify-between gap-3 px-1 text-xs text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate font-display text-sm text-fg",
					children: plateTitle(item)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "shrink-0 font-mono tabular-nums",
					children: [
						item.width && item.height ? `${item.width}×${item.height}` : "",
						item.lowLevel ? ` · ${item.lowLevel.aspectLabel}` : "",
						item.prepped ? " · upright" : ""
					]
				})]
			})]
		})
	});
}
function Filmstrip({ currentId }) {
	const items = useStudio((s) => s.items);
	const current = items.find((i) => i.id === currentId);
	const select = useStudio((s) => s.select);
	const peers = current?.groupId ? items.filter((i) => i.groupId === current.groupId) : items.filter((i) => matchesQuery(i, "", "all", current?.ledger ?? "all")).slice(0, 12);
	if (!peers.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "hidden shrink-0 border-t border-border bg-surface/80 md:block",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex gap-2 overflow-x-auto px-4 py-3",
			children: peers.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "shrink-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => select(item.id),
					className: cn("block h-16 w-20 overflow-hidden rounded-sm border", item.id === currentId ? "border-accent" : "border-border opacity-70 hover:opacity-100"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: item.thumbDataUrl,
						alt: "",
						className: "size-full object-cover"
					})
				})
			}, item.id))
		})
	});
}
function LayersPanel({ item }) {
	const [layer, setLayer] = (0, import_react.useState)("garment");
	const analyze = useStudio((s) => s.analyze);
	const recategorize = useStudio((s) => s.recategorize);
	const remove = useStudio((s) => s.remove);
	const setItemLedger = useStudio((s) => s.setItemLedger);
	const setItemLane = useStudio((s) => s.setItemLane);
	const promoteKeeper = useStudio((s) => s.promoteKeeper);
	const setItemClient = useStudio((s) => s.setItemClient);
	const setView = useStudio((s) => s.setView);
	const passToValuation = useStudio((s) => s.passToValuation);
	const groups = useStudio((s) => s.groups);
	const hl = item.highLevel;
	const ll = item.lowLevel;
	const group = groups.find((g) => g.id === item.groupId);
	const [firstDraft, setFirstDraft] = (0, import_react.useState)(item.clientFirst ?? "");
	const [lastDraft, setLastDraft] = (0, import_react.useState)(item.clientLast ?? "");
	(0, import_react.useEffect)(() => {
		setFirstDraft(item.clientFirst ?? "");
		setLastDraft(item.clientLast ?? "");
	}, [
		item.id,
		item.clientFirst,
		item.clientLast
	]);
	function commitClient() {
		setItemClient(item.id, firstDraft.trim() || null, lastDraft.trim() || null);
	}
	const pretty = prettyLotName(item.garment, item.clientId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5 p-4 sm:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[10px] tracking-[0.16em] text-subtle uppercase",
						children: [
							laneLabel(item.lane),
							" · ",
							item.ledger,
							" · ",
							item.clientId ?? "unassigned",
							item.prepped ? " · prepped" : ""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl leading-tight",
						children: item.garment?.isGarment ? pretty : hl?.title ?? item.name
					}),
					item.catalogCode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 font-mono text-[11px] text-muted",
						children: [item.catalogCode, item.intakeCode ? ` · ${item.intakeCode}` : ""]
					}) : null
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "iconSm",
					onClick: () => void remove(item.id),
					"aria-label": "Remove plate",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex rounded-lg bg-raised p-1",
				children: [
					["garment", "Class"],
					["high", "High"],
					["low", "Low"]
				].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setLayer(id),
					className: cn("h-8 flex-1 rounded-md text-xs font-medium whitespace-nowrap", layer === id ? "bg-surface text-fg" : "text-muted"),
					children: label
				}, id))
			}),
			item.analyzing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Scanning the high layer…"
			}) : null,
			item.analysisError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-danger",
				children: item.analysisError
			}) : null,
			layer === "garment" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GarmentCard, {
				item,
				group
			}) : layer === "high" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HighLayer, { item }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LowLayer, {
				low: ll,
				item
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: item.tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full border border-border px-2.5 py-1 text-[11px] text-muted",
					children: tag
				}, tag))
			}),
			item.dupe ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-surface p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] tracking-[0.16em] text-subtle uppercase",
						children: item.dupe.status === "keeper" ? "Canonical plate" : "Duplicate extra"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: item.dupe.reason
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 font-mono text-[11px] text-subtle",
						children: [
							"EXIF score ",
							item.dupe.score,
							item.dupe.status === "extra" ? ` · keeper ${item.dupe.keeperScore}` : "",
							item.dupe.distance != null ? ` · content Δ ${item.dupe.distance}` : ""
						]
					}),
					item.dupe.status === "extra" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-3",
						size: "sm",
						variant: "outline",
						onClick: () => promoteKeeper(item.id),
						children: "Use this EXIF as keeper"
					}) : null
				]
			}) : null,
			item.meta ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "grid grid-cols-2 gap-3 rounded-lg border border-border bg-surface p-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Taken",
						value: item.meta.takenAt ? item.meta.takenAt.replace("T", " ").slice(0, 19) : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Camera",
						value: [item.meta.make, item.meta.model].filter(Boolean).join(" ") || "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "ISO",
						value: item.meta.iso != null ? String(item.meta.iso) : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Lens",
						value: [
							item.meta.focalMm ? `${item.meta.focalMm}mm` : null,
							item.meta.aperture,
							item.meta.shutter
						].filter(Boolean).join(" ") || "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Hash",
						value: item.meta.hashSha256.slice(0, 16)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Content",
						value: item.meta.contentHash ? item.meta.contentHash.slice(0, 16) : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Taken source",
						value: item.meta.takenSource === "original" ? "DateTimeOriginal" : item.meta.takenSource === "modify" ? "DateTime" : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "GPS in file",
						value: item.meta.hasGps ? "Present · coords not stored" : "None"
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-xs text-muted",
					children: ["Lane", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: item.lane,
						onChange: (e) => setItemLane(item.id, e.target.value),
						className: "mt-1 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg",
						children: LANES.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: l.id,
							children: l.label
						}, l.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-xs text-muted",
					children: ["Ledger", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: item.ledger,
						onChange: (e) => setItemLedger(item.id, e.target.value),
						className: "mt-1 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg",
						children: LEDGERS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: l.id,
							children: l.label
						}, l.id))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-xs text-muted",
				children: ["Collection", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					value: item.collectionId,
					onChange: (e) => recategorize(item.id, e.target.value),
					className: "mt-1 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg",
					children: COLLECTIONS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: c.id,
						children: c.label
					}, c.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-xs text-muted",
					children: ["First name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: firstDraft,
						onChange: (e) => setFirstDraft(e.target.value),
						onBlur: commitClient,
						placeholder: "Maya",
						className: "mt-1 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-xs text-muted",
					children: ["Last name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: lastDraft,
						onChange: (e) => setLastDraft(e.target.value),
						onBlur: commitClient,
						placeholder: "Chen",
						className: "mt-1 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => void analyze(item.id),
					disabled: item.analyzing,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4" }), hl ? "Re-scan with Grok" : "Scan high layer"]
				}), item.garment?.isGarment && item.ledger === "business" && group ? needsResellEdit(item) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setView("edit"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aperture, { className: "size-4" }), "Send to ready-to-post batch"]
				}) : group.status === "sent" || group.status === "client-back" || group.handshake ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setView("clients"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handshake, { className: "size-4" }), "Open send"]
				}) : group.price || group.status === "paused" || group.status === "pricing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setView("approve"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-4" }), group.pricing ? "Pricing…" : "Open prices"]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => {
						toast.message(`Sent ${group.prettyName} to price`);
						passToValuation([group.id]);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-4" }), "Price this lot"]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "subtle",
					onClick: () => setView("log"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" }), "View post-log"]
				})]
			})
		]
	});
}
function GarmentCard({ item, group }) {
	const g = item.garment;
	if (!g?.isGarment) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "text-sm text-muted",
		children: [
			"Not classified as clothing. Filed on the ",
			item.ledger,
			" ledger for the photo log. Move it to business if this is inventory."
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "grid grid-cols-2 gap-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Brand",
						value: g.brandVisible ?? "Unbranded"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Style",
						value: g.styleName || g.kind
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Color",
						value: g.colorway || "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Client",
						value: item.clientId ?? "Unassigned"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Condition",
						value: conditionLabel(g.condition)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Size (as read)",
						value: g.sizeVisible ?? "Not visible"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Year made",
						value: g.yearMade ?? "Unknown"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Photo role",
						value: roleLabel(g.photoRole)
					})
				]
			}),
			g.noticeableFeatures.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted",
				children: ["Features: ", g.noticeableFeatures.join(" · ")]
			}) : null,
			g.defects.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-warn",
				children: ["Defects observed: ", g.defects.join(" · ")]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "No defects noted in this plate — observed only."
			}),
			g.measurementsNeeded.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted",
				children: ["Still need: ", g.measurementsNeeded.join(", ")]
			}) : null,
			group ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "rounded-md border border-border bg-bg px-3 py-2 text-xs text-muted",
				children: [
					group.prettyName,
					" is ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-warn",
						children: handshakeLabel(group)
					}),
					group.price ? ` · ${money(group.price.userList ?? group.price.listSuggested)} draft on ${group.price.channel}. Not an appraisal.` : " · waiting on your pass-through."
				]
			}) : null
		]
	});
}
function HighLayer({ item }) {
	const hl = item.highLevel;
	if (!hl) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Low-level measurements are already on the record. Run a high-layer scan to file scene, subjects, and a garment class."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-relaxed text-fg/90",
				children: hl.summary
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "grid grid-cols-2 gap-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Scene",
						value: hl.scene
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Style",
						value: hl.style
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Lighting",
						value: hl.lighting
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Quality",
						value: `${hl.quality.score}/10`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-1 text-[10px] tracking-[0.16em] text-subtle uppercase",
				children: "Subjects"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col gap-1.5",
				children: hl.subjects.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex-1 truncate",
						children: s.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted",
						children: s.location
					})]
				}, s.name))
			})] }),
			hl.quality.issues.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-warn",
				children: ["Issues: ", hl.quality.issues.join(" · ")]
			}) : null
		]
	});
}
function LowLayer({ low, item }) {
	if (!low) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Measurements not yet computed for this plate."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1.5",
				children: low.palette.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-1 flex-col items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-10 w-full rounded-sm border border-border",
						style: { background: s.hex },
						title: s.hex
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[9px] text-subtle",
						children: s.hex
					})]
				}, s.hex))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-12 items-end gap-px rounded-sm bg-raised px-1 py-1",
				children: low.histogram.map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 rounded-xs bg-accent/70",
					style: { height: `${Math.max(6, v * 100 * 4)}%` }
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "grid grid-cols-2 gap-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Orientation",
						value: low.orientation
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Aspect",
						value: low.aspectLabel
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Brightness",
						value: `${Math.round(low.brightness * 100)}%`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Contrast",
						value: `${Math.round(low.contrast * 100)}%`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Sharpness",
						value: `${Math.round(low.sharpness * 100)}%`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "File",
						value: formatBytes(item.bytes)
					})
				]
			})
		]
	});
}
function Fact({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-[10px] tracking-[0.16em] text-subtle uppercase",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "mt-0.5 text-sm leading-snug",
		children: value
	})] });
}
function designerLabel(v) {
	switch (v) {
		case "not-designer": return "Not designer";
		case "label-present": return "Label present — unverified";
		case "needs-second-pass": return "Needs second pass";
		default: return "Unverified";
	}
}
function authLabel(v) {
	switch (v) {
		case "not-required": return "Not required";
		case "queued": return "Queued";
		case "flagged": return "Flagged for review";
		default: return "Unverified";
	}
}
function ApproveQueue() {
	const groups = useStudio((s) => s.groups);
	const items = useStudio((s) => s.items);
	const queue = groups.filter((g) => g.ledger === "business" && (g.status === "pricing" || g.status === "paused" || g.price && !g.handshake?.waiting && g.status !== "sent" && g.status !== "client-back"));
	const paused = queue.filter((g) => g.status === "paused" || g.status === "pricing");
	const parked = queue.filter((g) => g.status === "hold" || g.status === "approved");
	if (!queue.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-8 text-muted" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "Nothing to price"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-sm text-sm text-muted",
				children: "Sorted lots wait in the batch. Pick the ones you want — a full report is written, then you send that round. Listing is not ready yet."
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-0 flex-1 overflow-y-auto p-3 sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl sm:text-3xl",
				children: "Price"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-xl text-sm text-muted",
				children: "Full reports — estimates only, not appraisals. Adjust the ask, then send the round to the client. They send back; we list from the CRM. Listing itself is not ready yet."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-col gap-4",
				children: [
					paused.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceCard, {
						group: g,
						items: items.filter((i) => g.itemIds.includes(i.id))
					}, g.id)),
					parked.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-4 font-display text-xl text-muted",
						children: "Parked"
					}) : null,
					parked.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceCard, {
						group: g,
						items: items.filter((i) => g.itemIds.includes(i.id))
					}, g.id))
				]
			})
		]
	});
}
function PriceCard({ group, items }) {
	const adjustPrice = useStudio((s) => s.adjustPrice);
	const holdGroup = useStudio((s) => s.holdGroup);
	const sendToClient = useStudio((s) => s.sendToClient);
	const select = useStudio((s) => s.select);
	const setView = useStudio((s) => s.setView);
	const price = group.price;
	const [edit, setEdit] = (0, import_react.useState)(String(price?.userList ?? price?.listSuggested ?? ""));
	(0, import_react.useEffect)(() => {
		setEdit(String(price?.userList ?? price?.listSuggested ?? ""));
	}, [
		group.id,
		price?.userList,
		price?.listSuggested
	]);
	const waiting = group.status === "sent" || !!group.handshake?.waiting;
	const back = group.status === "client-back";
	const held = group.status === "hold";
	const report = price?.report;
	const who = group.clientId ?? "the client";
	const nextRound = (group.handshake?.round ?? 0) + 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "overflow-hidden rounded-xl border border-border bg-surface",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-1 overflow-x-auto p-2",
			children: items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => select(it.id),
				className: "h-24 w-20 shrink-0 overflow-hidden rounded-md bg-raised",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: it.thumbDataUrl,
					alt: "",
					className: "size-full object-cover"
				})
			}, it.id))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-3 px-4 pt-2 pb-4 sm:px-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[10px] tracking-[0.16em] text-subtle uppercase",
						children: [
							group.clientId ?? "unassigned",
							" · ",
							price?.channel ?? "channel",
							" · ",
							items.length,
							" ",
							"photo",
							items.length === 1 ? "" : "s"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl",
						children: group.prettyName
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("rounded-full px-2.5 py-1 text-[10px] tracking-wider uppercase", back ? "bg-ok/15 text-ok" : waiting ? "bg-ok/15 text-ok" : held ? "text-muted" : "bg-warn/15 text-warn"),
						children: handshakeLabel(group)
					})]
				}),
				group.pricing && !report ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Writing the price report…"
				}) : null,
				report ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportBlock, { report }) : null,
				price ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-muted",
						children: price.compsNote
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-4 font-mono text-sm tabular-nums",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Low ", money(price.listLow)] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-fg",
								children: ["Suggest ", money(price.listSuggested)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["High ", money(price.listHigh)] })
						]
					}),
					price.flags.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-warn",
						children: price.flags.join(" · ")
					}) : null,
					waiting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								"Round ",
								group.handshake?.round,
								" is with ",
								who,
								". Listing not ready yet."
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => setView("clients"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handshake, { className: "size-3.5" }), "Open send"]
						})]
					}) : back ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-ok",
						children: [
							"They sent back approval at ",
							money(price.userList ?? price.listSuggested),
							". Listing is not ready yet — packet lives in Clients."
						]
					}) : !held ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2 sm:flex-row sm:items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex min-w-0 flex-1 items-center gap-2 text-xs text-muted",
							children: ["List price", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 1,
								value: edit,
								onChange: (e) => setEdit(e.target.value),
								onBlur: () => {
									const n = Number(edit);
									if (Number.isFinite(n) && n > 0) adjustPrice(group.id, n);
								},
								className: "h-10 w-28 rounded-md border border-border bg-bg px-3 font-mono text-sm text-fg"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => holdGroup(group.id),
								disabled: group.pricing || group.templating,
								children: "Hold"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								className: "flex-1 sm:flex-none",
								onClick: () => {
									const n = Number(edit);
									if (Number.isFinite(n) && n > 0) adjustPrice(group.id, n);
									sendToClient(group.id);
									toast.message(`Round ${nextRound} sent to ${who}`);
								},
								disabled: group.pricing || group.templating,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-3.5" }),
									"Send round ",
									nextRound,
									" to ",
									who.split(" ")[0] ?? "client"
								]
							})]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Held — no send, no list."
					})
				] }) : null,
				group.template ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TemplateBlock, { group }) : null
			]
		})]
	});
}
function ClientsBoard() {
	const groups = useStudio((s) => s.groups);
	const items = useStudio((s) => s.items);
	const setView = useStudio((s) => s.setView);
	const clients = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const g of groups) {
			if (g.ledger !== "business") continue;
			const key = g.clientId ?? "unassigned";
			const row = map.get(key) ?? {
				id: key,
				first: g.clientFirst,
				last: g.clientLast,
				lots: []
			};
			row.lots.push(g);
			map.set(key, row);
		}
		return [...map.values()].sort((a, b) => a.id.localeCompare(b.id));
	}, [groups]);
	if (!clients.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handshake, { className: "size-8 text-muted" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "Nothing to send"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-sm text-sm text-muted",
				children: "Add a named lot when you know the client. After you price a round you send it here, they send back, then you list. Listing is not ready yet."
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-0 flex-1 overflow-y-auto p-3 sm:p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl sm:text-3xl",
				children: "Send"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-xl text-sm text-muted",
				children: "Send a round, record their send-back, then list. Marketplace publish is not ready yet — the packet stays here."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				onClick: () => setView("approve"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-3.5" }), "Open prices"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 flex flex-col gap-5",
			children: clients.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-surface p-4 sm:p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-baseline justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] tracking-[0.16em] text-subtle uppercase",
						children: "Client"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: c.id === "unassigned" ? "Unassigned" : c.id
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [
							c.lots.length,
							" lot",
							c.lots.length === 1 ? "" : "s",
							" ·",
							" ",
							c.lots.filter((g) => g.handshake?.waiting).length,
							" waiting"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 flex flex-col gap-3",
					children: c.lots.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HandshakeRow, {
						group: g,
						items: items.filter((i) => g.itemIds.includes(i.id))
					}, g.id))
				})]
			}, c.id))
		})]
	});
}
function HandshakeRow({ group, items }) {
	const sendToClient = useStudio((s) => s.sendToClient);
	const recordClientBack = useStudio((s) => s.recordClientBack);
	const setView = useStudio((s) => s.setView);
	const select = useStudio((s) => s.select);
	const hero = items[0];
	const h = group.handshake;
	const waiting = !!h?.waiting || group.status === "sent";
	const approved = h?.reply?.decision === "approve" || group.status === "client-back";
	const [note, setNote] = (0, import_react.useState)("");
	const [adjust, setAdjust] = (0, import_react.useState)(String(h?.listAsk ?? group.price?.listSuggested ?? ""));
	const [mode, setMode] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setAdjust(String(h?.listAsk ?? group.price?.listSuggested ?? ""));
		setMode(null);
		setNote("");
	}, [
		group.id,
		h?.id,
		h?.listAsk,
		group.price?.listSuggested
	]);
	async function commit(decision) {
		const n = Number(adjust);
		await recordClientBack(group.id, decision, {
			listPrice: Number.isFinite(n) ? n : void 0,
			note
		});
		setMode(null);
		toast.message(decision === "approve" ? "They sent back approval — listing not ready yet" : decision === "adjust" ? "They sent back a different ask" : "They declined — lot held");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "rounded-lg border border-border bg-bg p-3 sm:p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-3",
			children: [hero ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => select(hero.id),
				className: "size-14 shrink-0 overflow-hidden rounded-md bg-raised",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: hero.thumbDataUrl,
					alt: "",
					className: "size-full object-cover"
				})
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-w-0 flex-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-sm",
							children: group.prettyName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-0.5 text-[11px] text-muted",
							children: handshakeLabel(group)
						})]
					}), group.price ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-sm tabular-nums",
						children: money(group.price.userList ?? group.price.listSuggested)
					}) : null]
				})
			})]
		}), !group.price ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-xs text-muted",
			children: "Still in the batch — price it first."
		}) : waiting && h ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex flex-col gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "max-h-40 overflow-y-auto rounded-md border border-border bg-surface px-3 py-2 font-sans text-[12px] leading-relaxed whitespace-pre-wrap text-muted",
					children: h.packet
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => copyText("round packet", h.packet),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), "Copy packet"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] text-subtle",
					children: "Record their send-back. Listing is not ready yet."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						"approve",
						"adjust",
						"decline"
					].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: mode === d ? "default" : "outline",
						onClick: () => setMode(d),
						children: d === "approve" ? "They approved" : d === "adjust" ? "They adjusted" : "They declined"
					}, d))
				}),
				mode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2 rounded-md border border-border bg-surface p-3",
					children: [
						mode === "adjust" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-xs text-muted",
							children: ["Their ask", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 1,
								value: adjust,
								onChange: (e) => setAdjust(e.target.value),
								className: "h-10 w-28 rounded-md border border-border bg-bg px-3 font-mono text-sm text-fg"
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-xs text-muted",
							children: ["Note", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: note,
								onChange: (e) => setNote(e.target.value),
								placeholder: "Optional — as they said it",
								className: "mt-1 h-10 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => void commit(mode),
							disabled: group.templating,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }), "File send-back"]
						})
					]
				}) : null
			]
		}) : approved ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex flex-col gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-ok",
					children: [
						"Handshake closed at ",
						money(group.price.userList ?? group.price.listSuggested),
						". Copy lives in the CRM."
					]
				}),
				group.templating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Drafting listing copy after their send-back…"
				}) : group.template ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TemplateBlock, { group }) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					disabled: true,
					className: "w-full sm:w-auto",
					children: "List — not ready yet"
				})
			]
		}) : group.status === "paused" || group.status === "hold" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 flex flex-wrap gap-2",
			children: group.status === "paused" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				onClick: () => {
					sendToClient(group.id);
					toast.message(`Round sent to ${group.clientId ?? "client"}`);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-3.5" }),
					"Send round ",
					(h?.round ?? 0) + 1
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				size: "sm",
				onClick: () => setView("approve"),
				children: "Review prices"
			})
		}) : null]
	});
}
function ReportBlock({ report }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4 rounded-lg border border-border bg-bg p-3 sm:p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] tracking-[0.16em] text-subtle uppercase",
				children: "Lot report"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-2 grid grid-cols-2 gap-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Brand",
						value: report.brand ?? "None visible"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Size",
						value: report.size ?? "Not visible"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Year made",
						value: report.yearMade ? `${report.yearMade} (${report.yearBasis === "label" ? "from label" : report.yearBasis === "era-guess" ? "era guess" : "unknown"})` : "Unknown"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Condition",
						value: conditionLabel(report.condition)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Vintage 30+",
						value: report.vintage30 ? report.vintageNote ?? "Yes — 30+ years" : "No"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Designer",
						value: designerLabel(report.designerVerifiable)
					})
				]
			})] }),
			report.noticeableFeatures.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted",
				children: ["Noticeable features: ", report.noticeableFeatures.join(" · ")]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] tracking-[0.16em] text-subtle uppercase",
					children: "Market estimates"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[11px] text-muted",
					children: "Typical sold bands, not an appraisal and not a promise."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-2 grid grid-cols-2 gap-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
							label: "Sold high quality",
							value: moneyOrDash(report.market.soldHigh)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
							label: "Sold low quality",
							value: moneyOrDash(report.market.soldLow)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
							label: "Time to sell",
							value: report.market.daysToSell != null ? `${report.market.daysToSell} days` : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
							label: "Top of market",
							value: moneyOrDash(report.market.topOfMarket)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
							label: "Faster sell",
							value: moneyOrDash(report.market.fasterSell)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
							label: "Marketplaces",
							value: report.market.channels.length ? report.market.channels.join(", ") : "—"
						})
					]
				}),
				report.market.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs leading-relaxed text-muted",
					children: report.market.notes
				}) : null
			] }),
			report.authenticity.status !== "not-required" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-md border border-border px-3 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-1.5 text-[10px] font-medium tracking-wide text-warn uppercase",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "mt-0.5 size-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "leading-snug",
							children: ["High-end second pass · ", authLabel(report.authenticity.status)]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 text-xs leading-relaxed text-muted",
						children: report.authenticity.note || "Cannot verify a designer house from these plates. Not a certificate, not a fake verdict."
					}),
					report.authenticity.tells.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-[11px] text-muted",
						children: ["Tells: ", report.authenticity.tells.join(" · ")]
					}) : null
				]
			}) : null,
			report.deeper.ran ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-md border border-border px-3 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] tracking-[0.14em] text-subtle uppercase",
					children: "Deeper unique / vintage pass"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 text-xs leading-relaxed text-muted",
					children: report.deeper.findings
				})]
			}) : report.uniqueOrRare || report.vintage30 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-muted",
				children: "Unique or vintage 30+ — a deeper pass is queued with this report."
			}) : null
		]
	});
}
function TemplateBlock({ group }) {
	const t = group.template;
	if (!t) return null;
	const dump = [
		t.title,
		"",
		...t.bullets.map((b) => `• ${b}`),
		"",
		t.description,
		t.hashtags.length ? t.hashtags.map((h) => `#${h}`).join(" ") : "",
		t.channelNotes
	].filter(Boolean).join("\n");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-bg p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-lg",
					children: t.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "iconSm",
					onClick: () => copyText("listing", dump),
					"aria-label": "Copy listing",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 flex flex-col gap-1 text-sm",
				children: t.bullets.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-2 text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1.5 size-1 shrink-0 rounded-full bg-accent" }), b]
				}, b))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed",
				children: t.description
			}),
			t.measurementsNeeded.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs text-warn",
				children: ["Measure: ", t.measurementsNeeded.join(", ")]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-[11px] text-subtle",
				children: t.channelNotes
			})
		]
	});
}
function LogView() {
	const log = useStudio((s) => s.log);
	const items = useStudio((s) => s.items);
	const [lane, setLane] = (0, import_react.useState)("all");
	const week = items.filter((i) => Date.now() - i.createdAt < 6048e5);
	const biz = week.filter((i) => i.ledger === "business").length;
	const per = week.filter((i) => i.ledger === "personal").length;
	const visible = log.filter((e) => lane === "all" || e.ledger === lane);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-0 flex-1 overflow-y-auto p-3 sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl sm:text-3xl",
				children: "Log"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Personal and business images in one stack. A round does not list until the client sends back — and listing itself is not ready yet."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Week",
						value: `${week.length}/100`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Business",
						value: String(biz)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Personal",
						value: String(per)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 flex rounded-lg bg-surface p-1",
				children: [
					["all", "Both"],
					["business", "Business"],
					["personal", "Personal"]
				].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setLane(id),
					className: cn("h-8 flex-1 rounded-md text-xs font-medium", lane === id ? "bg-raised text-fg" : "text-muted"),
					children: label
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-5 flex flex-col",
				children: visible.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogRow, { event: e }, e.id))
			})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-surface px-3 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] tracking-[0.16em] text-subtle uppercase whitespace-nowrap",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 font-mono text-lg tabular-nums",
			children: value
		})]
	});
}
function LogRow({ event }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex gap-3 border-b border-border py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-16 shrink-0 font-mono text-[10px] text-subtle tabular-nums",
			children: [new Date(event.at).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-0.5",
				children: new Date(event.at).toLocaleDateString([], {
					month: "short",
					day: "numeric"
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2 text-[10px] tracking-wider text-subtle uppercase",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: event.type }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: event.ledger }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: event.actor }),
					event.clientId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: event.clientId }) : null
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 text-sm leading-snug",
				children: event.message
			})]
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Studio, {});
}
//#endregion
export { Home as component };
