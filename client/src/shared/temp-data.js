const tempData = {
    events: {
        'event-1': { id: 'event-1', time: '10:00 am', content: 'Cafe Moulin' },
        'event-2': { id: 'event-2', time: '1:00 pm', content: 'Andy Warhol Museum' },
        'event-3': { id: 'event-3', time: '3:00 pm', content: 'Duquesne Incline' },
        'event-4': { id: 'event-4', time: '5:00 pm', content: 'Dinner @Melting Pot'},
        'event-5': { id: 'event-5', time: '8:00 pm', content: 'Phipps Conservatory and Botanical Garden'}
    },
    columns: {
        'column-1': {
            id: 'column-1',
            title: '12/04/2022',
            eventIds: ['event-1', 'event-2', 'event-3', 'event-4', 'event-5']
        }
    },
    columnOrder: ['column-1'],
};

export default tempData;