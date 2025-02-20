import ky, { Options as KyOptions } from "ky";
import {
  Pokemon,
  PokemonList,
  PokemonListSchema,
  PokemonSchema,
} from "../_types/pokemon.types";

import { z } from "zod";

const ApiConfigSchema = z.object({
  baseUrl: z.string().url(),
  timeout: z.number().min(1000),
  retries: z.number().min(0),
});

type ApiConfig = z.infer<typeof ApiConfigSchema>;

export class PokemonApi {
  private api: typeof ky;
  private config: ApiConfig;

  constructor(config?: Partial<ApiConfig>) {
    this.config = ApiConfigSchema.parse({
      baseUrl: "https://pokeapi.co/api/v2",
      timeout: 10000,
      retries: 3,
      ...config,
    });

    const kyOptions: KyOptions = {
      prefixUrl: this.config.baseUrl,
      timeout: this.config.timeout,
      retry: {
        limit: this.config.retries,
        methods: ["get"],
      },
    };

    this.api = ky.create(kyOptions);
  }

  async getPokemonList(
    offset: number = 0,
    limit: number = 50
  ): Promise<PokemonList> {
    try {
      const response = await this.api
        .get("pokemon", {
          searchParams: {
            offset: offset.toString(),
            limit: limit.toString(),
          },
        })
        .json();
      return PokemonListSchema.parse(response);
    } catch (error) {
      console.error("Failed to fetch Pokemon list:", error);
      throw new Error("Failed to fetch Pokemon list");
    }
  }

  async getPokemon(nameOrId: string | number): Promise<Pokemon> {
    try {
      const response = await this.api
        .get(`pokemon/${nameOrId.toString().toLowerCase()}`)
        .json();
      return PokemonSchema.parse(response);
    } catch (error) {
      console.error(`Failed to fetch Pokemon ${nameOrId}:`, error);
      throw new Error(`Failed to fetch Pokemon ${nameOrId}`);
    }
  }

  async getPokemonBatch(
    offset: number = 0,
    limit: number = 50
  ): Promise<Pokemon[]> {
    try {
      const list = await this.getPokemonList(offset, limit);
      const pokemons = await Promise.all(
        list.results.map(pokemon => this.getPokemon(pokemon.name))
      );
      return pokemons;
    } catch (error) {
      console.error("Failed to fetch Pokemon batch:", error);
      throw new Error("Failed to fetch Pokemon batch");
    }
  }
}

// Create a singleton instance with default configuration
export const pokemonApi = new PokemonApi();
