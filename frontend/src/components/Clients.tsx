import {Link} from 'react-router-dom'
import type {Client as ClientType} from '@/api/clients'

interface Properties {
	client: ClientType
}

export function Client({client: client}: Properties) {


	return (
		<Link
			className='select-none rounded-lg shadow-lg focus:outline-3 focus:outline-gray-500 dark:shadow-2xl'
			to={client.id.toString()}
		>
			<h3 className='p-6 font-bold text-xl'>{client.name}</h3>
		</Link>
	)
}
