import './Game.scss';
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// Initial tag list
const initialTags = [
  { id: 'tag-1', content: '<html>' },
  { id: 'tag-2', content: '</html>' },
  { id: 'tag-3', content: '<head>' },
  { id: 'tag-4', content: '</head>' },
  { id: 'tag-5', content: '<body>' },
  { id: 'tag-6', content: '</body>' },
  { id: 'tag-7', content: '<header>' },
  { id: 'tag-8', content: 'This is the header for the website.' },
  { id: 'tag-9', content: '</header>' },
  { id: 'tag-10', content: '<section>' },
  { id: 'tag-11', content: 'This is a section about the website.' },
  { id: 'tag-12', content: '</section>' },
  { id: 'tag-13', content: '<p>' },
  { id: 'tag-14', content: 'This is a paragraph explaining the section.' },
  { id: 'tag-15', content: '</p>' },
  { id: 'tag-16', content: '<aside>' },
  { id: 'tag-17', content: 'This is an aside with extra information.' },
  { id: 'tag-18', content: '</aside>' },
  { id: 'tag-19', content: '<footer>' },
  { id: 'tag-20', content: 'This is the footer with contact info.' },
  { id: 'tag-21', content: '</footer>' },
];

// Helper function to reorder the list after drag and drop
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const GameContainer = () => {
  const [tagList, setTagList] = useState(() => {
    // Shuffle the tags only once when the component is initialized
    return [...initialTags].sort(() => Math.random() - 0.5);
  });

  // Function to handle the drag end
  const onDragEnd = (result) => {
    if (!result.destination) {
      return; // If dropped outside the list, do nothing
    }

    const newTagList = reorder(
      tagList,
      result.source.index,
      result.destination.index
    );
    setTagList(newTagList); // Update the tag list with the new order
  };

  return (
    <main className='game-container'>
      {/* Sidebar: List of Tags */}
      <section className='element-list'>
        <h2>Drag these HTML tags</h2>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='tags'>
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
        </DragDropContext>
      </section>

      {/* Code Example Section */}
      <section className='code-example'>
        <h2>View your code:</h2>
        <pre>
          <code>{tagList.map((tag) => tag.content).join('\n')}</code>
        </pre>
      </section>

      {/* Site Preview Section */}
      <section className='site-preview'>
        <h2>Check out your site!</h2>
        <div className='preview'>
          <p>/* Preview of your site will appear here */</p>
        </div>
      </section>
    </main>
  );
};

export default GameContainer;
