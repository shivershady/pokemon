import ky from 'ky';
import { z } from 'zod';

const PokemonTypeSchema = z.object({
  name: z.string(),
  url: z.string(),
});

const PokemonSpritesSchema = z.object({
  front_default: z.string().nullable(),
});

const PokemonTypeSlotSchema = z.object({
  slot: z.number(),
  type: PokemonTypeSchema,
});

const PokemonSchema = z.object({
  id: z.number(),
  name: z.string(),
  sprites: PokemonSpritesSchema,
  types: z.array(PokemonTypeSlotSchema),
});

const PokemonListSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(z.object({
    name: z.string(),
    url: z.string(),
  })),
});

export type Pokemon = z.infer<typeof PokemonSchema>;
export type PokemonList = z.infer<typeof PokemonListSchema>;

export class PokemonApi {
  private api: typeof ky;
  
  constructor() {
    this.api = ky.create({
      prefixUrl: 'https://pokeapi.co/api/v2',
    });
  }

  async getPokemonList(offset: number = 0, limit: number = 50): Promise<PokemonList> {
    const response = await this.api.get(`pokemon?offset=${offset}&limit=${limit}`).json();
    return PokemonListSchema.parse(response);
  }

  async getPokemon(nameOrId: string | number): Promise<Pokemon> {
    const response = await this.api.get(`pokemon/${nameOrId}`).json();
    return PokemonSchema.parse(response);
  }

  async getPokemonBatch(offset: number = 0, limit: number = 50): Promise<Pokemon[]> {
    const list = await this.getPokemonList(offset, limit);
    const pokemons = await Promise.all(
      list.results.map(pokemon => this.getPokemon(pokemon.name))
    );
    return pokemons;
  }
}

export const pokemonApi = new PokemonApi();
