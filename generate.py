from pprint import pprint
from functools import reduce
import json
import duckdb

with open('source.json') as f:
    SETS = json.load(f)

duckdb.execute("create table scryfall_cards as select * from read_json('scryfall/default-cards.json', union_by_name=True)")
duckdb.execute("attach 'mtgjson/AllPrintings.sqlite' as mtgjson (type sqlite)")

stats = {}

def generate_set_cards(set):

	print(f"Generating {set}...")

	duckdb.execute("""

	create or replace table set_data as with

	set_cards as (
		select *
		from mtgjson.cards
		where
			(side is null or side = 'a')
			and language = 'English'
			--and not number glob '*[^0-9]*'
			and regexp_matches(number, '^[0-9]*$')
			and length(setCode) = 3
			and setCode = ($1)
	),

	booster_weighted_cards as (
		select sbsc.cardUuid, max(cardWeight) as cardWeight
		from mtgjson.setBoosterSheetCards sbsc
		where sbsc.setCode = $1
		group by sbsc.cardUuid
	),

	set_card_weighted as (
		select
			sc.*,
			coalesce(cardWeight, 0) as boosterWeight,
			cast(number as int) as number_int
		from set_cards sc
		left join booster_weighted_cards bwc on bwc.cardUuid = sc.uuid
	),

	curated_cards as (
		select
			setCode,
			number,
			number_int,
			name,
			rarity,
			boosterWeight,
			hasFoil,
			hasNonFoil,
			case
				when supertypes = 'Basic' and types = 'Land' then 'land'
				when rarity in ('common', 'uncommon', 'rare', 'mythic') then rarity
				else 'wildcard'
			end as slot,
			uuid,
			ci.scryfallId
		from set_card_weighted sc
		left join mtgjson.cardIdentifiers ci using (uuid)
	),

	enriched_curated_cards as (
		select
			*,
			sum(boosterWeight) over (partition by setCode, slot order by number_int rows unbounded preceding) as boosterCumWeight
		from curated_cards
	)

	select
		ecc.setCode,
		ecc.uuid,
		ecc.number_int as number,
		ecc.name,
		ecc.rarity,
		ecc.boosterWeight,
		ecc.boosterCumWeight,
		ecc.hasFoil,
		ecc.hasNonFoil,
		ecc.slot,
		'https://cards.scryfall.io/normal/front/' || left(ecc.scryfallId, 1) || '/' || right(left(ecc.scryfallId, 2), 1) || '/' || ecc.scryfallId || '.jpg' as frontImageUrl
	from enriched_curated_cards ecc
	left join scryfall_cards sc on ecc.scryfallId = sc.id
	order by setCode, number_int

	""", [set])

	duckdb.execute("copy set_data to ('public/codegen/' || $1 || '.json') (format json, array true)", [set if set != 'CON' else 'CON_file'])

	(count,) = duckdb.execute("select count(*) as count from set_data").fetchall()[0]

	stats[set] = count

for s in SETS:
	generate_set_cards(s)

infos = duckdb.execute("""
	select
		code, name, releaseDate
	from mtgjson.sets
	where code in $1
""", [SETS]).fetchall()

def one(acc, info):
	(code, name, releaseDate) = info
	acc[code] = {
		"code": code,
		"name": name,
		"releasedDate": releaseDate,
		"cardCount": stats.get(code, 0),
        "cards": f"/codegen/{code if code != 'CON' else 'CON_file'}.json",
        "keyrune": f"ss-{code.lower()}",
	}
	return acc

sets = reduce(one, infos, {})

with open('src/sets.json', 'w') as fp:
    json.dump(sets, fp)
