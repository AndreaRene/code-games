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
  { id: 'tag-11', content: 'I am a paragraph inside a section.', level: 5 },
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
  'tag-1',
  'tag-2',
  'tag-3',
  'tag-4',
  'tag-5',
  'tag-6',
  'tag-7',
  'tag-8',
  'tag-9',
  'tag-10',
  'tag-11',
  'tag-12',
  'tag-13',
  'tag-14',
  'tag-15',
  'tag-16',
  'tag-17',
  'tag-18',
  'tag-19',
];

const shuffleArray = (array) => {
  const shuffled = [...array];
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
  const [correctTags, setCorrectTags] = useState([]);

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

    if (isCorrect) {
      // Set the tag into the drop zone and lock the zone
      newDropZones[dropZoneIndex] = { ...draggedTag, isCorrect };

      // Remove the tag from the list of draggable tags (left column)
      const newTagList = [...tagList];
      newTagList.splice(source.index, 1);
      setTagList(newTagList);

      // Update drop zones
      setDropZones(newDropZones);

      // Add to correct tags
      setCorrectTags((prev) => [...prev, draggedTag]);
    } else {
      // Temporarily show the red border for the incorrect drop
      setDropZones((prevZones) => {
        const tempZones = [...prevZones];
        tempZones[dropZoneIndex] = { ...draggedTag, isCorrect: false };
        return tempZones;
      });

      // Slide back the incorrect tag after a short delay
      setTimeout(() => {
        setDropZones((prevZones) => {
          const resetZones = [...prevZones];
          resetZones[dropZoneIndex] = null;
          return resetZones;
        });
      }, 800);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className='game-container'>
        {/* First column: Draggable tags */}
        <h2 className='tags-message'>Drag the HTML tags and content</h2>
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
                          gridRow: index + 1,
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
        <h2 className='drop-message'>Drop them here in the correct order </h2>
        <section className='drop-zone-list'>
          {dropZones.map((zone, index) => (
            <Droppable
              key={index}
              droppableId={`drop-${index}`}
              isDropDisabled={!!zone && zone.isCorrect}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`drop-zone ${zone ? (zone.isCorrect ? 'correct' : 'incorrect') : ''}`}
                >
                  {zone ? <code>{zone.content}</code> : ''}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </section>

        {/* Third column: Code Preview */}
        <h2 className='code-message'>View your code as you go</h2>
        <section className='code-example'>
          <div className='code-preview'>
            <div className='line-numbers'>
              {Array.from({ length: 30 }, (_, i) => (
                <span key={i + 1}>{i + 1}</span>
              ))}
            </div>
            <div className='code-lines'>
              <pre>Your code here</pre>
            </div>
          </div>
        </section>
        <h2 className='progress-message'>Track your progress</h2>
        <section className='progress-area'></section>
      </div>
    </DragDropContext>
  );
};

export default GameContainer;
