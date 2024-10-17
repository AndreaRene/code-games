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

const initialDropZones = Array(initialTags.length).fill(null);

const GameContainer = () => {
  const [tagList, setTagList] = useState(initialTags);
  const [dropZones, setDropZones] = useState(initialDropZones);

  const onDragEnd = (result) => {
    const { destination } = result;

    if (!destination || destination.droppableId === 'tags') {
      return;
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className='game-container'>
        {/* First column: Draggable tags */}
        <h2 className='tags-message'>Drag these HTML tags</h2>
        <section className='element-list'>
          <Droppable droppableId='tags' isDropDisabled={true}>
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {tagList.map((tag, index) => (
                  <Draggable key={tag.id} draggableId={tag.id} index={index}>
                    {(provided, snapshot) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`tag ${snapshot.isDragging ? 'dragging' : ''}`}
                        style={{
                          ...provided.draggableProps.style,
                          background: snapshot.isDragging ? '#e0e0e0' : '',
                          padding: '8px',
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

        {/* Second column: Drop zones */}
        <h2 className='drop-message'>Drop the tags here</h2>
        <section className='drop-zone-list'>
          {dropZones.map((zone, index) => (
            <Droppable key={index} droppableId={`drop-${index}`}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className='drop-zone'
                >
                  {zone ? <code>{zone.content}</code> : 'Drop here'}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </section>

        {/* Third column: Code Preview */}
        <h2 className='code-message'>Your code preview</h2>
        <section className='code-example'>
          {/* <pre>
            <code>{formatCodeWithIndentation(tagList)}</code>
          </pre> */}
        </section>
      </div>
    </DragDropContext>
  );
};

export default GameContainer;
