import { useState, useEffect } from 'react';
import './PokeAPI.css'
import PokeHealthBar from '../HP.svg'

const SinglePokeAPI = () => {
    const link = window.location.href;
    let linkID = link.split('/');
    //console.log(linkID.slice(-1));

    const [pokemonList, setPokemonList] = useState([]);
    const [pokemonSpeciesList, setPokemonSpeciesList] = useState([]);
    const [pokemonOffset, setPokemonOffset] = useState(linkID.slice(-1) - 1);



    const fetchApi = async () => { 

        const fetchLink = async (link) =>{
            const response = await fetch(link);
            const data = await response.json();

            const pokeResults = await Promise.all(data.results.map(async (result) => {
                const res = await fetch(result.url);
                return res.json();
            }));
            return pokeResults
        }

        const pokemonItems = await fetchLink(`https://pokeapi.co/api/v2/pokemon?limit=1&offset=${pokemonOffset}%27`)
        const pokemonSpecies = await fetchLink(`https://pokeapi.co/api/v2/pokemon-species?limit=1&offset=${pokemonOffset}%27`);

        setPokemonList(
            pokemonItems.map((data) => ({
                id: data.id,
                name: data.name,
                sprite: data.sprites.front_default,
                altsprite: data.sprites.front_shiny,
                types: data.types.map((type) => type.type.name),
                weight: data.weight,
                height: data.height,
                exp: data.base_experience,

                health: data.stats.find(stat => stat.stat.name === 'hp').base_stat,

                abilities: data.abilities.map((ability => ability.ability.name)),
                species: data.species.url,
            }))
        );

        setPokemonSpeciesList(
            pokemonSpecies.map((data) =>({
                flavortext: data.flavor_text_entries.find(entry => entry.language.name === "en").flavor_text,
                evolves: data.evolves_from_species ? [data.evolves_from_species.name] : [],
            }))
        )
    }

    useEffect(() => {
        fetchApi();
    }, [pokemonOffset]);

    const setOffset = (amount) =>{
        if (pokemonOffset < 1 && amount < 0){
            setPokemonOffset(0)
        } else {
            setPokemonOffset(pokemonOffset + amount)
        }
    }

    return(
        <>
            <div className="flex justify-center items-center gap-3 w-full h-16">
                <button type='button' className="h-8 w-32 bg-neutral-50/[0.3] rounded-2xl px-3 text-gray-300" onClick={() =>  setOffset(-1)}>
                    Go back
                </button>
                <button type='button' className="h-8 w-32 bg-neutral-50/[0.3] rounded-2xl px-3 text-gray-300" onClick={() => window.location.href='/.'}>
                    Home
                </button>
                <button type='button' className="h-8 w-32 bg-neutral-50/[0.3] rounded-2xl px-3 text-gray-300" onClick={() =>  setOffset(1)}>
                    Go forward
                </button>
            </div>
            <div className="flex justify-center items-center">
                {
                    pokemonList.map((pokemon) => (
                    pokemonSpeciesList.map((species) =>(
                        <div key={pokemon.id} className={`flex px-4 rounded-2xl w-10/12 gap-3 ${pokemon.types.map((type) => `${type}-type`).join(" ")}`}>
                        <div className="w-1/5 flex flex-col justify-center items-center p-5 gap-3">
                            <div className="flex items-center justify-center font-pixel w-64 h-16 bg-contain bg-[url('/src/assets/Name.svg')]">{pokemon.id}. {pokemon.name}</div>  
                            <img src={pokemon.sprite} className="w-full bg-contain bg-[url('/src/assets/ImageTransparent.svg')]"/> 
                            <div className="flex items-center justify-end font-pixel pr-12 w-48 h-16 bg-contain bg-[url('/src/assets/HP.svg')]">
                                {pokemon.health}
                            </div>
                            <div className="flex justify-center items center gap-2">
                                {pokemon.types.map((type) =>(
                                    <div className="flex w-32 h-8 justify-center items-center font-pixel bg-contain bg-[url('/src/assets/Name.svg')]">{type}</div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-row items-center gap-3 w-2/4">   
                            <div className="flex justify-center w-fit px-2 py-1 rounded-2xl bg-neutral-50/50">
                                {species.flavortext.replace(new RegExp('\f', 'g'), ' ').replace(new RegExp('POKéMON', 'g'), 'Pokemon')}
                            </div>
                            <div className="flex flex-col gap-3 w-5/6">
                                <div className="flex justify-center px-2 py-1 rounded-2xl bg-neutral-50/50">
                                    Base experience: {pokemon.exp} xp
                                </div>
                                <div className="flex justify-center px-2 py-1 rounded-2xl bg-neutral-50/50">
                                    Weight: {pokemon.weight} hg
                                </div>
                                <div className="flex justify-center px-2 py-1 rounded-2xl bg-neutral-50/50">
                                    Height: {pokemon.height} dm
                                </div>
                                {species.evolves != "" ?                             
                                <div className="flex justify-center px-2 py-1 rounded-2xl bg-neutral-50/50">
                                    Evolves from: {species.evolves}
                                </div> 
                                : ''}
                            </div>
                            <div className="flex gap-3 flex-col w-3/5">
                                <div className="flex justify-center px-2 py-1 rounded-2xl bg-black/[0.4] text-gray-300">Abilities</div>
                                {pokemon.abilities.map((ability) => 
                                    <div className="flex justify-center px-2 py-1 rounded-2xl bg-neutral-50/50">{ability}</div>
                                )}
                            </div>
                        </div>
                    </div>
                    ))
                    ))
                }                               
            </div>
        </>
    )
}

export default SinglePokeAPI;