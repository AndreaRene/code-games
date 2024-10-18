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

const correctOrder = [
  'tag-1', // <html>
  'tag-2', // <body>
  'tag-3', // <header>
  'tag-4', // I am a header! I am usually at the top.
  'tag-5', // </header>
  'tag-6', // <main>
  'tag-7', // I contain the main content of the page.
  'tag-8', // <section>
  'tag-9', // I am a section inside the main element.
  'tag-10', // <p>
  'tag-11', // I am a paragraph inside a section.
  'tag-12', // </p>
  'tag-13', // </section>
  'tag-14', // </main>
  'tag-15', // <footer>
  'tag-16', // I am a footer! I am usually at the bottom.
  'tag-17', // </footer>
  'tag-18', // </body>
  'tag-19', // </html>
];

const shuffleArray = (array) => {
  const shuffled = [...array]; // Create a copy of the array
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const initialDropZones = Array(initialTags.length).fill(null);

const GameContainer = () => {
  const [tagList, setTagList] = useState(() => shuffleArray(initialTags));
  const [dropZones, setDropZones] = useState(initialDropZones);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // Check if dropped outside the drop zone
    if (!destination || destination.droppableId === 'tags') {
      return;
    }

    // Get the index of the drop zone
    const dropZoneIndex = parseInt(destination.droppableId.split('-')[1]);

    // Get the tag that was dragged
    const draggedTag = tagList[source.index];

    // Create a new copy of drop zones
    const newDropZones = [...dropZones];

    // Check if the dragged tag is the correct one for this zone
    const isCorrect = draggedTag.id === correctOrder[dropZoneIndex];

    // Set the tag into the drop zone and include isCorrect status
    newDropZones[dropZoneIndex] = { ...draggedTag, isCorrect };

    // Update drop zones
    setDropZones(newDropZones);

    // Optionally: Remove the tag from the list of draggable tags if you want it to disappear from the left column
    const newTagList = [...tagList];
    newTagList.splice(source.index, 1);
    setTagList(newTagList);
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
        <section className='drop-zone-list'>
          {dropZones.map((zone, index) => (
            <Droppable
              key={index}
              droppableId={`drop-${index}`}
              isDropDisabled={!!zone} // Disable drop if a tag is already in this zone
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`drop-zone ${zone ? (zone.isCorrect ? 'correct' : 'incorrect') : ''}`}
                >
                  {zone ? <code>{zone.content}</code> : ''}{' '}
                  {/* Display tag content if the zone is occupied */}
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
