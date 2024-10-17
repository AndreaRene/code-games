import './Game.scss';
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const initialTags = [
  { id: 'tag-1', content: '<html>', level: 0 },
  { id: 'tag-2', content: '<body>', level: 1 },
  { id: 'tag-3', content: '<header>', level: 2 },
  { id: 'tag-4', content: 'This is the header for the website.', level: 3 },
  { id: 'tag-5', content: '</header>', level: 2 },
  { id: 'tag-6', content: '<main>', level: 2 },
  { id: 'tag-7', content: 'This is the main content of the page.', level: 3 },
  { id: 'tag-8', content: '<section>', level: 3 },
  { id: 'tag-9', content: 'This is a section about the website.', level: 4 },
  { id: 'tag-10', content: '<p>', level: 4 },
  {
    id: 'tag-11',
    content: 'This is a paragraph explaining the section.',
    level: 5,
  },
  { id: 'tag-12', content: '</p>', level: 4 },
  { id: 'tag-13', content: '</section>', level: 3 },
  { id: 'tag-14', content: '</main>', level: 2 },
  { id: 'tag-15', content: '<footer>', level: 2 },
  { id: 'tag-16', content: 'This is the footer with contact info.', level: 3 },
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

const isCorrectOrder = (currentTagList) => {
  for (let i = 0; i < currentTagList.length; i++) {
    if (currentTagList[i].id !== correctOrder[i]) {
      return false;
    }
  }
  return true;
};

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const formatCodeWithIndentation = (tagList) => {
  return tagList
    .map((tag, index) => {
      if (tag.id === correctOrder[index]) {
        return '  '.repeat(tag.level) + tag.content;
      } else {
        return `/* Incorrect order: "${tag.content}" */`;
      }
    })
    .join('\n');
};

const GameContainer = () => {
  const [tagList, setTagList] = useState(() => {
    return [...initialTags].sort(() => Math.random() - 0.5);
  });

  // Function to handle the drag end
  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const newTagList = reorder(
      tagList,
      result.source.index,
      result.destination.index
    );
    setTagList(newTagList);
  };

  return (
    <main className='game-container'>
      {/* Sidebar: List of Tags */}
      <h2 className='tags-message'>Drag these HTML tags</h2>
      <section className='element-list'>
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
      <h2 className='code-message'>View your code:</h2>
      <section className='code-example'>
        <pre>
          <code>{formatCodeWithIndentation(tagList)}</code>
        </pre>
      </section>

      {/* Site Preview Section */}
      <h2 className='site-message'>Check out your site!</h2>
      <section className='site-preview'>
        <div className='preview'>
          {tagList.map((tag, index) => {
            // Check if the current tag is in the correct position
            if (tag.id === correctOrder[index]) {
              return <div key={tag.id}>{tag.content}</div>;
            } else {
              return (
                <div key={tag.id} className='placeholder'>
                  {/* Render a placeholder if the order is incorrect */}
                  <p>
                    This section cannot be displayed yet. Please adjust the tag
                    order.
                  </p>
                </div>
              );
            }
          })}
        </div>
      </section>
    </main>
  );
};

export default GameContainer;
