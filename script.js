const search = document.getElementById('search'); 
const pokemonSearchGrid = document.getElementById('pokemon-search-grid'); 
const pokemonTitle = document.getElementById('pokemon-title');
const NumberAndTypeDiv = document.getElementById('pokemon-number-type');
const aboutBtn = document.getElementById('about-btn');
const statsBtn = document.getElementById('stats-btn');
const evolutionBtn = document.getElementById('evolution-btn');
const aboutSection = document.getElementById('about');
const statsSection = document.getElementById('stats');
const evolutionSection = document.getElementById('evolution');
const speciesElement = document.getElementById('species');
const heightElement = document.getElementById('height');
const weightElement = document.getElementById('weight');
const abilitiesElement = document.getElementById('abilities');
const maleElement = document.getElementById('male');
const femaleElement = document.getElementById('female');
const eggGroupElement = document.getElementById('egg-group');
const eggCycleElement = document.getElementById('egg-cycle');
const hpElement = document.getElementById('hp');
const attackElement = document.getElementById('attack');
const defenseElement = document.getElementById('defense');
const specialAttackElement = document.getElementById('special-attack');
const specialDefenseElement = document.getElementById('special-defense');
const speedElement = document.getElementById('speed');
const totalElement = document.getElementById('total');
const evolutionGrid = document.getElementById('evolution-grid');
const body = document.getElementById('body');
const backToHome = document.getElementById('back-to-home');
const chevronLeft = document.getElementById('chevron-left');
const chevronRight = document.getElementById('chevron-right');
const searchContainer = document.getElementById('search-container');
const pokedexContainer = document.getElementById('pokedex-container');
const pokemonSvg = document.getElementById('pokemon-svg');
const captureElement = document.getElementById('capture');
const happinessElement = document.getElementById('happiness');
const baseExperienceElement = document.getElementById('base-experience');
const growthElement = document.getElementById('growth-rate');
const statBarFill = document.querySelectorAll('.stat-bar-fill');
// const backgroundImg = document.getElementById('background-image');
const apiUrl = "https://pokeapi.co/api/v2"
let currentPokemon;
let totalPokemon = 1025;
let originalBackgroundColor = "background-color: var(--red)";
let currentBackgroundColor;
const allPokemonArray = [];

const fetchAllPokemonAndCreateAllPokemonArray = async () => {
    try {
        let result = await fetch(apiUrl + `/pokemon?limit=${totalPokemon}`);
        const {results} = await result.json();

        await Promise.all(results.map(async ({ url }) => {
            const pokemon = await fetchPokemonData(url);
            const {name, id, sprites: {other: {'official-artwork': {front_default}}}} = pokemon;
            allPokemonArray.push({name, id, pokemonImg: front_default})
        }));
    } catch (error) {
        console.error(error)
    }
}

const fetchPokemonData = async (singlePokemonUrl) => {
    try {
        let results = await fetch(singlePokemonUrl);
        return  await results.json();
    } catch (error) {
        console.error(error);;
    }
}

const formatNames = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1)
    
}

const removeHyphenAndFormat = (name) => {
    let formattedName =  name.replace(/-/g,' ');
        formattedName = formatNames(formattedName)
        let formattedNameArray = [...formattedName]

        for (let i = 0; i < formattedNameArray.length; i++) {
            if (formattedName[i] === ' ') {
                formattedNameArray[i + 1] = formattedName.charAt(i+1).toUpperCase()
            }
        }
        
        formattedName = formattedNameArray.join("");
        return formattedName;
}

const formatIds = (id) => {
    let formattedId = String(id)

    while (formattedId.length < 4) {
        formattedId = '0' + formattedId
    };

    formattedId = '#' + formattedId

    return formattedId;
}

const createPokemonCard = (pokemonData) => {
    const {
        name, 
        id, 
        pokemonImg} = pokemonData;

    const formattedName = removeHyphenAndFormat(name);
    const formattedId = formatIds(id);

    const pokemonCardContainer = document.createElement('div');
    const pokemonCard = document.createElement('div');
    const pokemonImgElement = document.createElement('img');
    const pokemonName = document.createElement('p');
    const pokemonId = document.createElement('p');

    pokemonCardContainer.setAttribute('onclick', `fillPokedexAboutAndStatsData(${id})`);

    pokemonCardContainer.classList.add('pokemon-card-container');
    pokemonCard.classList.add('flex', 'pokemon-card');
    pokemonImgElement.classList.add("pokemon-card-img");
    pokemonImgElement.src = pokemonImg;
    pokemonName.classList.add('pokemon-name-card');
    pokemonId.classList.add('pokemon-number-card');

    pokemonName.innerText = formattedName;
    pokemonId.innerText = formattedId;

    pokemonCardContainer.appendChild(pokemonCard);
    pokemonCard.appendChild(pokemonImgElement);
    pokemonCard.appendChild(pokemonName);
    pokemonCard.appendChild(pokemonId); 

    return pokemonCardContainer
}


