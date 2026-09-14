import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-CUGRCdmg.js
var MODEL = process.env.LLM_MODEL?.trim() || "gemini-3.6-flash";
var LLM_BASE = (process.env.LLM_BASE_URL?.trim() || "https://generativelanguage.googleapis.com/v1beta/openai").replace(/\/+$/, "");
function getApiKey() {
	return (process.env.LLM_API_KEY || process.env.GEMINI_API_KEY)?.trim() || null;
}
async function chatVision(apiKey, imageDataUrl, system, userText, maxTokens) {
	const userContent = [];
	if (imageDataUrl) userContent.push({
		type: "image_url",
		image_url: {
			url: imageDataUrl,
			detail: "high"
		}
	});
	userContent.push({
		type: "text",
		text: userText
	});
	const payload = {
		model: MODEL,
		temperature: .2,
		max_tokens: maxTokens,
		response_format: { type: "json_object" },
		messages: [{
			role: "system",
			content: system
		}, {
			role: "user",
			content: userContent
		}]
	};
	const send = async (body) => fetch(`${LLM_BASE}/chat/completions`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify(body)
	});
	let res = await send(payload);
	if (res.status === 400) {
		const { response_format: _, ...rest } = payload;
		res = await send(rest);
	}
	if (!res.ok) {
		const errText = await res.text().catch(() => "");
		return {
			ok: false,
			error: `Vision request failed (${res.status})${errText ? `: ${errText.slice(0, 180)}` : ""}`
		};
	}
	const text = (await res.json()).choices?.[0]?.message?.content ?? "";
	if (!text) return {
		ok: false,
		error: "Empty model response"
	};
	return {
		ok: true,
		text
	};
}
function parseJson(text) {
	const trimmed = text.trim();
	const raw = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)?.[1]?.trim() ?? trimmed;
	try {
		return JSON.parse(raw);
	} catch {
		const start = raw.indexOf("{");
		const end = raw.lastIndexOf("}");
		if (start >= 0 && end > start) try {
			return JSON.parse(raw.slice(start, end + 1));
		} catch {
			return null;
		}
		return null;
	}
}
function asString(v, fallback = "") {
	return typeof v === "string" ? v : fallback;
}
function asNumber(v, fallback = 0) {
	return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}
