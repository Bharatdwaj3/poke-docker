import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import PokeCard from "./PokeCard";
import { Pagination, Search } from "../index";

type PokemonSprites = {
  front_default: string;
};

type Pokemon = {
  id: number;
  name: string;
  weight: number;
  sprites: PokemonSprites;
  height: number;
};

type Data = {
  name: string;
  url: string;
};

type Page = number;

const PokeDisplay = () => {
  const [data, setData] = useState<Pokemon[]>([]);
  const [page, setPage] = useState<Page>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const getPokemon = async () => {
      try {
        const limit = 24;
        const offset = (page - 1) * limit;
        let url: string;

        if (search) {
          url = `https://pokeapi.co/api/v2/pokemon?limit=10000`;
          const response = await axios.get(url);
          const resultant: Data[] = response.data.results;
          const filtered = resultant.filter((item: Data) =>
            item.name.toLowerCase().includes(search.toLowerCase())
          );
          const urls = filtered.map((item: Data) => item.url);
          const requests = urls.map((url) => axios.get(url));
          const responses = await Promise.all(requests);
          const detailedData: Pokemon[] = responses.map((res) => res.data);

          setData(detailedData);
          setTotalPages(Math.ceil(filtered.length / limit)); 
        } else {
          url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
          const response = await axios.get(url);
          const resultant: Data[] = response.data.results;
          const urls = resultant.map((item: Data) => item.url);
          const requests = urls.map((url) => axios.get(url));
          const responses = await Promise.all(requests);
          const detailedData: Pokemon[] = responses.map((res) => res.data);
          setData(detailedData);
          setTotalPages(Math.ceil(response.data.count / limit)); 
        }
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
        setData([]);
      }
    };

    getPokemon();
  }, [page, search]);

  return (
    <>
      <div className="py-56">
        <Search setSearch={setSearch} />
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="row">
                <PokeCard data={data} pages="/"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          height: "190px",
          background: "linear-gradient(to bottom, white, black)",
        }}
        className="w-100 d-flex align-items-center justify-content-center"
      >
        <Pagination totalPages={totalPages} page={page} setPage={setPage} />
      </div>
    </>
  );
};

export default PokeDisplay;