(async () => {
    await fetchAllPokemonAndCreateAllPokemonArray();
    fillSearchGrid();
})();

const fillSearchGrid = () => {
    allPokemonArray.forEach(obj => {
        const pokemonCard = createPokemonCard(obj);
        pokemonSearchGrid.appendChild(pokemonCard)
    })
}

const fetchSinglePokemonData = async(id) => {
    try {
        let result = await fetch(apiUrl + `/pokemon/${id}`);
        let pokemonData = await result.json();
        return pokemonData;
    } catch (error) {
        console.error(error);
    }
}

const fetchBreedingTrainingData = async (id) => {
    try {
        let results = await fetch (apiUrl + `/pokemon-species/${id}/`);
        results = await results.json();
        fillPokedexTrainingAndBreedingData(results);
    } catch (error) {
        console.error(error)
    }
}

const fetchEvolutionData = async (url) => {
    try {
        let results = await fetch(url);
        results = await results.json(); 
        return results
    } catch (error) {
        console.error(error)
    }
}

const convertHeightToMetric = (height) => {
    const meters = (height / 10).toFixed(2); 
    return `${meters}m`
}

const convertHeightToImperial = (height) => {
    let inches = parseFloat((height * 3.93701).toFixed(2))
    const feet = Math.floor(inches / 12);
    inches = Math.floor(inches - (feet * 12))
    return `${feet}' ${inches}''`
}

const convertWeightToImperial = (weight) => {
    const lb = parseFloat((weight * .220462).toFixed(2))
    return `${lb}lb`
};

const convertWeightToMetric = (weight) => {
    const kg = parseFloat((weight * .1).toFixed(2));
    return `${kg}kg`
};

const calculateMaxHp = (baseHp) => {
    return 2 * baseHp + 204;
}

const calculateMaxStats = (baseStat) => {
    return 2 * baseStat + 99
}

const calculateMaxStatPercentages = (baseStats) => {
    let maxStatsArray = [];
    let maxStatPercentages = []; 

    maxStatsArray.push(calculateMaxHp(baseStats[0]));
    
    for (let i = 1; i < baseStats.length; i++) {
        maxStatsArray.push(calculateMaxStats(baseStats[i]));
    }

    maxStatsArray.push(maxStatsArray.reduce((acc, cur) => acc + cur, 0));

    for (let i = 0; i < maxStatsArray.length; i++) {
        maxStatPercentages.push(Math.ceil(baseStats[i] / maxStatsArray[i] * 100));
    }

    return maxStatPercentages;
}

