export type LedgerId = "business" | "personal";

export type LaneId = "resell" | "social" | "log";

export type CollectionId =
  | "inbox"
  | "garments"
  | "accessories"
  | "social"
  | "personal"
  | "weeded"
  | "archive";

export type WorkAreaId =
  | "resale"
  | "real-estate"
  | "product"
  | "inspection"
  | "editorial"
  | "brand"
  | "archive";

export type ConditionId =
  | "nwt"
  | "like-new"
  | "excellent"
  | "good"
  | "fair"
  | "as-is";

export type ResellCategory =
  | "contemporary"
  | "designer"
  | "vintage"
  | "streetwear"
  | "workwear"
  | "outdoor"
  | "formal"
  | "kids"
  | "accessories"
  | "shoes"
  | "bags"
  | "jewelry"
  | "home-textile"
  | "other";

export type PhotoRole =
  | "hero-front"
  | "hero-back"
  | "side"
  | "detail"
  | "label"
  | "hangtag"
  | "defect"
  | "fit-on-body"
  | "in-situ"
  | "flat-lay"
  | "other";

export type GroupStatus =
  | "sorting"
  | "ready"
  | "pricing"
  | "paused"
  | "sent"
  | "client-back"
  | "approved"
  | "hold"
  | "listed";

export type BatchStatus = "intake" | "sorting" | "ready" | "paused" | "approved";

export type LogType =
  | "intake"
  | "prep"
  | "classify"
  | "group"
  | "move-ledger"
  | "assign-client"
  | "select-pass"
  | "valuation"
  | "deeper-pass"
  | "auth-pass"
  | "price-draft"
  | "price-pause"
  | "price-adjust"
  | "approve"
  | "send-client"
  | "client-back"
  | "list-hold"
  | "template"
  | "hold"
  | "export"
  | "delete"
  | "lane-move"
  | "edit-queue"
  | "edit-run"
  | "ready-to-post"
  | "recatalog"
  | "meta-extract"
  | "dupe"
  | "night-sort"
  | "weed"
  | "restore";

export type WeedReason = "duplicate" | "blur" | "unrelated" | "off-lane" | "other";

export type PaletteSwatch = { hex: string; pct: number };

export type ImageMeta = {
  takenAt: string | null;
  takenSource: "original" | "modify" | null;
  make: string | null;
  model: string | null;
  lens: string | null;
  iso: number | null;
  aperture: string | null;
  shutter: string | null;
  focalMm: number | null;
  orientation: number;
  hasGps: boolean;
  hashSha256: string;
  contentHash: string;
  sourceMime: string;
  sourceBytes: number;
  extractedAt: number;
};

export type DupeRecord = {
  kind: "hash" | "content";
  ofId: string;
  ofIntake?: string;
  score: number;
  keeperScore: number;
  distance?: number;
  status: "keeper" | "extra";
  reason: string;
};

export type LowLevelAnalysis = {
  palette: PaletteSwatch[];
  brightness: number;
  contrast: number;
  saturation: number;
  sharpness: number;
  temperature: "cool" | "neutral" | "warm";
  histogram: number[];
  orientation: "landscape" | "portrait" | "square";
  aspectLabel: string;
};

export type HighLevelSubject = {
  name: string;
  prominence: number;
  location: string;
};

export type HighLevelAnalysis = {
  title: string;
  summary: string;
  scene: string;
  subjects: HighLevelSubject[];
  composition: string;
  mood: string[];
  lighting: string;
  style: string;
  quality: { score: number; issues: string[]; strengths: string[] };
  objects: string[];
  textInImage: string[];
  suggestedCategory: string;
  suggestedTags: string[];
  suggestedWorkArea: WorkAreaId | null;
  suggestedCollection: CollectionId;
  suggestedLedger: LedgerId;
  suggestedLane?: LaneId;
  weedReason?: WeedReason | null;
  confidence: number;
};

export type GarmentRecord = {
  isGarment: boolean;
  kind: string;
  styleName: string;
  category: ResellCategory;
  colorway: string;
  pattern: string;
  fiberVisible: string | null;
  brandVisible: string | null;
  sizeVisible: string | null;
  yearMade: string | null;
  condition: ConditionId;
  defects: string[];
  noticeableFeatures: string[];
  era: string | null;
  photoRole: PhotoRole;
  resellChannels: string[];
  groupHint: string;
  measurementsNeeded: string[];
  uniqueOrRare: boolean;
  highEnd: boolean;
};

export type WorkflowResult = {
  workArea: WorkAreaId;
  title: string;
  ranAt: number;
  sections: { heading: string; body: string }[];
  fields: { label: string; value: string }[];
  checklist: { item: string }[];
};

