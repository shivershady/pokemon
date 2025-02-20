import { Suspense } from "react";
import { PokemonTable } from "./_components/pokemon-table";
import { pokemonApi } from "./_services/pokemon-api";

export default async function PokemonPage() {
  const initialPokemons = await pokemonApi.getPokemonBatch(0, 50);

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Pokemon List</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <PokemonTable initialPokemons={initialPokemons} />
      </Suspense>
    </main>
  );
}
