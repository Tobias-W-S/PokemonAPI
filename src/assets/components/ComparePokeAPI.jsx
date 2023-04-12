import { useState, useEffect } from 'react';
import './PokeAPI.css'

const ComparePokeAPI = () => {
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
                abilities: data.abilities.map((ability) => ability.ability.name ),

                species: data.species.url,
            }))
        );

        setPokemonSpeciesList(
            pokemonSpecies.map((data) =>({
                flavortext: data.flavor_text_entries.find(entry => entry.language.name === "en").flavor_text,
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
            <div className='flex justify-center items-center'>
                {
                    pokemonList.map((pokemon) => (
                    pokemonSpeciesList.map((species) =>(
                        <div key={pokemon.id} className={`flex rounded-2xl w-10/12 ${pokemon.types.map((type) => `${type}-type`).join(" ")}`}>
                        <div className="w-1/5 flex flex-col justify-center items-center p-5 gap-3">
                            <h2 className='text-2xl font-medium flex justify-center px-2 py-0.5 rounded-2xl bg-black/[0.4] text-gray-300'>{pokemon.id}. {pokemon.name}</h2>  
                            <img src={pokemon.sprite} className="w-full bg-neutral-50/[.6] rounded-full"/> 
                            <div className='flex justify-center items center gap-2'>
                                {pokemon.types.map((type) =>(
                                    <div className='flex justify-center px-2 py-0.5 rounded-2xl bg-neutral-50/50'>{type}</div>
                                ))}
                            </div>
                        </div>
                        <div className='flex flex-row items-center justify-center gap-3'>   
                            <div className="flex justify-center">
                                {species.flavortext.replace(new RegExp('\f', 'g'), ' ')}
                            </div>
                            <div className='flex flex-col gap-3'>
                                <div className="flex justify-center px-2 py-1 rounded-2xl bg-neutral-50/50">
                                    Base experience: {pokemon.exp} xp
                                </div>
                                <div className='flex justify-center px-2 py-1 rounded-2xl bg-neutral-50/50'>
                                    Weight: {pokemon.weight} hg
                                </div>
                                <div className="flex justify-center px-2 py-1 rounded-2xl bg-neutral-50/50">
                                    Height: {pokemon.height} dm
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 flex justify-center p-3 rounded-2xl bg-neutral-50/50">
                                Abilities: 
                                {pokemon.abilities.map((ability) =>(
                                    <div>{ability}</div>
                                ))}
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

export default ComparePokeAPI;