function asStringArr(v) {
	if (!Array.isArray(v)) return [];
	return v.filter((x) => typeof x === "string");
}
var WORK_AREAS = [
	"resale",
	"real-estate",
	"product",
	"inspection",
	"editorial",
	"brand",
	"archive"
];
var COLLECTIONS = [
	"inbox",
	"garments",
	"accessories",
	"personal",
	"archive"
];
var CONDITIONS = [
	"nwt",
	"like-new",
	"excellent",
	"good",
	"fair",
	"as-is"
];
var CATEGORIES = [
	"contemporary",
	"designer",
	"vintage",
	"streetwear",
	"workwear",
	"outdoor",
	"formal",
	"kids",
	"accessories",
	"shoes",
	"bags",
	"jewelry",
	"home-textile",
	"other"
];
var ROLES = [
	"hero-front",
	"hero-back",
	"side",
	"detail",
	"label",
	"hangtag",
	"defect",
	"fit-on-body",
	"in-situ",
	"flat-lay",
	"other"
];
function asWorkArea(v) {
	return typeof v === "string" && WORK_AREAS.includes(v) ? v : null;
}
function pick(v, allowed, fallback) {
	return typeof v === "string" && allowed.includes(v) ? v : fallback;
}
function nullishString(v) {
	if (typeof v !== "string") return null;
	const t = v.trim();
	if (!t || t.toLowerCase() === "null" || t.toLowerCase() === "unknown") return null;
	return t;
}
function toGarment(raw) {
	if (!raw) return void 0;
	const isGarment = raw.isGarment === true;
	const base = {
		isGarment,
		kind: asString(raw.kind, "other").toLowerCase(),
		styleName: asString(raw.styleName),
		category: pick(raw.category, CATEGORIES, isGarment ? "contemporary" : "other"),
		colorway: asString(raw.colorway),
		pattern: asString(raw.pattern),
		fiberVisible: nullishString(raw.fiberVisible),
		brandVisible: nullishString(raw.brandVisible),
		sizeVisible: nullishString(raw.sizeVisible),
		yearMade: nullishString(raw.yearMade),
		condition: pick(raw.condition, CONDITIONS, "good"),
		defects: asStringArr(raw.defects),
		noticeableFeatures: asStringArr(raw.noticeableFeatures),
		era: nullishString(raw.era),
		photoRole: pick(raw.photoRole, ROLES, "other"),
		resellChannels: asStringArr(raw.resellChannels).slice(0, 3),
		groupHint: asString(raw.groupHint).toLowerCase().replace(/\s+/g, "-").slice(0, 48),
		measurementsNeeded: asStringArr(raw.measurementsNeeded).slice(0, 8),
		uniqueOrRare: raw.uniqueOrRare === true,
		highEnd: raw.highEnd === true
	};
	if (!isGarment && raw.isGarment === false) return {
		...base,
		isGarment: false
	};
	if (!isGarment) return void 0;
	if (!base.styleName) base.styleName = base.kind;
	return base;
}
function toHighLevel(raw) {
	const qualityRaw = raw.quality ?? {};
	const subjectsRaw = Array.isArray(raw.subjects) ? raw.subjects : [];
	const col = asString(raw.suggestedCollection, "inbox");
	const garment = toGarment(raw.garment ?? null);
	const ledgerRaw = asString(raw.suggestedLedger, "");
	const suggestedLedger = ledgerRaw === "personal" || ledgerRaw === "business" ? ledgerRaw : garment?.isGarment ? "business" : "personal";
	let suggestedCollection = COLLECTIONS.includes(col) ? col : "inbox";
	if (garment?.isGarment && suggestedLedger === "business") suggestedCollection = /^(shoes|boots|sneakers|bag|belt|scarf|hat|jewelry|watch)$/.test(garment.kind) ? "accessories" : "garments";
	else if (suggestedLedger === "personal" && suggestedCollection === "inbox") suggestedCollection = "personal";
	let work = asWorkArea(raw.suggestedWorkArea);
	if (garment?.isGarment && suggestedLedger === "business") work = "resale";
	return {
		title: asString(raw.title, "Untitled plate"),
		summary: asString(raw.summary),
		scene: asString(raw.scene),
		subjects: subjectsRaw.map((s) => {
			const o = s ?? {};
			return {
				name: asString(o.name),
				prominence: asNumber(o.prominence, 0),
				location: asString(o.location)
			};
		}).filter((s) => s.name),
		composition: asString(raw.composition),
		mood: asStringArr(raw.mood).slice(0, 6),
		lighting: asString(raw.lighting),
		style: asString(raw.style),
		quality: {
			score: Math.max(1, Math.min(10, Math.round(asNumber(qualityRaw.score, 6)))),
			issues: asStringArr(qualityRaw.issues),
			strengths: asStringArr(qualityRaw.strengths)
		},
		objects: asStringArr(raw.objects),
		textInImage: asStringArr(raw.textInImage),
		suggestedCategory: asString(raw.suggestedCategory, garment?.kind ?? "unfiled"),
		suggestedTags: asStringArr(raw.suggestedTags).map((t) => t.toLowerCase().replace(/\s+/g, "-")).slice(0, 14),
		suggestedWorkArea: work,
		suggestedCollection,
		suggestedLedger,
		confidence: Math.max(0, Math.min(1, asNumber(raw.confidence, .6)))
	};
}
function toWorkflow(raw, workArea) {
	const sections = Array.isArray(raw.sections) ? raw.sections.map((s) => {
		const o = s ?? {};
		return {
			heading: asString(o.heading),
			body: asString(o.body)
		};
	}).filter((s) => s.heading || s.body) : [];
	const fields = Array.isArray(raw.fields) ? raw.fields.map((s) => {
		const o = s ?? {};
		return {
			label: asString(o.label),
			value: asString(o.value)
		};
	}).filter((s) => s.label || s.value) : [];
	const checklist = Array.isArray(raw.checklist) ? raw.checklist.map((s) => {
		if (typeof s === "string") return { item: s };
		return { item: asString((s ?? {}).item) };
	}).filter((s) => s.item) : [];
	return {
		workArea,
		title: asString(raw.title, "Workflow"),
		ranAt: Date.now(),
		sections,
		fields,
		checklist
	};
}
var aiAvailable_createServerFn_handler = createServerRpc({
	id: "23e188d81ff3d49ae6c2219f8b375d53d04ee666e8f41a11e6b2ab0c8f13f37c",
	name: "aiAvailable",
	filename: "src/lib/ai.ts"
}, (opts) => aiAvailable.__executeServer(opts));
var aiAvailable = createServerFn({ method: "POST" }).handler(aiAvailable_createServerFn_handler, async () => ({ available: Boolean(getApiKey()) }));
var analyzeImage_createServerFn_handler = createServerRpc({
	id: "015a029929a18376662584d0b4354db890240ce6033ee4eb68f8cff456f68ba0",
	name: "analyzeImage",
	filename: "src/lib/ai.ts"
}, (opts) => analyzeImage.__executeServer(opts));
var analyzeImage = createServerFn({ method: "POST" }).validator((input) => input).handler(analyzeImage_createServerFn_handler, async ({ data }) => {
	const apiKey = getApiKey();
	if (!apiKey) return {
		ok: false,
		error: "Vision is unavailable in this environment"
	};
	if (!data.imageDataUrl?.startsWith("data:image/")) return {
		ok: false,
		error: "Expected a compressed image"
	};
	const result = await chatVision(apiKey, data.imageDataUrl, "You are a clothing-intake cataloger and picture editor. Return JSON only. Describe only what is visible. Never invent brands, sizes, fibers, prices, people names, or unseen rooms. Condition is observed, not a warranty. Brand only if a label or unmistakable mark is in frame.", `Analyze this image into JSON with keys:
title, summary, scene, subjects, composition, mood, lighting, style,
quality, objects, textInImage, suggestedCategory, suggestedTags,
suggestedWorkArea, suggestedCollection, suggestedLedger, confidence, garment

subjects: [{ "name", "prominence" (0-1), "location" }]
mood: 2-5 short adjectives
quality: { "score" 1-10, "issues": string[], "strengths": string[] }
textInImage: array of readable strings (empty if none)
suggestedWorkArea: one of resale | real-estate | product | inspection | editorial | brand | archive | null
suggestedCollection: inbox | garments | accessories | personal | archive
suggestedLedger: business | personal  (clothing/resale lots = business; family/rooms/mood = personal)
suggestedTags: 5-12 lowercase hyphenated
confidence: 0-1
summary: 2-4 sentences

garment: {
  "isGarment": boolean,
  "kind": coat|jacket|blazer|suit|dress|skirt|jumpsuit|top|knit|hoodie|pants|jeans|shorts|shoes|boots|sneakers|bag|belt|scarf|hat|jewelry|watch|other,
  "styleName": short style phrase (wool overcoat, trench, moto, etc.),
  "category": contemporary|designer|vintage|streetwear|workwear|outdoor|formal|kids|accessories|shoes|bags|jewelry|home-textile|other,
  "colorway": short phrase,
  "pattern": string or "",
  "fiberVisible": string or null,
  "brandVisible": string or null,
  "sizeVisible": string or null,
  "yearMade": string or null — only from a label or a clearly dated style,
  "condition": nwt|like-new|excellent|good|fair|as-is,
  "defects": string[],
  "noticeableFeatures": 2-6 visible details (hardware, lining, cut, hardware finish),
  "era": string or null,
  "photoRole": hero-front|hero-back|side|detail|label|hangtag|defect|fit-on-body|in-situ|flat-lay|other,
  "resellChannels": 1-2 of poshmark|ebay|depop|grailed|realreal|vestiaire|facebook|local-consign|shop-own,
  "groupHint": short slug for like-item clustering (e.g. charcoal-wool-coat),
  "measurementsNeeded": string[],
  "uniqueOrRare": boolean — unusual cut, couture, one-off, or clearly scarce vintage,
  "highEnd": boolean — designer house, luxury materials, or likely $400+ list
}
If this is not clothing/accessories, set garment.isGarment false and suggestedLedger personal unless it is clearly a business archive/product shot.`, 2e3);
	if (!result.ok) return result;
	const parsed = parseJson(result.text);
	if (!parsed) return {
		ok: false,
		error: "Could not parse analysis"
	};
	return {
		ok: true,
		analysis: toHighLevel(parsed),
		garment: toGarment(parsed.garment ?? null)
	};
});
var runWorkArea_createServerFn_handler = createServerRpc({
	id: "b62114b84c9ba4a152c8bd194d66e1c3234c4b65f8ef1775d0e0083386ba52ed",
	name: "runWorkArea",
	filename: "src/lib/ai.ts"
}, (opts) => runWorkArea.__executeServer(opts));
var runWorkArea = createServerFn({ method: "POST" }).validator((input) => input).handler(runWorkArea_createServerFn_handler, async ({ data }) => {
	const apiKey = getApiKey();
	if (!apiKey) return {
		ok: false,
		error: "Workflows are unavailable in this environment"
	};
	const result = await chatVision(apiKey, data.imageDataUrl, "You write operational deliverables from picture analysis. JSON only. Use only what is visible plus the provided analysis. No medical, legal, structural, or authenticity verdicts. No appraisals.", `Work area: ${data.workArea}
Playbook: ${{
		resale: "Clothing resale intake note (NOT a listing yet). Fields: kind, colorway, condition (observed), brand-as-read or 'none visible', photo role, missing angles. Sections: Observed description, Catalog note. Checklist: missing photos, measurements. NEVER invent brand, size, or price. NEVER write 'authentic'. This is a pause-before-price record.",
		"real-estate": "Real-estate listing plate. Fields: set role, room type, staging quality, visible finishes, light. Sections: Headline, Listing copy (80-140 words), Alt text. Checklist: missing rooms, crop, clutter. NEVER invent sqft, beds, address, or amenities not visible.",
		product: "Product catalog plate. Fields: product type, colorway, background, aspect, readiness. Sections: Title, Bullets (newline-separated, 4-6), Alt text. NEVER invent brand, SKU, price, or unseen materials.",
		inspection: "Inspection field note. Fields: finding, material, severity (observe|repair|urgent-review), moisture/safety flags. Sections: Field note (factual), Client-facing summary (non-alarmist). NEVER diagnose structural failure or write legal language. Visible crack ≠ foundation is failing.",
		editorial: "Editorial/social plate. Fields: frame role, crop advice for 1:1 / 4:5 / 9:16, wardrobe/scene, mood. Sections: Caption, Alt text, Usage notes. Flag likeness if a face is identifiable.",
		brand: "Brand/UI audit. Fields: extracted palette hexes, type notes, layout pattern, contrast flags. Sections: Audit summary, Token suggestions. Checklist: contrast, crowded type, off-brand hues.",
		archive: "Collection catalog record. Fields: object type, subject, medium/support, condition, orientation. Sections: Description (museum tone), Subject headings. Checklist: verso/detail, inscriptions, dimensions."
	}[data.workArea]}

Low-level facts:
${data.lowLevelSummary}

High-level analysis JSON:
${JSON.stringify(data.highLevel)}

Return JSON:
{
  "title": string,
  "fields": [{ "label", "value" }],
  "sections": [{ "heading", "body" }],
  "checklist": [{ "item" }]
}`, 1400);
	if (!result.ok) return result;
	const parsed = parseJson(result.text);
	if (!parsed) return {
		ok: false,
		error: "Could not parse workflow"
	};
	return {
		ok: true,
		workflow: toWorkflow(parsed, data.workArea)
	};
});
function asInt(v, fallback) {
	if (typeof v === "number" && Number.isFinite(v)) return Math.round(v);
	return fallback;
}
function toReport(raw, garment) {
	const marketRaw = raw.market ?? {};
	const authRaw = raw.authenticity ?? {};
	const deeperRaw = raw.deeper ?? {};
	const vintage30 = raw.vintage30 === true;
	const unique = raw.uniqueOrRare === true || garment.uniqueOrRare;
	const highEnd = raw.highEnd === true || garment.highEnd;
	const designer = pick(raw.designerVerifiable, [
		"not-designer",
		"unverified",
		"label-present",
		"needs-second-pass"
	], garment.brandVisible ? "label-present" : highEnd ? "needs-second-pass" : "not-designer");
	const needAuth = highEnd || designer === "needs-second-pass" || designer === "label-present";
	return {
		brand: nullishString(raw.brand) ?? garment.brandVisible,
		size: nullishString(raw.size) ?? garment.sizeVisible,
		yearMade: nullishString(raw.yearMade) ?? garment.yearMade,
		yearBasis: pick(raw.yearBasis, [
			"label",
			"era-guess",
			"unknown"
		], "unknown"),
		condition: pick(raw.condition, CONDITIONS, garment.condition),
		noticeableFeatures: asStringArr(raw.noticeableFeatures).length ? asStringArr(raw.noticeableFeatures) : garment.noticeableFeatures,
		vintage30,
		vintageNote: nullishString(raw.vintageNote),
		designerVerifiable: designer,
		uniqueOrRare: unique,
		uniqueNote: nullishString(raw.uniqueNote),
		highEnd,
		market: {
			soldHigh: asInt(marketRaw.soldHigh, null),
			soldLow: asInt(marketRaw.soldLow, null),
			daysToSell: asInt(marketRaw.daysToSell, null),
			topOfMarket: asInt(marketRaw.topOfMarket, null),
			fasterSell: asInt(marketRaw.fasterSell, null),
			channels: asStringArr(marketRaw.channels).slice(0, 4),
			notes: asString(marketRaw.notes)
		},
		authenticity: {
			status: pick(authRaw.status, [
				"not-required",
				"queued",
				"unverified",
				"flagged"
			], needAuth ? "queued" : "not-required"),
			tells: asStringArr(authRaw.tells),
			note: asString(authRaw.note)
		},
		deeper: {
			ran: deeperRaw.ran === true,
			findings: asString(deeperRaw.findings)
		}
	};
}
var evaluatePrice_createServerFn_handler = createServerRpc({
	id: "3ee3ec00493ee0890127353aa03e1e2c02722f756732d0cd0e87e775409d8699",
	name: "evaluatePrice",
	filename: "src/lib/ai.ts"
}, (opts) => evaluatePrice.__executeServer(opts));
var evaluatePrice = createServerFn({ method: "POST" }).validator((input) => input).handler(evaluatePrice_createServerFn_handler, async ({ data }) => {
	const apiKey = getApiKey();
	if (!apiKey) return {
		ok: false,
		error: "Valuation is unavailable in this environment"
	};
	const result = await chatVision(apiKey, data.imageDataUrl, "You write a resale VALUATION REPORT from visible garment photos. JSON only. This is not an appraisal, not fair-market value, not a certificate of authenticity. Never claim a piece is real or fake as a fact. If brand is not readable, treat as unbranded. Vintage means 30+ years only when era cues or a dated label support it. Market numbers are estimated listing bands from typical sold ranges you know — label them as estimates.", `Garment JSON:
${JSON.stringify(data.garment)}

High-level:
${JSON.stringify({
		title: data.highLevel.title,
		summary: data.highLevel.summary,
		quality: data.highLevel.quality,
		confidence: data.highLevel.confidence,
		objects: data.highLevel.objects,
		textInImage: data.highLevel.textInImage
	})}

Low-level: ${data.lowLevelSummary}
Photos in this like-item group: ${data.photoCount}
Roles present: ${data.roles.join(", ") || "unknown"}

Return JSON:
{
  "brand": string|null,
  "size": string|null,
  "yearMade": string|null,
  "yearBasis": "label"|"era-guess"|"unknown",
  "condition": "nwt"|"like-new"|"excellent"|"good"|"fair"|"as-is",
  "noticeableFeatures": string[],
  "vintage30": boolean,
  "vintageNote": string|null,
  "designerVerifiable": "not-designer"|"unverified"|"label-present"|"needs-second-pass",
  "uniqueOrRare": boolean,
  "uniqueNote": string|null,
  "highEnd": boolean,
  "market": {
    "soldHigh": integer|null,
    "soldLow": integer|null,
    "daysToSell": integer|null,
    "topOfMarket": integer|null,
    "fasterSell": integer|null,
    "channels": string[],
    "notes": "2-5 sentences, estimates only"
  },
  "listLow": integer,
  "listHigh": integer,
  "listSuggested": integer,
  "channel": "poshmark"|"ebay"|"depop"|"grailed"|"realreal"|"vestiaire"|"facebook"|"local-consign",
  "compsNote": "2-5 sentences",
  "confidence": 0-1,
  "flags": string[],
  "authenticity": { "status": "not-required"|"queued"|"unverified"|"flagged", "tells": string[], "note": string },
  "deeper": { "ran": false, "findings": "" }
}
listSuggested inside [listLow, listHigh]. topOfMarket ≈ soldHigh band. fasterSell is a quicker-move ask, usually nearer soldLow/mid. Set uniqueOrRare or highEnd true when a second pass is warranted. Never write authentic/genuine/fake as a verdict.`, 1800);
	if (!result.ok) return result;
	const parsed = parseJson(result.text);
	if (!parsed) return {
		ok: false,
		error: "Could not parse valuation"
	};
	const report = toReport(parsed, data.garment);
	const low = Math.max(1, Math.round(asNumber(parsed.listLow, report.market.soldLow ?? 20)));
	const high = Math.max(low, Math.round(asNumber(parsed.listHigh, report.market.soldHigh ?? low + 20)));
	let suggested = Math.round(asNumber(parsed.listSuggested, Math.round((low + high) / 2)));
	suggested = Math.min(high, Math.max(low, suggested));
	if (!report.market.topOfMarket) report.market.topOfMarket = high;
	if (!report.market.fasterSell) report.market.fasterSell = low;
	return {
		ok: true,
		price: {
			listLow: low,
			listHigh: high,
			listSuggested: suggested,
			userList: null,
			currency: "USD",
			channel: asString(parsed.channel, report.market.channels[0] ?? "poshmark"),
			compsNote: asString(parsed.compsNote, report.market.notes),
			confidence: Math.max(0, Math.min(1, asNumber(parsed.confidence, .55))),
			flags: asStringArr(parsed.flags),
			status: "paused",
			draftedAt: Date.now(),
			report
		}
	};
});
var runSecondPass_createServerFn_handler = createServerRpc({
	id: "2e2fa300a1a42494a450de5012b869adf0107515566e683a653f6005e5859525",
	name: "runSecondPass",
	filename: "src/lib/ai.ts"
}, (opts) => runSecondPass.__executeServer(opts));
var runSecondPass = createServerFn({ method: "POST" }).validator((input) => input).handler(runSecondPass_createServerFn_handler, async ({ data }) => {
	const apiKey = getApiKey();
	if (!apiKey) return {
		ok: false,
		error: "Second pass is unavailable in this environment"
	};
	const authMode = data.kind === "authenticity";
	const result = await chatVision(apiKey, data.imageDataUrl, authMode ? "You do a second-look authenticity REVIEW of a high-end garment photo. JSON only. You cannot authenticate. List visible tells (stitching, hardware, label set, fonts, linings). Never write authentic, genuine, real, or fake as a fact. Status is unverified or flagged." : "You do a deeper research pass on a unique or vintage (30+ years) garment photo. JSON only. Discuss era cues, comparable silhouettes, scarcity language as hypothesis. Never invent a house, year, or sold-comp SKU you cannot support from what is visible.", authMode ? `Garment: ${JSON.stringify(data.garment)}
Current report: ${JSON.stringify({
		brand: data.report.brand,
		designerVerifiable: data.report.designerVerifiable,
		features: data.report.noticeableFeatures
	})}
Visible text: ${JSON.stringify(data.highLevel.textInImage)}
Return JSON: { "status": "unverified"|"flagged", "tells": string[], "note": "3-6 sentences" }` : `Garment: ${JSON.stringify(data.garment)}
Year/era: ${data.report.yearMade} (${data.report.yearBasis}) vintage30=${data.report.vintage30}
Unique note: ${data.report.uniqueNote}
Summary: ${data.highLevel.summary}
Return JSON: { "findings": "a short research memo, 1-2 paragraphs" }`, 900);
	if (!result.ok) return result;
	const parsed = parseJson(result.text);
	if (!parsed) return {
		ok: false,
		error: "Could not parse second pass"
	};
	if (authMode) return {
		ok: true,
		authenticity: {
			status: pick(parsed.status, ["unverified", "flagged"], "unverified"),
			tells: asStringArr(parsed.tells),
			note: asString(parsed.note),
			ranAt: Date.now()
		}
	};
	return {
		ok: true,
		deeper: {
			ran: true,
			findings: asString(parsed.findings),
			ranAt: Date.now()
		}
	};
});
var buildListingTemplate_createServerFn_handler = createServerRpc({
	id: "04f5ba1bdb5b5f4d9888382b364e2081ae994c880070db60b21677d61ee35218",
	name: "buildListingTemplate",
	filename: "src/lib/ai.ts"
}, (opts) => buildListingTemplate.__executeServer(opts));
var buildListingTemplate = createServerFn({ method: "POST" }).validator((input) => input).handler(buildListingTemplate_createServerFn_handler, async ({ data }) => {
	const apiKey = getApiKey();
	if (!apiKey) return {
		ok: false,
		error: "Templates are unavailable in this environment"
	};
	const result = await chatVision(apiKey, data.imageDataUrl, "You write a resale listing after a human approved the list price. JSON only. Use only visible facts. Never say authentic, rare investment, or appraised. Include brand only if brandVisible is set. Condition as observed.", `Approved operator list price: $${data.approvedList} USD (not an appraisal)
Channel: ${data.channel}
Garment: ${JSON.stringify(data.garment)}
Title/summary: ${data.highLevel.title}. ${data.highLevel.summary}
Comps note (for you, do not paste as fact): ${data.compsNote}

Return JSON:
{
  "title": string,
  "bullets": 4-6 short strings,
  "description": 1 short paragraph,
  "measurementsNeeded": string[],
  "hashtags": 6-10 strings without #,
  "channelNotes": one line for the seller
}`, 900);
	if (!result.ok) return result;
	const parsed = parseJson(result.text);
	if (!parsed) return {
		ok: false,
		error: "Could not parse template"
	};
	return {
		ok: true,
		template: {
			title: asString(parsed.title, data.highLevel.title),
			bullets: asStringArr(parsed.bullets).slice(0, 8),
			description: asString(parsed.description),
			measurementsNeeded: asStringArr(parsed.measurementsNeeded),
			hashtags: asStringArr(parsed.hashtags).map((h) => h.replace(/^#/, "")).slice(0, 12),
			channelNotes: asString(parsed.channelNotes),
			generatedAt: Date.now()
		}
	};
});
//#endregion
export { aiAvailable_createServerFn_handler, analyzeImage_createServerFn_handler, buildListingTemplate_createServerFn_handler, evaluatePrice_createServerFn_handler, runSecondPass_createServerFn_handler, runWorkArea_createServerFn_handler };