export type ValuationReport = {
  brand: string | null;
  size: string | null;
  yearMade: string | null;
  yearBasis: "label" | "era-guess" | "unknown";
  condition: ConditionId;
  noticeableFeatures: string[];
  vintage30: boolean;
  vintageNote: string | null;
  designerVerifiable: "not-designer" | "unverified" | "label-present" | "needs-second-pass";
  uniqueOrRare: boolean;
  uniqueNote: string | null;
  highEnd: boolean;
  market: {
    soldHigh: number | null;
    soldLow: number | null;
    daysToSell: number | null;
    topOfMarket: number | null;
    fasterSell: number | null;
    channels: string[];
    notes: string;
  };
  authenticity: {
    status: "not-required" | "queued" | "unverified" | "flagged";
    tells: string[];
    note: string;
    ranAt?: number;
  };
  deeper: {
    ran: boolean;
    findings: string;
    ranAt?: number;
  };
};

export type PriceEval = {
  listLow: number;
  listHigh: number;
  listSuggested: number;
  userList: number | null;
  currency: "USD";
  channel: string;
  compsNote: string;
  confidence: number;
  flags: string[];
  status: "paused" | "sent" | "approved" | "hold";
  draftedAt: number;
  approvedAt?: number;
  report: ValuationReport;
};

export type ListingTemplate = {
  title: string;
  bullets: string[];
  description: string;
  measurementsNeeded: string[];
  hashtags: string[];
  channelNotes: string;
  generatedAt: number;
};

export type HandshakeDecision = "approve" | "adjust" | "decline";

export type HandshakeReply = {
  at: number;
  decision: HandshakeDecision;
  listPrice: number | null;
  note: string;
};

export type HandshakeRound = {
  id: string;
  round: number;
  sentAt: number;
  packet: string;
  listAsk: number;
  channel: string;
  waiting: boolean;
  reply?: HandshakeReply;
};

export type EditStatus =
  | "none"
  | "queued"
  | "processing"
  | "ready-to-post"
  | "recataloged";

export type EditRecipe = "resell-batch" | "social-minimal";

export type PhotoEdit = {
  recipe: EditRecipe;
  status: EditStatus;
  program: "tbd" | "preview-local";
  queuedAt?: number;
  ranAt?: number;
  recatalogedAt?: number;
  bgRemoval: "not-needed" | "pending-tbd" | "skipped-on-body" | "preview-only";
  enhance: "none" | "preview-local" | "pending-tbd";
  previewUrl?: string;
  notes: string[];
  crops: string[];
};

export type CatalogItem = {
  id: string;
  name: string;
  createdAt: number;
  collectionId: CollectionId;
  ledger: LedgerId;
  lane: LaneId;
  clientId: string | null;
  clientFirst: string | null;
  clientLast: string | null;
  batchId: string | null;
  groupId: string | null;
  catalogCode?: string;
  intakeCode?: string;
  prepped: boolean;
  orientationApplied: number;
  tags: string[];
  mime: string;
  bytes: number;
  width: number;
  height: number;
  thumbDataUrl: string;
  objectUrl?: string;
  sampleSrc?: string;
  isSample?: boolean;
  category?: string;
  lowLevel?: LowLevelAnalysis;
  highLevel?: HighLevelAnalysis;
  meta?: ImageMeta;
  dupe?: DupeRecord;
  garment?: GarmentRecord;
  edit?: PhotoEdit;
  editing?: boolean;
  workflows: WorkflowResult[];
  analyzing?: boolean;
  runningWorkflow?: boolean;
  analysisError?: string;
};

export type IntakeBatch = {
  id: string;
  label: string;
  clientId: string | null;
  clientFirst: string | null;
  clientLast: string | null;
  ledger: LedgerId;
  lane: LaneId;
  createdAt: number;
  itemIds: string[];
  status: BatchStatus;
};

export type LotGroup = {
  id: string;
  batchId: string | null;
  key: string;
  label: string;
  prettyName: string;
  clientId: string | null;
  clientFirst: string | null;
  clientLast: string | null;
  ledger: LedgerId;
  itemIds: string[];
  catalogCode?: string;
  status: GroupStatus;
  price?: PriceEval;
  template?: ListingTemplate;
  handshake?: HandshakeRound;
  pricing?: boolean;
  templating?: boolean;
};

export type LogEvent = {
  id: string;
  at: number;
  actor: "system" | "user" | "client";
  type: LogType;
  ledger: LedgerId;
  message: string;
  clientId?: string | null;
  batchId?: string;
  groupId?: string;
  itemIds?: string[];
};

export type StudioView = "rail" | "inspect" | "edit" | "approve" | "clients" | "log";
export type RailMode = "grid" | "sheet";
