# Catalog taxonomy

A catalog is a library, not a chat log. Every image is a record.

## Record

```
id, name, createdAt
collectionId, category, tags[]
width, height, mime, bytes
lowLevel, highLevel
workArea?, workflows[]
```

`name` starts as the filename stem, then prefer the high-level `title` once analysis lands.

## Collections

| ID | Holds |
|---|---|
| `interiors` | Rooms, exteriors, staging, architecture |
| `product` | Packshots, SKUs, still life for sale |
| `field` | Sites, defects, installations, job-site |
| `editorial` | People, fashion, campaign, social frames |
| `archive` | Art, documents, specimens, historical plates |
| `inbox` | Unsorted / unknown — empty this, don't leave it as a dumping ground |

If confidence is low or work area is null, file in `inbox` and tag `needs-review`.

## Categories (suggested, not closed)

- interiors: living-room, kitchen, bedroom, bath, exterior, detail
- product: packshot, lifestyle, swatch, kit, packaging
- field: defect, progress, context, material, safety
- editorial: look, street, beauty, still, campaign
- archive: artwork, document, specimen, object, photograph

## Tags

- lowercase, hyphenated, specific (`oak-herringbone` not `floor`)
- mix of subject, material, light, use (`hero-image`, `square-packshot`)
- 5–12 per record; drop duplicates of the collection name

## Search

Match name, title, summary, tags, category, collection, OCR text. Tag filters are AND with the collection, OR across selected tags.
