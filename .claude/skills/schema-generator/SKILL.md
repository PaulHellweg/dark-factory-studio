---
name: schema-generator
description: Derives a complete Prisma schema from spec.md entities and architecture.md data requirements. Phase 03 skill. Outputs schema.prisma with all models, relations, enums, and indexes.
---

# Schema Generator Skill

## Trigger

- Phase 03 becomes active (after Phase 02 approval)
- schema-agent loads this skill

## Input

- `studio/spec.md` — entities, actors, constraints
- `studio/architecture.md` — data requirements per page

## Process

### Step 1 — Entity Extraction

From spec.md, list every noun that represents stored data:
- Actors → User models with roles
- Features → domain models
- Relationships → explicit Prisma relations

### Step 2 — Cross-Reference with Architecture

From architecture.md "Data needed" sections:
- Verify every data requirement has a matching model
- Identify missing models or fields
- Identify query patterns → indexes

### Step 3 — Schema Design

For each model:
- ID strategy: `cuid()` by default
- Timestamps: `createdAt`, `updatedAt` always
- Soft delete: add `deletedAt` if spec mentions audit trail or recovery
- Relations: explicit names, cascade rules documented
- Enums: for any field with fixed values
- Indexes: on foreign keys, on fields used in filters/sorts

### Step 4 — Validation Checklist

Before presenting:
- [ ] Every actor from spec.md has a model or role enum
- [ ] Every feature's data is represented
- [ ] All relations are bidirectional in Prisma
- [ ] No orphan models (every model is related to at least one other)
- [ ] Indexes on all foreign keys
- [ ] Enum used instead of string for fixed values
- [ ] Comments on non-obvious design decisions

## Output

Hand off to PHASE.md for the schema.prisma structure.
