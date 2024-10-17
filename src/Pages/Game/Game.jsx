import './Game.scss';
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const initialTags = [
  { id: 'tag-1', content: '<html>', level: 0 },
  { id: 'tag-2', content: '<body>', level: 1 },
  { id: 'tag-3', content: '<header>', level: 2 },
  { id: 'tag-4', content: 'I am a header! I am usually at the top.', level: 3 },
  { id: 'tag-5', content: '</header>', level: 2 },
  { id: 'tag-6', content: '<main>', level: 2 },
  { id: 'tag-7', content: 'I contain the main content of the page.', level: 3 },
  { id: 'tag-8', content: '<section>', level: 3 },
  { id: 'tag-9', content: 'I am a section inside the main element.', level: 4 },
  { id: 'tag-10', content: '<p>', level: 4 },
  {
    id: 'tag-11',
    content: 'I am a paragraph inside a section.',
    level: 5,
  },
  { id: 'tag-12', content: '</p>', level: 4 },
  { id: 'tag-13', content: '</section>', level: 3 },
  { id: 'tag-14', content: '</main>', level: 2 },
  { id: 'tag-15', content: '<footer>', level: 2 },
  {
    id: 'tag-16',
    content: 'I am a footer! I am usually at the bottom.',
    level: 3,
  },
  { id: 'tag-17', content: '</footer>', level: 2 },
  { id: 'tag-18', content: '</body>', level: 1 },
  { id: 'tag-19', content: '</html>', level: 0 },
];

const GameContainer = () => {
  const [tagList, setTagList] = useState(initialTags);

  // Handle drag end without allowing sorting in the first column
  const onDragEnd = (result) => {
    const { destination } = result;

    // If no destination or dropped back into the same column, don't do anything
    if (!destination || destination.droppableId === 'tags') {
      return;
    }

    // The rest of the code will handle dragging into drop zones in the second step
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className='game-container'>
        {/* Sidebar: List of Tags - Draggable but not sortable */}
        <h2 className='tags-message'>Drag these HTML tags</h2>
        <section className='element-list'>
          <Droppable droppableId='tags' isDropDisabled={true}>
            {(provided) => (
              <ul
                className='button-container'
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {tagList.map((tag, index) => (
                  <Draggable key={tag.id} draggableId={tag.id} index={index}>
                    {(provided, snapshot) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`tag tag-${index + 1} ${
                          snapshot.isDragging ? 'dragging' : ''
                        }`}
                        style={{
                          ...provided.draggableProps.style,
                          background: snapshot.isDragging ? '#e0e0e0' : '',
                          boxShadow: snapshot.isDragging
                            ? '0 2px 8px rgba(0, 0, 0, 0.2)'
                            : '',
                        }}
                      >
                        <code>{tag.content}</code>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </section>
      </div>
    </DragDropContext>
  );
};

export default GameContainer;