const fillPokedexAboutAndStatsData = async (pokemonId) => {

    let pokemonData = await fetchSinglePokemonData(pokemonId);
    // backgroundImg.classList.remove('hidden');
    searchContainer.classList.add('hidden');
    pokedexContainer.classList.remove('hidden');
    body.classList.remove(currentBackgroundColor);

    showAbout();

    const typeArray = [];
    
    NumberAndTypeDiv.innerHTML = '';
    abilitiesElement.innerHTML = '';
    
    const {
        name,
        id,
        types, 
        species: {name: speciesName}, 
        abilities, 
        height, 
        weight,
        sprites,
        base_experience,
        stats
    } = pokemonData;

    fetchBreedingTrainingData(id)

    currentPokemon = id;

    pokemonTitle.innerText = removeHyphenAndFormat(name);

    const pokemonNumber = document.createElement('p');
    pokemonNumber.classList.add("pokemon-number", "no-cursor");
    pokemonNumber.innerText = formatIds(id);
    NumberAndTypeDiv.appendChild(pokemonNumber);
    
    const {other} = sprites; 
    let pokemonImg = other["official-artwork"];
    pokemonImg = pokemonImg["front_default"];

    types.forEach(obj => {
        const {type: {name}} = obj;

        typeArray.push(name)

        const formattedType = removeHyphenAndFormat(name);

        const typeElement = document.createElement('span');
        typeElement.classList.add('type', `${name}`, 'no-cursor');
        typeElement.innerText = formattedType;

        NumberAndTypeDiv.appendChild(typeElement);
    })

    let backgroundColor = typeArray[0];
    currentBackgroundColor = typeArray[0];

    body.classList.add(backgroundColor);

    pokemonSvg.setAttribute('src', pokemonImg);

    speciesElement.innerText = removeHyphenAndFormat(speciesName);

    abilities.forEach(obj => {
        const {ability: {name}} = obj;
        let formattedAbility =  removeHyphenAndFormat(name);
        abilitiesElement.innerHTML += `${formattedAbility} <br>`
    })

    const imperialHeight = convertHeightToImperial(height);
    const metricHeight = convertHeightToMetric(height);

    heightElement.innerText = `${imperialHeight} (${metricHeight})`;

    const imperialWeight = convertWeightToImperial(weight);
    const metricWeight = convertWeightToMetric(weight);

    weightElement.innerText = `${imperialWeight} (${metricWeight})`

    baseExperienceElement.innerText = base_experience;

    let baseStatObj = {};

    stats.forEach(obj => {
        const {base_stat, stat: {name}} = obj;
        let formattedStat = removeHyphenAndFormat(name);
        formattedStat = formattedStat.replace(' ', '');
        formattedStat = formattedStat.charAt(0).toLowerCase() + formattedStat.slice(1) + 'BaseStat';
        baseStatObj[formattedStat] = base_stat;
    });

    const totalBaseStats = Object.values(baseStatObj).reduce((x, y) => x + y, 0);
    baseStatObj.totalStat = totalBaseStats;
    
    
    const maxStatPercentages = calculateMaxStatPercentages(Object.values(baseStatObj));
    
    for (let i = 0; i < statBarFill.length; i++) {
        statBarFill[i].style.width = maxStatPercentages[i] + '%'
    }

    hpElement.innerText = baseStatObj.hpBaseStat;
    attackElement.innerText = baseStatObj.attackBaseStat;
    defenseElement.innerText = baseStatObj.defenseBaseStat;
    specialAttackElement.innerText = baseStatObj.specialAttackBaseStat;
    specialDefenseElement.innerText = baseStatObj.specialDefenseBaseStat;
    speedElement.innerText = baseStatObj.speedBaseStat;
    totalElement.innerText = totalBaseStats;
}

const fillPokedexTrainingAndBreedingData = async (pokemonData) => {
    const {
        base_happiness,
        growth_rate: {name: growthRate},
        capture_rate,
        egg_groups,
        gender_rate,
        hatch_counter: eggCycle,
        evolution_chain: {url},
    } = pokemonData

    const evolutionData = await fetchEvolutionData(url);

    fillPokemonEvolutionData(evolutionData);

    captureElement.innerText = capture_rate;
    happinessElement.innerText = base_happiness;
    growthElement.innerText = removeHyphenAndFormat(growthRate);

    const femaleRate = (gender_rate / 8) * 100;
    const maleRate = 100 - femaleRate;

    maleElement.innerText = maleRate + '%';
    femaleElement.innerText = femaleRate + '%';

    let eggGroupArray = [];

    egg_groups.forEach(obj => {
        const {name} = obj;
        eggGroupArray.push(name);
    })

    let eggGroups = eggGroupArray.join('\n ')

    eggGroupElement.innerText = removeHyphenAndFormat(eggGroups);

    eggCycleElement.innerText = eggCycle + ` (${(128 * (eggCycle + 1))} - ${(257 * (eggCycle + 1))} steps)`
}

const fillPokemonEvolutionData = async (pokemonData) => {
    evolutionGrid.innerHTML = ''
    const {
        chain,
        chain: {species: {name: firstEvolution}}} = pokemonData;
        
    let allEvolutionsArray = [firstEvolution];

    let objAddress = chain.evolves_to

    while(objAddress.length > 0) {
        const nextEvolution = objAddress[0].species.name 
        allEvolutionsArray.push(nextEvolution)
        objAddress = objAddress[0].evolves_to
    }

    allPokemonArray.forEach(obj => {
        for (let i = 0; i < allEvolutionsArray.length; i++) {
            if(obj.name === allEvolutionsArray[i]) {
                const pokemonCard = createPokemonCard(obj); 
                evolutionGrid.appendChild(pokemonCard)
            }
        }
    })
}


