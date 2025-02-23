import { useState, useEffect } from "react";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [allPokemons, setAllPokemons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [limit, setLimit] = useState(20);
  const [loadTriggered, setLoadTriggered] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=20`)
      .then((res) => res.json())
      .then((data) => {
        const pokemonDetails = data.results.map((pokemon) =>
          fetch(pokemon.url).then((res) => res.json())
        );

        Promise.all(pokemonDetails).then((results) => {
          setPokemons(results);
          setAllPokemons(results);
          extractTypes(results);
          setLoading(false);
        });
      });
  }, []);

  const handleLoadPokemon = () => {
    if (limit < 1 || limit > 10279) {
      alert("กรุณากรอกจำนวนระหว่าง 1 - 10279");
      return;
    }

    setLoading(true);
    setLoadTriggered(true);
    fetch(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=${limit}`)
      .then((res) => res.json())
      .then((data) => {
        const pokemonDetails = data.results.map((pokemon) =>
          fetch(pokemon.url).then((res) => res.json())
        );

        Promise.all(pokemonDetails).then((results) => {
          setAllPokemons(results);
          applyFilters(results);
          setLoading(false);
        });
      });
  };

  const extractTypes = (pokemons) => {
    const allTypes = new Set();
    pokemons.forEach((pokemon) =>
      pokemon.types.forEach((t) => allTypes.add(t.type.name))
    );
    setTypes([...allTypes]);
  };

  const applyFilters = (data) => {
    let filtered = data;

    if (search) {
      filtered = filtered.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter((pokemon) =>
        pokemon.types.some((t) => t.type.name === selectedType)
      );
    }

    setPokemons(filtered);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleTypeFilter = (event) => {
    setSelectedType(event.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">
        Pokemon API
      </h1>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search Pokemon..."
          value={search}
          onChange={handleSearch}
          className="px-4 py-2 border rounded-md shadow-md focus:outline-none"
        />

        <select
          value={selectedType}
          onChange={handleTypeFilter}
          className="px-4 py-2 border rounded-md shadow-md focus:outline-none"
        >
          <option value="">All Types</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type.toUpperCase()}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          min="1"
          max="10279"
          className=" py-2 border rounded-md shadow-md focus:outline-none text-center"
        />

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded shadow"
          onClick={handleLoadPokemon}
        >
          Submit
        </button>
      </div>

      {loading && <p className="text-center mt-4">Loading...</p>}

      {!loading && pokemons.length === 0 && (
        <p className="text-center text-lg font-bold text-gray-500">
          There are no matching Pokemon
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {pokemons.map((pokemon) => (
          <div
            key={pokemon.id}
            className="bg-white p-4 rounded-lg shadow-md flex items-center"
          >
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              className="w-20 h-20"
            />
            <div className="ml-4">
              <h2 className="text-lg font-bold">
                {pokemon.name.toUpperCase()}
              </h2>
              <p>Type: {pokemon.types.map((t) => t.type.name).join(", ")}</p>
              <p>Base Stats:</p>
              <ul className="list-disc ml-5">
                {pokemon.stats.map((stat) => (
                  <li key={stat.stat.name}>
                    {stat.stat.name}: {stat.base_stat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
