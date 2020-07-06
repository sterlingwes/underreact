const SharedElement = ({ onClick }) => (
  <div onClick={onClick}>
    I'm shared! Demonstrating that an index can be used to attach event handlers to the correct
    elements even if they're the same "element class".
  </div>
);

const items = ['apple', 'orange'];

const healthyClickHandler = () => {};
const funClickHandler = () => {};

const object = (
  <div>
    {items.map((item) => (
      <SharedElement onClick={healthyClickHandler}>{item}</SharedElement>
    ))}
    <SharedElement onClick={funClickHandler}>Beer</SharedElement>
  </div>
);
