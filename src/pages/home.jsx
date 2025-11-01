import { Link } from 'react-router-dom'
import { Booster } from '../components/Booster.jsx'
import { CollectionButton } from '../components/CollectionButton.jsx'
import { SET_ORDER, SETS } from '../sets.js'
import { isMobile } from '../lib/mobile.js'

export function HomePage() {
    const sets = isMobile() ? SET_ORDER.slice(0, 10) : SET_ORDER
    return (
        <div className="pb-12 pt-4 md:px-4 max-w-screen overflow-hidden flex flex-col items-center sm:flex-row flex-wrap gap-12 justify-evenly">
            {sets.map(set => (
                <div key={set} className="flex flex-col items-center">
                    <Booster set={SETS[set]} />
                    <Link to={`/collection/${set}`}>
                        <CollectionButton set={SETS[set]} />
                    </Link>
                </div>
            ))}
        </div>
    )
}
