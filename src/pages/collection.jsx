import { useParams } from "react-router-dom"
import { keys } from "lodash-es"
import { useListCollectedCard, useSetQuery } from "../../store/collection"
import { Card } from "../components/Card"


export function CollectionPage() {
    const { code } = useParams()

    const setQuery = useSetQuery(code)
    const collection = useListCollectedCard(code)

    if (!setQuery.isSuccess || !collection.isSuccess) {
        return (
            <div className="p-2">
                <span className="loading loading-ring loading-xl"></span>
            </div>
        )
    }

    return (
        <div className='flex flex-col'>
            <div className="flex flex-col md:flex-row md:flex-wrap items-center justify-evenly">
                {setQuery.data.map(c => (
                    <PrintedCard key={c.uuid} collection={collection.data} card={c} />
                ))}
            </div>
        </div>
    )
}

function PrintedCard({ collection, card }) {
    const hasCard = card.uuid in collection
    const printedCard = hasCard ? collection[card.uuid] : {}
    const foilCount = printedCard.foilCount ?? 0
    const nonFoilCount = printedCard.nonFoilCount ?? 0

    return (
        <Card isFoil={nonFoilCount === 0 && foilCount > 0} card={card} interactive={hasCard} withDisplay={hasCard} foilIndicator={foilCount} nonFoilIndicator={nonFoilCount} />
    )
}
