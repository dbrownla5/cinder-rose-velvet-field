import { prettyLotName } from "./grouping";
import type {
  CatalogItem,
  GarmentRecord,
  HighLevelAnalysis,
  LaneId,
  LedgerId,
  PhotoEdit,
  WorkflowResult,
} from "./types";

type SampleDef = {
  id: string;
  src: string;
  name: string;
  bytes: number;
  ledger: LedgerId;
  lane: LaneId;
  clientId: string | null;
  clientFirst: string | null;
  clientLast: string | null;
  batchId: string | null;
  groupId: string | null;
  catalogCode?: string;
  intakeCode?: string;
  garment?: GarmentRecord;
  highLevel: HighLevelAnalysis;
  workflow: WorkflowResult;
  edit?: PhotoEdit;
};

const now = Date.now() - 2 * 24 * 60 * 60 * 1000;

export const SAMPLES: SampleDef[] = [
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
        "On-body street plate at dusk",
      ],
      era: null,
      photoRole: "fit-on-body",
      resellChannels: ["poshmark", "ebay"],
      groupHint: "charcoal-wool-coat",
      measurementsNeeded: ["length", "chest", "shoulder", "label-photo"],
      uniqueOrRare: false,
      highEnd: false,
    },
    highLevel: {
      title: "Figure in a charcoal coat on a wet dusk street",
      summary:
        "Editorial fashion frame, subject walking away. Long charcoal wool-look coat, wet pavement, fogged city lights. Shallow depth of field, cool color, 2:3 portrait crop. Usable as an on-body plate for a resale lot, but a flat-lay and label shot are still missing.",
      scene: "Urban sidewalk at dusk, wet weather",
      subjects: [
        { name: "Person in charcoal coat", prominence: 0.7, location: "center" },
        { name: "Wet street / city bokeh", prominence: 0.22, location: "background" },
      ],
      composition:
        "Vertical. Subject slightly left of center, walking away. Background collapses to lights. Strong figure-ground.",
      mood: ["cinematic", "solitary", "cool", "dusk"],
      lighting: "Available dusk + street lamps, cool highlights on wet stone",
      style: "Fashion editorial / lookbook",
      quality: {
        score: 8,
        issues: ["Face not visible (intentional)", "Not a packshot — street grade"],
        strengths: ["Clear silhouette", "Mood-consistent grade", "Portrait crop"],
      },
      objects: ["wool coat", "wet pavement", "street lights", "building facade"],
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
        "maya-chen",
      ],
      suggestedWorkArea: "resale",
      suggestedCollection: "garments",
      suggestedLedger: "business",
      confidence: 0.91,
    },
    workflow: {
      workArea: "resale",
      title: "Intake note — charcoal coat",
      ranAt: now,
      fields: [
        { label: "Kind", value: "Coat, long, charcoal" },
        { label: "Style", value: "Wool coat" },
        { label: "Condition", value: "Excellent — observed, no defects in frame" },
        { label: "Brand", value: "None visible" },
        { label: "Photo role", value: "On-body / street" },
        { label: "Client", value: "Maya Chen" },
      ],
      sections: [
        {
          heading: "Observed description",
          body: "Long charcoal coat worn on a wet dusk street. Silhouette reads wool-look; fiber, size, and year are not readable. No hangtag or interior label in this plate.",
        },
        {
          heading: "Catalog note",
          body: "Filed as a business lot for Maya Chen. Sized and rotated. Waiting on your pass-through before any valuation. Need a flat-lay front/back and a label photo before publish.",
        },
      ],
      checklist: [
        { item: "Shoot front and back flat-lay" },
        { item: "Photograph the care label" },
        { item: "Record length, chest, and shoulder" },
        { item: "Do not claim a brand or authenticity" },
      ],
    },
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
        "Analog dial, no house mark in frame",
      ],
      era: null,
      photoRole: "hero-front",
      resellChannels: ["ebay", "grailed"],
      groupHint: "matte-black-watch",
      measurementsNeeded: ["case-diameter", "lug-width", "case-back"],
      uniqueOrRare: false,
      highEnd: true,
    },
    edit: {
      recipe: "resell-batch",
      status: "recataloged",
      program: "preview-local",
      bgRemoval: "preview-only",
      enhance: "preview-local",
      recatalogedAt: now - 3000_000,
      notes: ["Already a packshot — preview grade only, program TBD for a true cutout"],
      crops: ["1:1"],
    },
    highLevel: {
      title: "Matte black mechanical watch on dark slate",
      summary:
        "A square studio packshot of a matte-black round watch with a dark leather strap, resting on a slab of dark stone. Soft side light, seamless cool-gray field — ecommerce-ready. No house mark is readable.",
      scene: "Tabletop product still life on stone",
      subjects: [
        { name: "Wristwatch", prominence: 0.72, location: "center" },
        { name: "Slate slab", prominence: 0.2, location: "under subject" },
      ],
      composition:
        "Dead-center, slight top-down. Square frame. Strap describes a loose S-curve for rhythm.",
      mood: ["precise", "quiet", "premium", "studio"],
      lighting: "Soft side key, long speculars on the case, no hard shadows",
      style: "Commercial catalog / packshot",
      quality: {
        score: 9,
        issues: ["No scale reference; brand marks not visible"],
        strengths: ["Seamless background", "Sharp on the dial", "Square crop for PDP"],
      },
      objects: ["watch", "leather strap", "slate", "seamless backdrop"],
      textInImage: [],
      suggestedCategory: "watch",
      suggestedTags: [
        "watch",
        "packshot",
        "matte-black",
        "leather-strap",
        "unbranded",
        "resale",
        "maya-chen",
      ],
      suggestedWorkArea: "resale",
      suggestedCollection: "accessories",
      suggestedLedger: "business",
      confidence: 0.95,
    },
    workflow: {
      workArea: "resale",
      title: "Intake note — watch packshot",
      ranAt: now,
      fields: [
        { label: "Kind", value: "Wristwatch, matte black, leather strap" },
        { label: "Condition", value: "Like new — observed" },
        { label: "Brand", value: "None visible" },
        { label: "Photo role", value: "Hero front / packshot" },
        { label: "Client", value: "Maya Chen" },
      ],
      sections: [
        {
          heading: "Observed description",
          body: "Round matte-black analog watch with a dark leather strap on slate. Studio lighting, no brand, no serial in this plate.",
        },
        {
          heading: "Catalog note",
          body: "Same Maya Chen drop as the coat, separate like-item group. You already passed it to valuation. High-end second pass ran — authenticity unverified. Not an appraisal.",
        },
      ],
      checklist: [
        { item: "Photograph case back and any movement marks" },
        { item: "Measure case diameter and lug width" },
        { item: "Do not invent a house or movement" },
      ],
    },
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
      summary:
        "A staged living room photographed in bright daylight. A low oatmeal sofa sits on oak herringbone floors, facing floor-to-ceiling black steel windows that open the room to a garden.",
      scene: "Furnished residential living room with indoor-outdoor glazing",
      subjects: [
        { name: "Linen sofa", prominence: 0.38, location: "center" },
        { name: "Steel-framed windows", prominence: 0.32, location: "rear wall" },
        { name: "Ceramic table lamp", prominence: 0.14, location: "right of sofa" },
        { name: "Abstract painting", prominence: 0.1, location: "left wall" },
      ],
      composition:
        "Centered, eye-level wide. Furniture is pulled off the walls; the window wall is the vanishing plane.",
      mood: ["calm", "bright", "residential", "staged"],
      lighting: "Hard natural daylight from rear windows, soft fill from the room",
      style: "Editorial real-estate / architectural interior",
      quality: {
        score: 9,
        issues: ["Slightly cool window highlight; verticals are true"],
        strengths: ["Hero staging with a clear subject", "Uncluttered"],
      },
      objects: [
        "sofa",
        "oak herringbone floor",
        "steel windows",
        "ceramic lamp",
        "side table",
        "abstract painting",
        "garden",
      ],
      textInImage: [],
      suggestedCategory: "living-room",
      suggestedTags: [
        "living-room",
        "personal-log",
        "mid-century",
        "steel-windows",
        "oak-herringbone",
      ],
      suggestedWorkArea: "real-estate",
      suggestedCollection: "personal",
      suggestedLedger: "personal",
      confidence: 0.93,
    },
    workflow: {
      workArea: "real-estate",
      title: "Personal log — living room",
      ranAt: now,
      fields: [
        { label: "Ledger", value: "Personal — not in the resale queue" },
        { label: "Room", value: "Living room" },
        { label: "Light", value: "Daylight, rear-lit windows" },
      ],
      sections: [
        {
          heading: "Headline",
          body: "Sunlit living room with floor-to-ceiling garden windows",
        },
        {
          heading: "Alt text",
          body: "Bright living room with an oatmeal sofa on oak herringbone floors, facing large black steel windows onto a garden.",
        },
      ],
      checklist: [{ item: "Keep on the personal ledger unless this is a listing job" }],
    },
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
      summary:
        "Close documentary frame of a poured concrete wall. A fine crack runs diagonally through the field; the surface is stained and slightly damp.",
      scene: "Concrete foundation or retaining wall, close-up",
      subjects: [
        { name: "Hairline crack", prominence: 0.55, location: "diagonal across frame" },
        { name: "Poured concrete surface", prominence: 0.35, location: "full frame" },
      ],
      composition: "Fill-the-frame close-up. The crack is the subject; no scale ruler is present.",
      mood: ["forensic", "dry", "documentary"],
      lighting: "Hard daylight, raking across the relief of the crack",
      style: "Inspection / site photography",
      quality: {
        score: 7,
        issues: ["No scale reference", "No wider context shot"],
        strengths: ["Crack path is readable", "Surface texture is clear"],
      },
      objects: ["concrete", "crack", "mineral staining"],
      textInImage: [],
      suggestedCategory: "defect",
      suggestedTags: ["concrete", "hairline-crack", "personal-log", "inspection"],
      suggestedWorkArea: "inspection",
      suggestedCollection: "personal",
      suggestedLedger: "personal",
      confidence: 0.9,
    },
    workflow: {
      workArea: "inspection",
      title: "Personal log — concrete crack",
      ranAt: now,
      fields: [
        { label: "Finding", value: "Diagonal hairline crack in poured concrete" },
        { label: "Severity", value: "Observe — not a legal or structural verdict" },
      ],
      sections: [
        {
          heading: "Field note",
          body: "Close-up of a hairline crack traversing a poured concrete wall. Record only — this plate does not establish structural cause.",
        },
      ],
      checklist: [
        { item: "Re-shoot with a scale ruler" },
        { item: "Do not write a structural verdict from this close-up" },
      ],
    },
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
      summary:
        "Museum lighting on a dark-wood frame. Inside, a cream plate with foxing holds a detailed fern illustration in brown ink.",
      scene: "Framed work on a gallery wall, isolated",
      subjects: [
        { name: "Botanical fern illustration", prominence: 0.62, location: "center of plate" },
        { name: "Dark wood frame", prominence: 0.22, location: "surround" },
      ],
      composition: "Straight-on catalog shot. Frame concentric with the photograph.",
      mood: ["archival", "quiet", "studied"],
      lighting: "Soft gallery spotlight, slight falloff at the corners of the frame",
      style: "Collection documentation",
      quality: {
        score: 8,
        issues: ["No verso or scale bar"],
        strengths: ["True color of paper", "Subject fully in frame"],
      },
      objects: ["frame", "botanical print", "fern", "foxed paper"],
      textInImage: [],
      suggestedCategory: "artwork",
      suggestedTags: ["botanical", "fern", "personal-log", "archive"],
      suggestedWorkArea: "archive",
      suggestedCollection: "personal",
      suggestedLedger: "personal",
      confidence: 0.92,
    },
    workflow: {
      workArea: "archive",
      title: "Personal log — fern plate",
      ranAt: now,
      fields: [
        { label: "Object type", value: "Framed botanical illustration" },
        { label: "Condition", value: "Foxing and age toning on the plate; frame intact" },
      ],
      sections: [
        {
          heading: "Description",
          body: "A framed botanical illustration of a fern, photographed straight-on under gallery light.",
        },
      ],
      checklist: [{ item: "Photograph verso and any plate inscriptions" }],
    },
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
      summary:
        "Overhead still life: matte grey stoneware dripper, brushed-steel gooseneck kettle, small unglazed cup, on honed white marble.",
      scene: "Tabletop coffee service, overhead",
      subjects: [
        { name: "Gooseneck kettle", prominence: 0.4, location: "upper right" },
        { name: "Pour-over dripper", prominence: 0.28, location: "lower left" },
        { name: "Cup", prominence: 0.14, location: "lower right of dripper" },
      ],
      composition: "Overhead 4:3. Diagonal from kettle to dripper.",
      mood: ["ritual", "cool", "domestic", "precise"],
      lighting: "Soft north-window daylight, gentle shadows",
      style: "Commercial still life / lifestyle product",
      quality: {
        score: 9,
        issues: ["No steam or pour in progress"],
        strengths: ["Clean marble ground", "Materials readable"],
      },
      objects: ["kettle", "pour-over dripper", "cup", "marble slab"],
      textInImage: [],
      suggestedCategory: "lifestyle",
      suggestedTags: ["coffee", "pour-over", "social", "still-life"],
      suggestedWorkArea: "editorial",
      suggestedCollection: "social",
      suggestedLedger: "personal",
      confidence: 0.94,
    },
    workflow: {
      workArea: "editorial",
      title: "Social task — pour-over still life",
      ranAt: now,
      fields: [
        { label: "Lane", value: "Social — not inventory" },
        { label: "Edit", value: "Minimal grade, crop notes only" },
      ],
      sections: [
        {
          heading: "Caption seed",
          body: "Stoneware pour-over and gooseneck kettle on honed marble.",
        },
      ],
      checklist: [
        { item: "Throw in the social minimal-edit task" },
        { item: "Do not send through resell background removal" },
      ],
    },
  },
];

export function sampleToItem(sample: SampleDef, extras: Partial<CatalogItem>): CatalogItem {
  const pretty = sample.garment?.isGarment
    ? prettyLotName(sample.garment, sample.clientId)
    : sample.name;
  return {
    id: sample.id,
    name: pretty,
    createdAt: now,
    collectionId:
      sample.lane === "social"
        ? "social"
        : sample.lane === "log"
          ? "personal"
          : sample.highLevel.suggestedCollection,
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
    ...extras,
  };
}
