import { useState, useEffect } from 'react';
import './PokeAPI.css'

const PokeAPI = () => {
    const link = window.location.href;
    let prePokemonOffset = 1;

    let linkFullID = link.split('/');
    let linkID = linkFullID.slice(-1);

    if (Number.isInteger(parseInt(linkID))){
        prePokemonOffset = parseInt(linkID);
    }
    if (prePokemonOffset < 1){
        prePokemonOffset = 1;
    }


    const [pokemonList, setPokemonList] = useState([]);
    const [pokemonOffset, setPokemonOffset] = useState(prePokemonOffset - 1);
    const [pokemonShiny, setPokemonShiny] = useState(false);

    const fetchApi = async () => { 
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=30&offset=${pokemonOffset}%27`);
        const data = await response.json();

        const pokemonItems = await Promise.all(data.results.map(async (result) => {
            const res = await fetch(result.url);
            return res.json();
        }));

        setPokemonList(
            pokemonItems.map((data) => ({
                id: data.id,
                name: data.name,
                sprite: data.sprites.front_default,
                altsprite: data.sprites.front_shiny,
                types: data.types.map((type) => type.type.name),
            }))
        );
    }

    useEffect(() => {
        fetchApi();
    }, [pokemonOffset]);

    const setOffset = (amount) =>{
        if (pokemonOffset < 30 && amount < 0){
            setPokemonOffset(0)
        } else {
            setPokemonOffset(pokemonOffset + amount)
        }
    }

    const searchId = () =>{
        if(event.key === 'Enter'){
            window.location.href = event.target.value;
        }
    }

    return(
        <>
            <div className="flex justify-center items-center gap-3 w-full h-16">
                <button type='button' className="h-8 w-32 bg-neutral-50/[0.3] rounded-2xl px-3 text-gray-300" onClick={() =>  setOffset(-30)}>
                    Go back
                </button>
                <input placeholder='ID' max="1781" type="number" className="searchId w-20 p-0.5 rounded-2xl border-solid border-transparent focus:border-cyan-500 border-4 outline-none" onKeyDown={() => searchId()}/>
                <button type='button' className="h-8 w-24 bg-neutral-50/[0.3] rounded-2xl px-3 text-gray-300" onClick={() =>  setPokemonShiny(!pokemonShiny)}>
                    Shiny
                </button>
                <button type='button' className="h-8 w-32 bg-neutral-50/[0.3] rounded-2xl px-3 text-gray-300" onClick={() =>  setOffset(30)}>
                    Go forward
                </button>
            </div>
            <div className='justify-center items-stretch items-center flex flex-row flex-wrap gap-2 m-2'>
                {
                    pokemonList.map((pokemon) => (
                        <div key={pokemon.id} className={`w-1/6 h-32 flex items-center rounded-lg ${pokemon.types.map((type) => `${type}-type`).join(" ")}`} onClick={() => (window.location.href = `/pokemon/${pokemon.id}`)}>
                            <div className="h-full w-full">
                                <img src={pokemonShiny ? pokemon.altsprite : pokemon.sprite} className="h-full bg-neutral-50/[.6] rounded-full"/>
                            </div>
                            <div className='flex flex-col items-center gap-3 w-full'>
                                <h2 className='text-lg font-medium flex justify-center w-full'>{pokemon.id}. {pokemon.name}</h2>                                 
                                <div className='flex gap-1'>
                                    {pokemon.types.map((type) =>(
                                        <div className='flex justify-center px-2 py-0.5 rounded-2xl bg-neutral-50/50'>{type}</div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default PokeAPI;
