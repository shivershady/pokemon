"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { pokemonApi } from "../_services/pokemon-api";
import { Pokemon } from "../_types/pokemon.types";

interface PokemonTableProps {
  initialPokemons: Pokemon[];
}

export function PokemonTable({ initialPokemons }: PokemonTableProps) {
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["pokemons"],
      queryFn: async ({ pageParam }) => {
        return pokemonApi.getPokemonBatch(pageParam, 50);
      },
      initialPageParam: 0,
      getNextPageParam: (_, pages) => {
        return pages.length * 50;
      },
      initialData: {
        pages: [initialPokemons],
        pageParams: [0],
      },
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  const pokemons = data?.pages.flat() ?? [];

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Types</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pokemons.map(pokemon => (
            <TableRow key={pokemon.id}>
              <TableCell>{pokemon.id}</TableCell>
              <TableCell className="font-medium">
                <Link
                  href={`/pokemon/${pokemon.id}`}
                  className="text-blue-500 hover:text-blue-700 capitalize"
                >
                  {pokemon.name}
                </Link>
              </TableCell>
              <TableCell>
                {pokemon.sprites.front_default && (
                  <Link href={`/pokemon/${pokemon.id}`}>
                    <Image
                      src={pokemon.sprites.front_default}
                      alt={pokemon.name}
                      width={96}
                      height={96}
                      className="hover:scale-110 transition-transform"
                    />
                  </Link>
                )}
              </TableCell>
              <TableCell>
                {pokemon.types.map(type => (
                  <span
                    key={type.type.name}
                    className="inline-block px-2 py-1 mr-1 rounded-full bg-gray-200 text-gray-800 text-sm capitalize"
                  >
                    {type.type.name}
                  </span>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div ref={ref} className="flex justify-center p-4">
        {isFetchingNextPage ? (
          <div>Loading more...</div>
        ) : hasNextPage ? (
          <div>Load more</div>
        ) : (
          <div>No more pokemons</div>
        )}
      </div>
    </div>
  );
}
