var ComponentA = () => <div>This is ComponentA</div>;
var ComponentB = () => <div>This is ComponentB</div>;
var MyOtherComponent = ({ someValue }) => {
  const Component = someValue ? ComponentA : ComponentB;
  return <Component />;
};

var object = (
  <div>
    <strong>Hello,</strong> world!
    <MyOtherComponent someValue={true} />
    <ComponentA>
      <ComponentB>
        <div />
      </ComponentB>
    </ComponentA>
  </div>
);
