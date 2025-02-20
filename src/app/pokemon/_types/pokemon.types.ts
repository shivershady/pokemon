import { z } from "zod";

export const NamedAPIResourceSchema = z.object({
  name: z.string(),
  url: z.string(),
});

export const PokemonTypeSchema = z.object({
  name: z.string(),
  url: z.string(),
});

export const PokemonTypeSlotSchema = z.object({
  slot: z.number(),
  type: PokemonTypeSchema,
});

export const PokemonSpritesSchema = z.object({
  front_default: z.string().nullable(),
  front_shiny: z.string().nullable(),
  front_female: z.string().nullable(),
  front_shiny_female: z.string().nullable(),
  back_default: z.string().nullable(),
  back_shiny: z.string().nullable(),
  back_female: z.string().nullable(),
  back_shiny_female: z.string().nullable(),
  other: z.object({
    "official-artwork": z.object({
      front_default: z.string().nullable(),
    }),
  }),
});

export const PokemonCriesSchema = z.object({
  latest: z.string(),
  legacy: z.string(),
});

export const PokemonAbilitySchema = z.object({
  is_hidden: z.boolean(),
  slot: z.number(),
  ability: NamedAPIResourceSchema,
});

export const PokemonHeldItemVersionSchema = z.object({
  version: NamedAPIResourceSchema,
  rarity: z.number(),
});

export const PokemonHeldItemSchema = z.object({
  item: NamedAPIResourceSchema,
  version_details: z.array(PokemonHeldItemVersionSchema),
});

export const PokemonMoveVersionSchema = z.object({
  move_learn_method: NamedAPIResourceSchema,
  version_group: NamedAPIResourceSchema,
  level_learned_at: z.number(),
});

export const PokemonMoveSchema = z.object({
  move: NamedAPIResourceSchema,
  version_group_details: z.array(PokemonMoveVersionSchema),
});

export const PokemonStatSchema = z.object({
  stat: NamedAPIResourceSchema,
  effort: z.number(),
  base_stat: z.number(),
});

export const PokemonTypePastSchema = z.object({
  generation: NamedAPIResourceSchema,
  types: z.array(PokemonTypeSlotSchema),
});

export const PokemonSchema = z.object({
  id: z.number(),
  name: z.string(),
  base_experience: z.number().nullable(),
  height: z.number(),
  weight: z.number(),
  is_default: z.boolean(),
  order: z.number(),
  abilities: z.array(PokemonAbilitySchema),
  forms: z.array(NamedAPIResourceSchema),
  held_items: z.array(PokemonHeldItemSchema),
  location_area_encounters: z.string(),
  moves: z.array(PokemonMoveSchema),
  sprites: PokemonSpritesSchema,
  cries: PokemonCriesSchema.optional(),
  species: NamedAPIResourceSchema,
  stats: z.array(PokemonStatSchema),
  types: z.array(PokemonTypeSlotSchema),
  past_types: z.array(PokemonTypePastSchema).optional(),
});

export const PokemonListSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(NamedAPIResourceSchema),
});

export type NamedAPIResource = z.infer<typeof NamedAPIResourceSchema>;
export type Pokemon = z.infer<typeof PokemonSchema>;
export type PokemonList = z.infer<typeof PokemonListSchema>;
export type PokemonSprites = z.infer<typeof PokemonSpritesSchema>;
export type PokemonAbility = z.infer<typeof PokemonAbilitySchema>;
export type PokemonMove = z.infer<typeof PokemonMoveSchema>;
export type PokemonStat = z.infer<typeof PokemonStatSchema>;
export type PokemonType = z.infer<typeof PokemonTypeSchema>;