backToHome.addEventListener('click', () => {
    body.classList.remove(currentBackgroundColor);
    // backgroundImg.classList.add('hidden');
    searchContainer.classList.remove('hidden');
    pokedexContainer.classList.add('hidden');

    setTimeout(() => {search.focus()}, 50)
})

const showAbout = () => {
    aboutSection.classList.remove('hidden');
    statsSection.classList.add('hidden');
    evolutionSection.classList.add('hidden');

    aboutBtn.classList.add('selected-nav');
    statsBtn.classList.remove('selected-nav');
    evolutionBtn.classList.remove('selected-nav');
}

const showStats = () => {
    aboutSection.classList.add('hidden');
    statsSection.classList.remove('hidden');
    evolutionSection.classList.add('hidden');

    aboutBtn.classList.remove('selected-nav');
    statsBtn.classList.add('selected-nav');
    evolutionBtn.classList.remove('selected-nav');
}

const showEvolution = () => {
    aboutSection.classList.add('hidden');
    statsSection.classList.add('hidden');
    evolutionSection.classList.remove('hidden');

    aboutBtn.classList.remove('selected-nav');
    statsBtn.classList.remove('selected-nav');
    evolutionBtn.classList.add('selected-nav');


}

chevronLeft.addEventListener('click', () => {
    if (currentPokemon <= 1) {
        return
    } else {
        fillPokedexAboutAndStatsData(currentPokemon - 1)
    }
})

chevronRight.addEventListener('click', () => {
    if (currentPokemon > totalPokemon) {
        return
    } else {
        fillPokedexAboutAndStatsData(currentPokemon + 1)
    }
})

document.addEventListener('keydown', (e) => {
    if(searchContainer.classList.contains('hidden')){
        if (e.key === 'ArrowRight') {
        if (currentPokemon > totalPokemon) {
            return
        } else {
            fillPokedexAboutAndStatsData(currentPokemon + 1)
        }
    }}
})

document.addEventListener('keydown', (e) => {
    if(searchContainer.classList.contains('hidden'))
        {if (e.key === 'ArrowLeft') {
        if (currentPokemon <= 1) {
            return
        } else {
            fillPokedexAboutAndStatsData(currentPokemon - 1)
        }
    }}
})

document.addEventListener('keydown', (e) => {
    
    if (e.key === 'Backspace') {
        body.classList.remove(currentBackgroundColor);
        // backgroundImg.classList.add('hidden');
        searchContainer.classList.remove('hidden');
        pokedexContainer.classList.add('hidden');

        setTimeout(() => {search.focus()}, 50)
    }
})

search.addEventListener('input', (e) => {
    pokemonSearchGrid.innerHTML = ''

    const namefilteredPokemonArray = allPokemonArray.filter(obj => {
        return obj.name.includes(String(search.value.toLowerCase().replace(' ','-')));
    })

    const idFilteredPokemonArray = allPokemonArray.filter(obj => {
        let stringId = formatIds(String(obj.id))
        let searchId = search.value.replace('#', '')
        return stringId.includes(String(searchId));
    })

    if (namefilteredPokemonArray.length > 0) {
        namefilteredPokemonArray.forEach(obj => {
            const pokemonCard = createPokemonCard(obj);
            pokemonSearchGrid.appendChild(pokemonCard);

            if (namefilteredPokemonArray.length < 18) {
                pokemonSearchGrid.style.height = 'fit-content'
            } else {
                pokemonSearchGrid.style.height = '75vh'
            }
        })
    }

    if (idFilteredPokemonArray.length > 0) {
        idFilteredPokemonArray.forEach(obj => {
            const pokemonCard = createPokemonCard(obj);
            pokemonSearchGrid.appendChild(pokemonCard);

            if (namefilteredPokemonArray.length < 18) {
                pokemonSearchGrid.style.height = 'fit-content'
            } else {
                pokemonSearchGrid.style.height = '75vh'
            }
        })
    }
})

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        let onClick = pokemonSearchGrid.firstElementChild.getAttribute('onclick')
        eval(onClick);
    }
})

document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {  
        if (!aboutSection.classList.contains('hidden')) {
            showStats()
            e.preventDefault()
        } else if (!statsSection.classList.contains('hidden')) {
            e.preventDefault()
            showEvolution()
        } else if (!evolutionSection.classList.contains('hidden')) {
            e.preventDefault()
            showAbout();
    }}
})