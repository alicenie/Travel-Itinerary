const tempData = {
  events: {
    "event-1": { id: "event-1", duration: "1 hour", content: "Cafe Moulin" },
    "event-2": {
      id: "event-2",
      duration: "2 hours",
      content: "Andy Warhol Museum",
    },
    "event-3": {
      id: "event-3",
      duration: "1 hour",
      content: "Duquesne Incline",
    },
    "event-4": {
      id: "event-4",
      duration: "3 hours",
      content: "Dinner @Melting Pot",
    },
    "event-5": {
      id: "event-5",
      duration: "2 hours",
      content: "Phipps Conservatory and Botanical Garden",
    },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "12/04/2022",
      eventIds: ["event-1", "event-2", "event-3", "event-4", "event-5"],
    },
  },
  columnOrder: ["column-1"],
};

export default tempData;
