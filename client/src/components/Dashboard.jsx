import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const initialData = {
    todo: {
        name: "To Do",
        items: [
            { id: "1", title: "Design UI" },
            { id: "2", title: "Setup Backend" }
        ]
    },
    progress: {
        name: "In Progress",
        items: [{ id: "3", title: "API Integration" }]
    },
    done: {
        name: "Done",
        items: [{ id: "4", title: "Project Setup" }]
    }
};

export default function KanbanBoard() {
    const [columns, setColumns] = useState(initialData);

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            const sourceCol = columns[source.droppableId];
            const destCol = columns[destination.droppableId];
            const sourceItems = [...sourceCol.items];
            const destItems = [...destCol.items];
            const [removed] = sourceItems.splice(source.index, 1);

            destItems.splice(destination.index, 0, removed);

            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceCol,
                    items: sourceItems
                },
                [destination.droppableId]: {
                    ...destCol,
                    items: destItems
                }
            });
        } else {
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);

            copiedItems.splice(destination.index, 0, removed);

            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...column,
                    items: copiedItems
                }
            });
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div style={{ display: "flex", gap: "20px" }}>
                {Object.entries(columns).map(([id, column]) => (
                    <Droppable droppableId={id} key={id}>
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                style={{
                                    background: "#f4f5f7",
                                    padding: 10,
                                    width: 250,
                                    minHeight: 400
                                }}
                            >
                                <h3>{column.name}</h3>

                                {column.items.map((item, index) => (
                                    <Draggable
                                        key={item.id}
                                        draggableId={item.id}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={{
                                                    padding: 10,
                                                    margin: "8px 0",
                                                    background: "white",
                                                    borderRadius: 4,
                                                    ...provided.draggableProps.style
                                                }}
                                            >
                                                {item.title}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}

                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext>
    );
}
